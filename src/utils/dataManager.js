// Data management utilities for hostel management system
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

// Import validation functions with fallback
let validateData, showValidationErrors, showValidationSuccess;
try {
  // Use dynamic import for ES6 modules
  const validationModule = await import('./dataValidation');
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
  payments: [],
  fees: [],
  paymentPlans: [],
  feeTransactions: []
};

// Initialize with sample data if needed
export const initializeDataStore = (sampleData = null) => {
  if (sampleData) {
    dataStore = {
      hostels: sampleData.hostels || [],
      floors: sampleData.floors || [],
      rooms: sampleData.rooms || [],
      amenities: sampleData.amenities || [],
      occupants: sampleData.occupants || [],
      bookings: sampleData.bookings || [],
      payments: sampleData.payments || [],
      fees: sampleData.fees || [],
      paymentPlans: sampleData.paymentPlans || [],
      feeTransactions: sampleData.feeTransactions || [],
      roomChangeRequests: sampleData.roomChangeRequests || []
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
    payments: [],
    fees: [],
    paymentPlans: [],
    feeTransactions: [],
    roomChangeRequests: []
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
  getRoomChangeRequests,
  // Due Fees Management
  createFeeRecord,
  updateFeeStatus,
  getFeeRecords,
  calculateOverdueFees,
  processFeePayment,
  createPaymentPlan,
  updatePaymentPlan,
  getPaymentPlans,
  getFeeStatistics,
  bulkUpdateFees,
  generateFeeReport
};

// Due Fees Management Functions

// Create fee record
export const createFeeRecord = async (feeData) => {
  try {
    // Validate required fields
    const requiredFields = ['occupantId', 'roomId', 'feeType', 'amount', 'dueDate'];
    for (const field of requiredFields) {
      if (!feeData[field]) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return { success: false, error: `${field} is required` };
      }
    }

    // Validate amount
    if (feeData.amount <= 0) {
      toast.error('Fee amount must be greater than 0');
      return { success: false, error: 'Invalid amount' };
    }

    // Validate due date
    const dueDate = new Date(feeData.dueDate);
    if (isNaN(dueDate.getTime())) {
      toast.error('Invalid due date');
      return { success: false, error: 'Invalid due date' };
    }

    // Generate fee record
    const feeRecord = {
      id: uuidv4(),
      ...feeData,
      status: 'pending',
      amountPaid: 0,
      amountDue: feeData.amount,
      penaltyAmount: 0,
      totalAmount: feeData.amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentHistory: [],
      remindersSent: 0,
      lastReminderDate: null
    };

    // Add to data store
    if (!dataStore.fees) {
      dataStore.fees = [];
    }

    dataStore.fees.push(feeRecord);
    toast.success('Fee record created successfully');
    
    return { success: true, data: feeRecord };
  } catch (error) {
    toast.error(`Error creating fee record: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Update fee status
export const updateFeeStatus = async (feeId, status, notes = '') => {
  try {
    const validStatuses = ['pending', 'partial', 'paid', 'overdue', 'waived', 'cancelled'];
    if (!validStatuses.includes(status)) {
      toast.error('Invalid fee status');
      return { success: false, error: 'Invalid status' };
    }

    const fees = dataStore.fees || [];
    const index = fees.findIndex(fee => fee.id === feeId);
    
    if (index === -1) {
      toast.error('Fee record not found');
      return { success: false, error: 'Fee not found' };
    }

    const updatedFee = {
      ...fees[index],
      status,
      updatedAt: new Date().toISOString(),
      notes: notes || fees[index].notes
    };

    // Add status change to payment history
    updatedFee.paymentHistory.push({
      id: uuidv4(),
      type: 'status_change',
      fromStatus: fees[index].status,
      toStatus: status,
      notes,
      timestamp: new Date().toISOString(),
      updatedBy: 'System'
    });

    dataStore.fees[index] = updatedFee;
    
    const statusMessages = {
      paid: 'Fee marked as paid',
      overdue: 'Fee marked as overdue',
      waived: 'Fee waived successfully',
      cancelled: 'Fee cancelled'
    };

    toast.success(statusMessages[status] || `Fee status updated to ${status}`);
    return { success: true, data: updatedFee };
  } catch (error) {
    toast.error(`Error updating fee status: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Get fee records with filtering
export const getFeeRecords = async (filters = {}) => {
  try {
    let fees = [...(dataStore.fees || [])];

    // Apply filters
    if (filters.status) {
      fees = fees.filter(fee => fee.status === filters.status);
    }
    
    if (filters.occupantId) {
      fees = fees.filter(fee => fee.occupantId === filters.occupantId);
    }

    if (filters.roomId) {
      fees = fees.filter(fee => fee.roomId === filters.roomId);
    }

    if (filters.feeType) {
      fees = fees.filter(fee => fee.feeType === filters.feeType);
    }

    if (filters.overdue) {
      const now = new Date();
      fees = fees.filter(fee => {
        const dueDate = new Date(fee.dueDate);
        return dueDate < now && fee.status !== 'paid';
      });
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      fees = fees.filter(fee => {
        const feeDate = new Date(fee.dueDate);
        return feeDate >= new Date(start) && feeDate <= new Date(end);
      });
    }

    // Sort by due date (oldest first)
    fees.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return { success: true, data: fees };
  } catch (error) {
    toast.error(`Error getting fee records: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Calculate overdue fees with penalties
export const calculateOverdueFees = async () => {
  try {
    const fees = dataStore.fees || [];
    const now = new Date();
    let updatedCount = 0;

    for (let fee of fees) {
      if (fee.status === 'paid' || fee.status === 'waived' || fee.status === 'cancelled') {
        continue;
      }

      const dueDate = new Date(fee.dueDate);
      const daysPastDue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));

      if (daysPastDue > 0) {
        // Calculate penalty based on days overdue
        let penaltyRate = 0;
        if (daysPastDue <= 7) {
          penaltyRate = 0.02; // 2% for first week
        } else if (daysPastDue <= 30) {
          penaltyRate = 0.05; // 5% for first month
        } else {
          penaltyRate = 0.10; // 10% after a month
        }

        const penaltyAmount = fee.amount * penaltyRate;
        const totalAmount = fee.amount + penaltyAmount;

        // Update fee record
        const updatedFee = {
          ...fee,
          status: 'overdue',
          penaltyAmount,
          totalAmount,
          daysPastDue,
          updatedAt: new Date().toISOString()
        };

        const index = fees.findIndex(f => f.id === fee.id);
        dataStore.fees[index] = updatedFee;
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      toast.success(`Updated ${updatedCount} overdue fee records with penalties`);
    }

    return { success: true, updatedCount };
  } catch (error) {
    toast.error(`Error calculating overdue fees: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Process fee payment
export const processFeePayment = async (feeId, paymentData) => {
  try {
    // Validate required fields
    const requiredFields = ['amount', 'paymentMethod'];
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return { success: false, error: `${field} is required` };
      }
    }

    const fees = dataStore.fees || [];
    const index = fees.findIndex(fee => fee.id === feeId);
    
    if (index === -1) {
      toast.error('Fee record not found');
      return { success: false, error: 'Fee not found' };
    }

    const fee = fees[index];
    const paymentAmount = parseFloat(paymentData.amount);

    if (paymentAmount <= 0) {
      toast.error('Payment amount must be greater than 0');
      return { success: false, error: 'Invalid payment amount' };
    }

    if (paymentAmount > fee.totalAmount - fee.amountPaid) {
      toast.error('Payment amount exceeds outstanding balance');
      return { success: false, error: 'Payment amount too high' };
    }

    // Create payment record
    const payment = {
      id: uuidv4(),
      feeId,
      amount: paymentAmount,
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId || uuidv4(),
      notes: paymentData.notes || '',
      processedAt: new Date().toISOString(),
      processedBy: paymentData.processedBy || 'System'
    };

    // Update fee record
    const newAmountPaid = fee.amountPaid + paymentAmount;
    const newAmountDue = fee.totalAmount - newAmountPaid;
    
    let newStatus = 'partial';
    if (newAmountDue <= 0) {
      newStatus = 'paid';
    }

    const updatedFee = {
      ...fee,
      amountPaid: newAmountPaid,
      amountDue: newAmountDue,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      paymentHistory: [...fee.paymentHistory, {
        ...payment,
        type: 'payment'
      }]
    };

    // Add payment transaction
    if (!dataStore.feeTransactions) {
      dataStore.feeTransactions = [];
    }
    dataStore.feeTransactions.push(payment);

    dataStore.fees[index] = updatedFee;
    
    toast.success(`Payment of $${paymentAmount} processed successfully`);
    return { success: true, data: { fee: updatedFee, payment } };
  } catch (error) {
    toast.error(`Error processing payment: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Create payment plan
export const createPaymentPlan = async (feeId, planData) => {
  try {
    // Validate required fields
    const requiredFields = ['installments', 'startDate'];
    for (const field of requiredFields) {
      if (!planData[field]) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return { success: false, error: `${field} is required` };
      }
    }

    const fees = dataStore.fees || [];
    const fee = fees.find(f => f.id === feeId);
    
    if (!fee) {
      toast.error('Fee record not found');
      return { success: false, error: 'Fee not found' };
    }

    if (fee.status === 'paid') {
      toast.error('Cannot create payment plan for paid fee');
      return { success: false, error: 'Fee already paid' };
    }

    const numberOfInstallments = parseInt(planData.installments);
    if (numberOfInstallments < 2 || numberOfInstallments > 12) {
      toast.error('Number of installments must be between 2 and 12');
      return { success: false, error: 'Invalid installments' };
    }

    const remainingAmount = fee.totalAmount - fee.amountPaid;
    const installmentAmount = Math.ceil(remainingAmount / numberOfInstallments * 100) / 100;

    // Generate installment schedule
    const installments = [];
    const startDate = new Date(planData.startDate);

    for (let i = 0; i < numberOfInstallments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      // Adjust last installment to cover any rounding difference
      const amount = i === numberOfInstallments - 1 
        ? remainingAmount - (installmentAmount * (numberOfInstallments - 1))
        : installmentAmount;

      installments.push({
        id: uuidv4(),
        installmentNumber: i + 1,
        amount: Math.max(amount, 0),
        dueDate: dueDate.toISOString(),
        status: 'pending',
        paidAmount: 0,
        paidDate: null
      });
    }

    // Create payment plan
    const paymentPlan = {
      id: uuidv4(),
      feeId,
      occupantId: fee.occupantId,
      totalAmount: remainingAmount,
      numberOfInstallments,
      installmentAmount,
      installments,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: planData.notes || ''
    };

    // Add to data store
    if (!dataStore.paymentPlans) {
      dataStore.paymentPlans = [];
    }
    dataStore.paymentPlans.push(paymentPlan);

    toast.success(`Payment plan created with ${numberOfInstallments} installments`);
    return { success: true, data: paymentPlan };
  } catch (error) {
    toast.error(`Error creating payment plan: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Update payment plan
export const updatePaymentPlan = async (planId, installmentId, paymentAmount) => {
  try {
    const plans = dataStore.paymentPlans || [];
    const planIndex = plans.findIndex(plan => plan.id === planId);
    
    if (planIndex === -1) {
      toast.error('Payment plan not found');
      return { success: false, error: 'Plan not found' };
    }

    const plan = plans[planIndex];
    const installmentIndex = plan.installments.findIndex(inst => inst.id === installmentId);
    
    if (installmentIndex === -1) {
      toast.error('Installment not found');
      return { success: false, error: 'Installment not found' };
    }

    const installment = plan.installments[installmentIndex];
    const amount = parseFloat(paymentAmount);

    if (amount <= 0 || amount > installment.amount - installment.paidAmount) {
      toast.error('Invalid payment amount');
      return { success: false, error: 'Invalid amount' };
    }

    // Update installment
    const updatedInstallment = {
      ...installment,
      paidAmount: installment.paidAmount + amount,
      status: (installment.paidAmount + amount) >= installment.amount ? 'paid' : 'partial',
      paidDate: (installment.paidAmount + amount) >= installment.amount ? new Date().toISOString() : installment.paidDate
    };

    plan.installments[installmentIndex] = updatedInstallment;

    // Check if all installments are paid
    const allPaid = plan.installments.every(inst => inst.status === 'paid');
    if (allPaid) {
      plan.status = 'completed';
    }

    plan.updatedAt = new Date().toISOString();
    dataStore.paymentPlans[planIndex] = plan;

    toast.success(`Installment payment of $${amount} recorded`);
    return { success: true, data: plan };
  } catch (error) {
    toast.error(`Error updating payment plan: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Get payment plans
export const getPaymentPlans = async (filters = {}) => {
  try {
    let plans = [...(dataStore.paymentPlans || [])];

    // Apply filters
    if (filters.feeId) {
      plans = plans.filter(plan => plan.feeId === filters.feeId);
    }
    
    if (filters.occupantId) {
      plans = plans.filter(plan => plan.occupantId === filters.occupantId);
    }

    if (filters.status) {
      plans = plans.filter(plan => plan.status === filters.status);
    }

    // Sort by creation date (newest first)
    plans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { success: true, data: plans };
  } catch (error) {
    toast.error(`Error getting payment plans: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Get fee statistics
export const getFeeStatistics = async () => {
  try {
    const fees = dataStore.fees || [];
    const plans = dataStore.paymentPlans || [];
    const transactions = dataStore.feeTransactions || [];

    const totalFees = fees.length;
    const totalAmount = fees.reduce((sum, fee) => sum + fee.totalAmount, 0);
    const totalPaid = fees.reduce((sum, fee) => sum + fee.amountPaid, 0);
    const totalOutstanding = totalAmount - totalPaid;

    const overdueCount = fees.filter(fee => {
      const dueDate = new Date(fee.dueDate);
      return dueDate < new Date() && fee.status !== 'paid';
    }).length;

    const penaltyAmount = fees.reduce((sum, fee) => sum + (fee.penaltyAmount || 0), 0);

    const statusCounts = fees.reduce((acc, fee) => {
      acc[fee.status] = (acc[fee.status] || 0) + 1;
      return acc;
    }, {});

    const activePlans = plans.filter(plan => plan.status === 'active').length;
    const completedPlans = plans.filter(plan => plan.status === 'completed').length;

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt))
      .slice(0, 10);

    const statistics = {
      totalFees,
      totalAmount,
      totalPaid,
      totalOutstanding,
      overdueCount,
      penaltyAmount,
      collectionRate: totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0,
      statusCounts,
      paymentPlans: {
        active: activePlans,
        completed: completedPlans,
        total: activePlans + completedPlans
      },
      recentTransactions
    };

    return { success: true, data: statistics };
  } catch (error) {
    toast.error(`Error getting fee statistics: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Bulk update fees
export const bulkUpdateFees = async (feeIds, updates) => {
  try {
    const results = [];
    
    for (const feeId of feeIds) {
      const result = await updateFeeStatus(feeId, updates.status, updates.notes);
      results.push(result);
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    if (failed === 0) {
      toast.success(`Successfully updated ${successful} fee records`);
    } else {
      toast.warning(`Updated ${successful} fees, failed ${failed}`);
    }

    return { success: failed === 0, results };
  } catch (error) {
    toast.error(`Error in bulk update: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Generate fee report
export const generateFeeReport = async (dateRange = {}) => {
  try {
    const { start, end } = dateRange;
    let fees = [...(dataStore.fees || [])];

    // Filter by date range if provided
    if (start && end) {
      fees = fees.filter(fee => {
        const feeDate = new Date(fee.dueDate);
        return feeDate >= new Date(start) && feeDate <= new Date(end);
      });
    }

    const reportData = {
      summary: {
        totalFees: fees.length,
        totalAmount: fees.reduce((sum, fee) => sum + fee.totalAmount, 0),
        totalPaid: fees.reduce((sum, fee) => sum + fee.amountPaid, 0),
        totalOutstanding: fees.reduce((sum, fee) => sum + (fee.totalAmount - fee.amountPaid), 0),
        totalPenalties: fees.reduce((sum, fee) => sum + (fee.penaltyAmount || 0), 0)
      },
      byStatus: fees.reduce((acc, fee) => {
        if (!acc[fee.status]) {
          acc[fee.status] = { count: 0, amount: 0 };
        }
        acc[fee.status].count++;
        acc[fee.status].amount += fee.totalAmount;
        return acc;
      }, {}),
      byFeeType: fees.reduce((acc, fee) => {
        if (!acc[fee.feeType]) {
          acc[fee.feeType] = { count: 0, amount: 0 };
        }
        acc[fee.feeType].count++;
        acc[fee.feeType].amount += fee.totalAmount;
        return acc;
      }, {}),
      overdueFees: fees.filter(fee => {
        const dueDate = new Date(fee.dueDate);
        return dueDate < new Date() && fee.status !== 'paid';
      }),
      generatedAt: new Date().toISOString(),
      dateRange: { start, end }
    };

    toast.success('Fee report generated successfully');
    return { success: true, data: reportData };
  } catch (error) {
    toast.error(`Error generating fee report: ${error.message}`);
    return { success: false, error: error.message };
  }
};