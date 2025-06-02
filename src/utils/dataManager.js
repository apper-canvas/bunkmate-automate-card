// Data management utilities for hostel management system
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

// Import validation functions with fallback
let validateData, showValidationErrors, showValidationSuccess;
try {
  const validationModule = require('./dataValidation');
  validateData = validationModule.validateData;
  showValidationErrors = validationModule.showValidationErrors;
  showValidationSuccess = validationModule.showValidationSuccess;
} catch (error) {
  // Fallback validation functions if module doesn't exist
  validateData = (data, entityType) => ({ isValid: true, errors: [] });
  showValidationErrors = (errors) => console.warn('Validation errors:', errors);
  showValidationSuccess = (message) => console.log('Validation success:', message);
}

// In-memory data store (in a real app, this would be connected to a database)
let dataStore = {
  hostels: [],
  floors: [],
  rooms: [],
  amenities: [],
  occupants: [],
  bookings: [],
  payments: []
};

// Initialize with sample data if needed
export const initializeDataStore = (sampleData = null) => {
  if (sampleData) {
    dataStore = {
      hostels: sampleData.hostels || [],
      floors: sampleData.floors || [],
      rooms: sampleData.rooms || [],
      amenities: sampleData.amenities || [],
      occupants: [],
      bookings: [],
      payments: []
    };
    toast.success('Data store initialized with sample data');
  }
};

// Generic CRUD operations
export const createEntity = async (entityType, data) => {
  try {
    // Input validation
    if (!entityType || typeof entityType !== 'string') {
      toast.error('Invalid entity type provided');
      return { success: false, error: 'Invalid entity type' };
    }
    
    if (!data || typeof data !== 'object') {
      toast.error('Invalid data provided');
      return { success: false, error: 'Invalid data' };
    }

    // Validate the data
    const validation = validateData(data, entityType);
    if (!validation.isValid) {
      showValidationErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }
    // Generate ID if not provided
    if (!data.id) {
      data.id = uuidv4();
    }

    // Set timestamps
    const now = new Date().toISOString();
    data.timestamps = {
      ...data.timestamps,
      createdAt: now,
      updatedAt: now
    };

    // Add to data store
    if (!dataStore[`${entityType}s`]) {
      dataStore[`${entityType}s`] = [];
    }

    dataStore[`${entityType}s`].push(data);

    toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} created successfully`);
    return { success: true, data: data };
  } catch (error) {
    toast.error(`Error creating ${entityType}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const readEntity = async (entityType, id) => {
  try {
    // Input validation
    if (!entityType || typeof entityType !== 'string') {
      toast.error('Invalid entity type provided');
      return { success: false, error: 'Invalid entity type' };
    }
    
    if (!id) {
      toast.error('Entity ID is required');
      return { success: false, error: 'ID is required' };
    }

    const entities = dataStore[`${entityType}s`] || [];
    const entity = entities.find(item => item && item.id === id);
    
    if (!entity) {
      toast.error(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} not found`);
      return { success: false, error: 'Entity not found' };
    }

    return { success: true, data: entity };
  } catch (error) {
    toast.error(`Error reading ${entityType}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const updateEntity = async (entityType, id, data) => {
  try {
    // Input validation
    if (!entityType || typeof entityType !== 'string') {
      toast.error('Invalid entity type provided');
      return { success: false, error: 'Invalid entity type' };
    }
    
    if (!id) {
      toast.error('Entity ID is required');
      return { success: false, error: 'ID is required' };
    }
    
    if (!data || typeof data !== 'object') {
      toast.error('Invalid data provided');
      return { success: false, error: 'Invalid data' };
    }

    // Validate the data
    const validation = validateData(data, entityType);
    if (!validation.isValid) {
      showValidationErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }
    const entities = dataStore[`${entityType}s`] || [];
    const index = entities.findIndex(item => item.id === id);
    
    if (index === -1) {
      toast.error(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} not found`);
      return { success: false, error: 'Entity not found' };
    }

    // Update timestamps
    data.timestamps = {
      ...data.timestamps,
      updatedAt: new Date().toISOString()
    };

    // Update the entity
    dataStore[`${entityType}s`][index] = { ...entities[index], ...data };

    toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} updated successfully`);
    return { success: true, data: dataStore[`${entityType}s`][index] };
  } catch (error) {
    toast.error(`Error updating ${entityType}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const deleteEntity = async (entityType, id) => {
  try {
    // Input validation
    if (!entityType || typeof entityType !== 'string') {
      toast.error('Invalid entity type provided');
      return { success: false, error: 'Invalid entity type' };
    }
    
    if (!id) {
      toast.error('Entity ID is required');
      return { success: false, error: 'ID is required' };
    }

    const entities = dataStore[`${entityType}s`] || [];
    const index = entities.findIndex(item => item && item.id === id);
    
    if (index === -1) {
      toast.error(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} not found`);
      return { success: false, error: 'Entity not found' };
    }

    // Remove the entity
    const deletedEntity = dataStore[`${entityType}s`].splice(index, 1)[0];

    toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} deleted successfully`);
    return { success: true, data: deletedEntity };
  } catch (error) {
    toast.error(`Error deleting ${entityType}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// List operations with filtering, sorting, and pagination
export const listEntities = async (entityType, options = {}) => {
  try {
    let entities = [...(dataStore[`${entityType}s`] || [])];

    // Apply filters
    if (options.filters) {
      entities = applyFilters(entities, options.filters);
    }

    // Apply search
    if (options.search) {
      entities = applySearch(entities, options.search, entityType);
    }

    // Apply sorting
    if (options.sortBy) {
      entities = applySorting(entities, options.sortBy, options.sortOrder || 'asc');
    }

    // Get total count before pagination
    const totalCount = entities.length;

    // Apply pagination
    if (options.page && options.limit) {
      const startIndex = (options.page - 1) * options.limit;
      const endIndex = startIndex + options.limit;
      entities = entities.slice(startIndex, endIndex);
    }

    return {
      success: true,
      data: entities,
      pagination: {
        total: totalCount,
        page: options.page || 1,
        limit: options.limit || totalCount,
        totalPages: options.limit ? Math.ceil(totalCount / options.limit) : 1
      }
    };
  } catch (error) {
    toast.error(`Error listing ${entityType}s: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Advanced filtering
const applyFilters = (entities, filters) => {
  return entities.filter(entity => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return true; // Skip empty filters
      }

      const entityValue = getNestedValue(entity, key);
      
      if (typeof value === 'object' && value.operator) {
        // Advanced filtering with operators
        switch (value.operator) {
          case 'eq':
            return entityValue === value.value;
          case 'ne':
            return entityValue !== value.value;
          case 'gt':
            return entityValue > value.value;
          case 'gte':
            return entityValue >= value.value;
          case 'lt':
            return entityValue < value.value;
          case 'lte':
            return entityValue <= value.value;
          case 'in':
            return Array.isArray(value.value) && value.value.includes(entityValue);
          case 'nin':
            return Array.isArray(value.value) && !value.value.includes(entityValue);
          case 'contains':
            return String(entityValue).toLowerCase().includes(String(value.value).toLowerCase());
          case 'startsWith':
            return String(entityValue).toLowerCase().startsWith(String(value.value).toLowerCase());
          case 'endsWith':
            return String(entityValue).toLowerCase().endsWith(String(value.value).toLowerCase());
          default:
            return entityValue === value.value;
        }
      } else {
        // Simple equality check
        return entityValue === value;
      }
    });
  });
};

// Search functionality
const applySearch = (entities, searchTerm, entityType) => {
  const searchFields = getSearchFields(entityType);
  const lowerSearchTerm = searchTerm.toLowerCase();

  return entities.filter(entity => {
    return searchFields.some(field => {
      const value = getNestedValue(entity, field);
      return String(value).toLowerCase().includes(lowerSearchTerm);
    });
  });
};

// Get searchable fields for each entity type
const getSearchFields = (entityType) => {
  const searchFieldsMap = {
    hostel: ['name', 'location.city', 'location.state', 'contact.email', 'management.managerName'],
    room: ['roomNumber', 'type', 'pricing.baseRent'],
    floor: ['floorName', 'blockName', 'type'],
    amenity: ['name', 'category', 'type', 'description', 'specifications.brand']
  };

  return searchFieldsMap[entityType] || ['name'];
};

// Sorting functionality
const applySorting = (entities, sortBy, sortOrder) => {
  return entities.sort((a, b) => {
    const aValue = getNestedValue(a, sortBy);
    const bValue = getNestedValue(b, sortBy);

    let comparison = 0;
    
    if (aValue < bValue) {
      comparison = -1;
    } else if (aValue > bValue) {
      comparison = 1;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  } catch (error) {
    return null;
  }
};

// Specialized hostel operations
export const getHostelStatistics = async (hostelId) => {
  try {
    if (!hostelId) {
      toast.error('Hostel ID is required');
      return { success: false, error: 'Hostel ID is required' };
    }

    const hostel = await readEntity('hostel', hostelId);
    if (!hostel.success) {
      return hostel;
    }

    const floors = (dataStore.floors || []).filter(floor => floor && floor.hostelId === hostelId);
    const rooms = (dataStore.rooms || []).filter(room => room && room.hostelId === hostelId);
    const amenities = (dataStore.amenities || []).filter(amenity => 
      amenity && amenity.location && amenity.location.hostelId === hostelId
    );

const statistics = {
      totalFloors: floors.length,
      totalRooms: rooms.length,
      totalAmenities: amenities.length,
      occupiedRooms: rooms.filter(room => room && room.availability && room.availability.status === 'occupied').length,
      availableRooms: rooms.filter(room => room && room.availability && room.availability.status === 'available').length,
      maintenanceRooms: rooms.filter(room => room && room.availability && room.availability.status === 'maintenance').length,
      occupancyRate: rooms.length > 0 ? (rooms.filter(room => room && room.availability && room.availability.status === 'occupied').length / rooms.length) * 100 : 0,
      averageRent: rooms.length > 0 ? rooms.reduce((sum, room) => sum + (room && room.pricing && room.pricing.baseRent || 0), 0) / rooms.length : 0,
      monthlyRevenue: rooms.filter(room => room && room.availability && room.availability.status === 'occupied').reduce((sum, room) => sum + (room && room.pricing && room.pricing.baseRent || 0), 0)
    };

    return { success: true, data: statistics };
  } catch (error) {
    toast.error(`Error getting hostel statistics: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Room availability operations
export const updateRoomAvailability = async (roomId, status, availableFrom = null, nextAvailable = null) => {
  try {
    const validStatuses = ['available', 'occupied', 'maintenance', 'reserved', 'cleaning'];
    if (!validStatuses.includes(status)) {
      toast.error('Invalid room status');
      return { success: false, error: 'Invalid status' };
    }

    const room = await readEntity('room', roomId);
    if (!room.success) {
      return room;
    }

    const updatedRoom = {
      ...room.data,
      availability: {
        ...room.data.availability,
        status,
        availableFrom,
        nextAvailable
      }
    };

    const result = await updateEntity('room', roomId, updatedRoom);
    
    if (result.success) {
      toast.success(`Room ${room.data.roomNumber} status updated to ${status}`);
    }

    return result;
  } catch (error) {
    toast.error(`Error updating room availability: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Amenity maintenance operations
export const reportAmenityIssue = async (amenityId, issueDescription, priority = 'medium') => {
  try {
    const amenity = await readEntity('amenity', amenityId);
    if (!amenity.success) {
      return amenity;
    }

    const issue = {
      issueId: uuidv4(),
      reportedDate: new Date().toISOString(),
      reportedBy: 'System', // In a real app, this would be the current user
      description: issueDescription,
      priority,
      status: 'reported',
      resolvedDate: null,
      resolutionNotes: ''
    };

    const updatedAmenity = {
      ...amenity.data,
      maintenance: {
        ...amenity.data.maintenance,
        issues: [...(amenity.data.maintenance.issues || []), issue]
      }
    };

    const result = await updateEntity('amenity', amenityId, updatedAmenity);
    
    if (result.success) {
      toast.success(`Issue reported for ${amenity.data.name}`);
    }

    return result;
  } catch (error) {
    toast.error(`Error reporting amenity issue: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Search operations
export const searchEntities = async (entityType, searchTerm, options = {}) => {
  return await listEntities(entityType, { ...options, search: searchTerm });
};

// Bulk operations
export const bulkUpdateEntities = async (entityType, updates) => {
  try {
    const results = [];
    
    for (const update of updates) {
      const result = await updateEntity(entityType, update.id, update.data);
      results.push(result);
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    if (failed === 0) {
      toast.success(`Successfully updated ${successful} ${entityType}s`);
    } else {
      toast.warning(`Updated ${successful} ${entityType}s, failed ${failed}`);
    }

    return { success: failed === 0, results };
  } catch (error) {
    toast.error(`Error in bulk update: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Export data
export const exportData = (entityType, format = 'json') => {
  try {
    const entities = dataStore[`${entityType}s`] || [];
    
    let exportData;
    let filename;
    let mimeType;

    switch (format) {
      case 'json':
        exportData = JSON.stringify(entities, null, 2);
        filename = `${entityType}s_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      case 'csv':
        exportData = convertToCSV(entities);
        filename = `${entityType}s_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
        break;
      default:
        throw new Error('Unsupported export format');
    }
// Create download link (browser environment check)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`${entityType}s exported successfully`);
    } else {
      // Node.js environment or no DOM
      console.log('Export data:', exportData);
      toast.info(`${entityType}s data prepared for export`);
    }
    toast.success(`${entityType}s exported successfully`);
    return { success: true };
  } catch (error) {
    toast.error(`Error exporting data: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Convert objects to CSV format
const convertToCSV = (objects) => {
  if (!Array.isArray(objects) || objects.length === 0) return '';

  const firstObject = objects.find(obj => obj && typeof obj === 'object');
  if (!firstObject) return '';

  const headers = Object.keys(flattenObject(firstObject));
  const csvContent = [
    headers.join(','),
    ...objects.map(obj => headers.map(header => {
      const value = getNestedValue(obj, header);
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  return csvContent;
};

// Flatten nested objects for CSV export
const flattenObject = (obj, prefix = '') => {
  const flattened = {};
  
  if (!obj || typeof obj !== 'object') {
    return flattened;
  }
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'));
      } else {
        flattened[prefix + key] = obj[key];
      }
    }
  }
  
  return flattened;
};

// Get current data store (for debugging)
export const getDataStore = () => dataStore;

// Clear data store
export const clearDataStore = () => {
  dataStore = {
    hostels: [],
    floors: [],
    rooms: [],
    amenities: [],
    occupants: [],
    bookings: [],
    payments: []
  };
  toast.info('Data store cleared');
};

// Room availability checking functions
export const checkRoomAvailability = async (criteria = {}) => {
  try {
    const {
      checkInDate,
      checkOutDate,
      roomType,
      guestCount,
      hostelId,
      amenities = [],
      maxPrice,
      minPrice
    } = criteria;

    let availableRooms = [...(dataStore.rooms || [])];

    // Filter by hostel if specified
    if (hostelId) {
      availableRooms = availableRooms.filter(room => room.hostelId === hostelId);
    }

    // Filter by availability status
    availableRooms = availableRooms.filter(room => 
      room.availability.status === 'available' || room.availability.status === 'partial'
    );

    // Filter by room type
    if (roomType && roomType !== 'all') {
      availableRooms = availableRooms.filter(room => room.type === roomType);
    }

    // Filter by guest capacity
if (guestCount) {
      availableRooms = availableRooms.filter(room => {
        if (!room.capacity || typeof room.capacity.maxOccupants !== 'number' || typeof room.capacity.currentOccupants !== 'number') {
          return false;
        }
        const availableCapacity = room.capacity.maxOccupants - room.capacity.currentOccupants;
        return availableCapacity >= parseInt(guestCount);
      });
    }

    // Filter by date availability
    if (checkInDate) {
      const checkIn = new Date(checkInDate);
      availableRooms = availableRooms.filter(room => {
        if (room.availability.availableFrom) {
          return new Date(room.availability.availableFrom) <= checkIn;
        }
        return true;
      });
    }

    if (checkOutDate && checkInDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const stayDuration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

      // Check if room will be available for the entire duration
      availableRooms = availableRooms.filter(room => {
        if (room.availability.nextAvailable) {
          const nextAvailable = new Date(room.availability.nextAvailable);
          return nextAvailable >= checkOut;
        }
        return true;
      });
    }

    // Filter by amenities
if (amenities.length > 0) {
      availableRooms = availableRooms.filter(room => {
        const roomAmenities = (room && room.amenities && room.amenities.available) ? room.amenities.available : [];
        return Array.isArray(roomAmenities) && amenities.every(amenity => roomAmenities.includes(amenity));
      });
    }

// Filter by price range
    if (minPrice) {
      availableRooms = availableRooms.filter(room => 
        room && room.pricing && typeof room.pricing.baseRent === 'number' && room.pricing.baseRent >= minPrice
      );
    }

    if (maxPrice) {
      availableRooms = availableRooms.filter(room => 
        room && room.pricing && typeof room.pricing.baseRent === 'number' && room.pricing.baseRent <= maxPrice
      );
    }
    // Add calculated fields
    const enrichedRooms = availableRooms.map(room => {
      const availableBeds = room.capacity.maxOccupants - room.capacity.currentOccupants;
      let totalCost = room.pricing.baseRent;

      if (checkInDate && checkOutDate) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const stayDuration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const dailyRate = room.pricing.baseRent / 30; // Assuming monthly rent
        totalCost = dailyRate * stayDuration;
      }

      return {
        ...room,
        availableBeds,
        totalCost,
        isFullyAvailable: availableBeds >= (guestCount || 1)
      };
    });

    // Sort by price (ascending)
    enrichedRooms.sort((a, b) => a.pricing.baseRent - b.pricing.baseRent);

    toast.success(`Found ${enrichedRooms.length} available rooms matching your criteria`);

    return {
      success: true,
      data: enrichedRooms,
      totalFound: enrichedRooms.length,
      criteria: criteria
    };

  } catch (error) {
    toast.error(`Error checking room availability: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Bulk availability check for multiple date ranges
export const bulkAvailabilityCheck = async (dateRanges = [], roomTypes = []) => {
  try {
    const results = [];

    for (const dateRange of dateRanges) {
      for (const roomType of roomTypes) {
        const result = await checkRoomAvailability({
          checkInDate: dateRange.checkIn,
          checkOutDate: dateRange.checkOut,
          roomType: roomType
        });

        results.push({
          dateRange,
          roomType,
          availableRooms: result.success ? result.data : [],
          totalAvailable: result.success ? result.data.length : 0
        });
      }
    }

    return { success: true, data: results };
  } catch (error) {
    toast.error(`Error in bulk availability check: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Get available rooms for a specific date
export const getAvailableRoomsByDate = async (date, hostelId = null) => {
  try {
    const criteria = {
      checkInDate: date,
      checkOutDate: date
    };

    if (hostelId) {
      criteria.hostelId = hostelId;
    }

    const result = await checkRoomAvailability(criteria);
    
    if (result.success) {
      // Group by room type
      const groupedRooms = result.data.reduce((acc, room) => {
        if (!acc[room.type]) {
          acc[room.type] = [];
        }
        acc[room.type].push(room);
        return acc;
      }, {});

      return {
        success: true,
        data: groupedRooms,
        totalRooms: result.data.length,
        date: date
      };
    }

    return result;
  } catch (error) {
    toast.error(`Error getting rooms by date: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Search rooms by amenities
export const searchRoomsByAmenities = async (requiredAmenities = [], optionalAmenities = []) => {
  try {
    let rooms = [...(dataStore.rooms || [])];

    // Filter by required amenities (must have all)
    if (requiredAmenities.length > 0) {
      rooms = rooms.filter(room => {
        const roomAmenities = room.amenities?.available || [];
        return requiredAmenities.every(amenity => roomAmenities.includes(amenity));
      });
    }

    // Score by optional amenities (nice to have)
    const scoredRooms = rooms.map(room => {
      const roomAmenities = room.amenities?.available || [];
      const optionalMatches = optionalAmenities.filter(amenity => 
        roomAmenities.includes(amenity)
      ).length;
      
      const amenityScore = optionalAmenities.length > 0 
        ? (optionalMatches / optionalAmenities.length) * 100 
        : 0;

      return {
        ...room,
        amenityScore,
        matchedOptionalAmenities: optionalAmenities.filter(amenity => 
          roomAmenities.includes(amenity)
        )
      };
    });

    // Sort by amenity score (descending) and then by price (ascending)
    scoredRooms.sort((a, b) => {
      if (b.amenityScore !== a.amenityScore) {
        return b.amenityScore - a.amenityScore;
      }
      return a.pricing.baseRent - b.pricing.baseRent;
    });

    toast.success(`Found ${scoredRooms.length} rooms matching amenity criteria`);

    return {
      success: true,
      data: scoredRooms,
      searchCriteria: {
        required: requiredAmenities,
        optional: optionalAmenities
      }
    };

  } catch (error) {
    toast.error(`Error searching by amenities: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Room change request operations
export const createRoomChangeRequest = async (requestData) => {
  try {
    // Validate required fields
    const requiredFields = ['currentRoomId', 'desiredRoomId', 'requestedBy', 'reason'];
    for (const field of requiredFields) {
      if (!requestData[field]) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return { success: false, error: `${field} is required` };
      }
    }

    // Check if current and desired rooms are different
    if (requestData.currentRoomId === requestData.desiredRoomId) {
      toast.error('Current room and desired room cannot be the same');
      return { success: false, error: 'Invalid room selection' };
    }

    // Generate request data
    const request = {
      id: uuidv4(),
      ...requestData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      completedAt: null,
      comments: []
    };

    // Add to data store
    if (!dataStore.roomChangeRequests) {
      dataStore.roomChangeRequests = [];
    }

    dataStore.roomChangeRequests.push(request);
    toast.success('Room change request submitted successfully');
    
    return { success: true, data: request };
  } catch (error) {
    toast.error(`Error creating room change request: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const updateRoomChangeRequestStatus = async (requestId, status, reviewedBy, comments = '') => {
  try {
    const validStatuses = ['pending', 'approved', 'denied', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      toast.error('Invalid status');
      return { success: false, error: 'Invalid status' };
    }

    const requests = dataStore.roomChangeRequests || [];
    const index = requests.findIndex(req => req.id === requestId);
    
    if (index === -1) {
      toast.error('Room change request not found');
      return { success: false, error: 'Request not found' };
    }

    const now = new Date().toISOString();
    const updatedRequest = {
      ...requests[index],
      status,
      updatedAt: now,
      reviewedBy: reviewedBy || requests[index].reviewedBy,
      reviewedAt: status !== 'pending' ? now : requests[index].reviewedAt,
      completedAt: status === 'completed' ? now : requests[index].completedAt
    };

    if (comments) {
      updatedRequest.comments = [
        ...updatedRequest.comments,
        {
          id: uuidv4(),
          text: comments,
          addedBy: reviewedBy,
          addedAt: now
        }
      ];
    }

    dataStore.roomChangeRequests[index] = updatedRequest;
    
    const statusMessages = {
      approved: 'Room change request approved',
      denied: 'Room change request denied',
      completed: 'Room change completed successfully',
      cancelled: 'Room change request cancelled'
    };

    toast.success(statusMessages[status] || `Request status updated to ${status}`);
    return { success: true, data: updatedRequest };
  } catch (error) {
    toast.error(`Error updating request status: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export const getRoomChangeRequests = async (filters = {}) => {
  try {
    let requests = [...(dataStore.roomChangeRequests || [])];

    // Apply filters
    if (filters.status) {
      requests = requests.filter(req => req.status === filters.status);
    }
    
    if (filters.requestedBy) {
      requests = requests.filter(req => req.requestedBy === filters.requestedBy);
    }

    if (filters.currentRoomId) {
      requests = requests.filter(req => req.currentRoomId === filters.currentRoomId);
    }

    // Sort by submission date (newest first)
    requests.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    return { success: true, data: requests };
  } catch (error) {
    toast.error(`Error getting room change requests: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export default {
  initializeDataStore,
  createEntity,
  readEntity,
  updateEntity,
  deleteEntity,
  listEntities,
  searchEntities,
  getHostelStatistics,
  updateRoomAvailability,
  reportAmenityIssue,
  bulkUpdateEntities,
  exportData,
  getDataStore,
  clearDataStore,
  checkRoomAvailability,
  bulkAvailabilityCheck,
  getAvailableRoomsByDate,
  searchRoomsByAmenities,
  createRoomChangeRequest,
  updateRoomChangeRequestStatus,
  getRoomChangeRequests
};