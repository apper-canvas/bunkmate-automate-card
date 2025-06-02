// Data management utilities for hostel management system
import { toast } from 'react-toastify';
import { validateData, showValidationErrors, showValidationSuccess } from './dataValidation';
import { v4 as uuidv4 } from 'uuid';

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
    const entities = dataStore[`${entityType}s`] || [];
    const entity = entities.find(item => item.id === id);
    
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
    const entities = dataStore[`${entityType}s`] || [];
    const index = entities.findIndex(item => item.id === id);
    
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
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

// Specialized hostel operations
export const getHostelStatistics = async (hostelId) => {
  try {
    const hostel = await readEntity('hostel', hostelId);
    if (!hostel.success) {
      return hostel;
    }

    const floors = dataStore.floors.filter(floor => floor.hostelId === hostelId);
    const rooms = dataStore.rooms.filter(room => room.hostelId === hostelId);
    const amenities = dataStore.amenities.filter(amenity => amenity.location.hostelId === hostelId);

    const statistics = {
      totalFloors: floors.length,
      totalRooms: rooms.length,
      totalAmenities: amenities.length,
      occupiedRooms: rooms.filter(room => room.availability.status === 'occupied').length,
      availableRooms: rooms.filter(room => room.availability.status === 'available').length,
      maintenanceRooms: rooms.filter(room => room.availability.status === 'maintenance').length,
      occupancyRate: rooms.length > 0 ? (rooms.filter(room => room.availability.status === 'occupied').length / rooms.length) * 100 : 0,
      averageRent: rooms.length > 0 ? rooms.reduce((sum, room) => sum + (room.pricing.baseRent || 0), 0) / rooms.length : 0,
      monthlyRevenue: rooms.filter(room => room.availability.status === 'occupied').reduce((sum, room) => sum + (room.pricing.baseRent || 0), 0)
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

    // Create download link
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
    return { success: true };
  } catch (error) {
    toast.error(`Error exporting data: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Convert objects to CSV format
const convertToCSV = (objects) => {
  if (objects.length === 0) return '';

  const headers = Object.keys(flattenObject(objects[0]));
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
  
  for (const key in obj) {
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'));
    } else {
      flattened[prefix + key] = obj[key];
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
  clearDataStore
};