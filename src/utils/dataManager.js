// Data management utilities for hostel management system
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

// Import validation functions with fallback
let validateData, showValidationErrors, showValidationSuccess;

// Initialize validation functions asynchronously
const initializeValidation = async () => {
  try {
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
};

// Initialize validation on module load
initializeValidation();

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
      roomChangeRequests: sampleData.roomChangeRequests || [],
      rules: sampleData.rules || sampleRules,
      emergencyAlerts: sampleData.emergencyAlerts || []
    };
  } else {
    dataStore.rules = sampleRules;
    dataStore.emergencyAlerts = [];
  }
};

// Sample rules data
const sampleRules = [
  {
    id: 'rule-1',
    title: 'Check-in and Check-out Times',
    description: 'Standard check-in time is 2:00 PM and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request and subject to additional charges.',
    category: 'Hostel Policies',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-15',
    updatedBy: 'Admin',
    priority: 'high',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-2',
    title: 'Visitor Policy',
    description: 'Visitors are allowed between 9:00 AM and 9:00 PM. All visitors must register at the front desk and provide valid identification. Overnight guests are not permitted.',
    category: 'Resident Guidelines',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-02-01',
    updatedBy: 'Manager',
    priority: 'high',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-3',
    title: 'Common Area Usage',
    description: 'Common areas including kitchen, lounge, and study rooms are available 24/7. Please clean up after use and be considerate of other residents.',
    category: 'Facility Usage',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-20',
    updatedBy: 'Admin',
    priority: 'medium',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-4',
    title: 'Noise Policy',
    description: 'Quiet hours are from 10:00 PM to 8:00 AM. Please be respectful of other residents and keep noise levels to a minimum during these hours.',
    category: 'Resident Guidelines',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-10',
    updatedBy: 'Admin',
    priority: 'high',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-5',
    title: 'Kitchen Usage Guidelines',
    description: 'Kitchen facilities are available for all residents. Clean all utensils and appliances after use. Label and date any food stored in refrigerators.',
    category: 'Facility Usage',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-25',
    updatedBy: 'Manager',
    priority: 'medium',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-6',
    title: 'Emergency Procedures',
    description: 'In case of emergency, use designated emergency exits. Fire extinguishers are located on each floor. Report all emergencies to front desk immediately.',
    category: 'Safety & Security',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-02-10',
    updatedBy: 'Safety Officer',
    priority: 'critical',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-7',
    title: 'Payment Terms',
    description: 'Monthly rent is due by the 5th of each month. Late payment fees apply after the 10th. Security deposits are refundable upon checkout inspection.',
    category: 'Administrative',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-30',
    updatedBy: 'Finance Manager',
    priority: 'high',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-8',
    title: 'Smoking Policy',
    description: 'Smoking is strictly prohibited inside all hostel buildings. Designated smoking areas are available outside. Violation may result in immediate termination.',
    category: 'Resident Guidelines',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-05',
    updatedBy: 'Admin',
    priority: 'critical',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-9',
    title: 'Laundry Facility Usage',
    description: 'Laundry facilities are available 24/7. Maximum usage time is 3 hours per session. Remove clothes promptly after washing/drying cycles complete.',
    category: 'Facility Usage',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-02-05',
    updatedBy: 'Manager',
    priority: 'low',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-10',
    title: 'Room Maintenance Requests',
    description: 'Report all maintenance issues through the online portal or front desk. Emergency repairs will be addressed within 24 hours. Routine maintenance within 3-5 business days.',
    category: 'Administrative',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-02-15',
    updatedBy: 'Maintenance Supervisor',
    priority: 'medium',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-11',
    title: 'Internet and WiFi Usage',
    description: 'Free WiFi is provided throughout the hostel. Do not share passwords with non-residents. Bandwidth-intensive activities may be restricted during peak hours.',
    category: 'Facility Usage',
    status: 'active',
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-01-12',
    updatedBy: 'IT Administrator',
    priority: 'medium',
    applicableToAll: true,
    hostelIds: []
  },
  {
    id: 'rule-12',
    title: 'Guest Registration Protocol',
    description: 'All guests must be registered at least 24 hours in advance. Maximum guest stay is 3 consecutive nights per month. Host is responsible for guest behavior.',
    category: 'Administrative',
    status: 'draft',
    effectiveDate: '2024-03-01',
    lastUpdated: '2024-02-20',
    updatedBy: 'Admin',
    priority: 'medium',
    applicableToAll: true,
    hostelIds: []
  }
];

// Clear all data
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
    emergencyAlerts: []
  };
  toast.info('Data store cleared');
};
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

// Rules Management Functions

// Create a new rule
export async function createRule(ruleData) {
  try {
    const rule = {
      id: `rule-${uuidv4()}`,
      title: ruleData.title,
      description: ruleData.description,
      category: ruleData.category,
      status: ruleData.status || 'draft',
      effectiveDate: ruleData.effectiveDate,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: ruleData.updatedBy || 'Admin',
      priority: ruleData.priority || 'medium',
      applicableToAll: ruleData.applicableToAll !== false,
      hostelIds: ruleData.hostelIds || [],
      createdAt: new Date().toISOString(),
      ...ruleData
    };

    dataStore.rules.push(rule);
    toast.success('Rule created successfully');
    return rule;
  } catch (error) {
    toast.error('Failed to create rule');
    throw error;
  }
}

// Update an existing rule
export async function updateRule(ruleId, updates) {
  try {
    const ruleIndex = dataStore.rules.findIndex(rule => rule.id === ruleId);
    if (ruleIndex === -1) {
      throw new Error('Rule not found');
    }

    const updatedRule = {
      ...dataStore.rules[ruleIndex],
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    dataStore.rules[ruleIndex] = updatedRule;
    toast.success('Rule updated successfully');
    return updatedRule;
  } catch (error) {
    toast.error('Failed to update rule');
    throw error;
  }
}

// Delete a rule
export async function deleteRule(ruleId) {
  try {
    const ruleIndex = dataStore.rules.findIndex(rule => rule.id === ruleId);
    if (ruleIndex === -1) {
      throw new Error('Rule not found');
    }

    dataStore.rules.splice(ruleIndex, 1);
    toast.success('Rule deleted successfully');
    return true;
  } catch (error) {
    toast.error('Failed to delete rule');
    throw error;
  }
}

// List rules with filtering and search
export async function listRules(options = {}) {
  try {
    let rules = [...dataStore.rules];

    // Apply filters
    if (options.category) {
      rules = rules.filter(rule => rule.category === options.category);
    }

    if (options.status) {
      rules = rules.filter(rule => rule.status === options.status);
    }

    if (options.priority) {
      rules = rules.filter(rule => rule.priority === options.priority);
    }

    if (options.hostelId) {
      rules = rules.filter(rule => 
        rule.applicableToAll || rule.hostelIds.includes(options.hostelId)
      );
    }

    // Apply search
    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      rules = rules.filter(rule =>
        rule.title.toLowerCase().includes(searchTerm) ||
        rule.description.toLowerCase().includes(searchTerm) ||
        rule.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (options.sortBy) {
      rules.sort((a, b) => {
        const aValue = a[options.sortBy];
        const bValue = b[options.sortBy];
        
        if (options.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    if (options.page && options.limit) {
      const start = (options.page - 1) * options.limit;
      const end = start + options.limit;
      rules = rules.slice(start, end);
    }

    return {
      data: rules,
      total: dataStore.rules.length,
      filtered: rules.length
    };
  } catch (error) {
    toast.error('Failed to fetch rules');
    throw error;
  }
}

// Get a specific rule by ID
export async function getRule(ruleId) {
  try {
    const rule = dataStore.rules.find(rule => rule.id === ruleId);
    if (!rule) {
      throw new Error('Rule not found');
    }
    return rule;
  } catch (error) {
    toast.error('Failed to fetch rule');
    throw error;
  }
}

// Activate/Deactivate a rule
export async function toggleRuleStatus(ruleId) {
  try {
    const rule = dataStore.rules.find(rule => rule.id === ruleId);
    if (!rule) {
      throw new Error('Rule not found');
    }

    rule.status = rule.status === 'active' ? 'inactive' : 'active';
    rule.lastUpdated = new Date().toISOString().split('T')[0];
    rule.updatedAt = new Date().toISOString();

    toast.success(`Rule ${rule.status === 'active' ? 'activated' : 'deactivated'} successfully`);
    return rule;
  } catch (error) {
    toast.error('Failed to toggle rule status');
    throw error;
  }
}

// Get rules by category
export async function getRulesByCategory() {
  try {
    const categories = {};
    dataStore.rules.forEach(rule => {
      if (!categories[rule.category]) {
        categories[rule.category] = [];
      }
      categories[rule.category].push(rule);
    });
    return categories;
  } catch (error) {
    toast.error('Failed to fetch rules by category');
    throw error;
  }
}

// Get rule statistics
export async function getRuleStatistics() {
  try {
    const total = dataStore.rules.length;
    const active = dataStore.rules.filter(rule => rule.status === 'active').length;
    const draft = dataStore.rules.filter(rule => rule.status === 'draft').length;
    const inactive = dataStore.rules.filter(rule => rule.status === 'inactive').length;

    const byCategory = {};
    const byPriority = {};

    dataStore.rules.forEach(rule => {
      // Count by category
      byCategory[rule.category] = (byCategory[rule.category] || 0) + 1;
      
      // Count by priority
      byPriority[rule.priority] = (byPriority[rule.priority] || 0) + 1;
    });

    return {
      total,
      active,
      draft,
      inactive,
      byCategory,
      byPriority
    };
  } catch (error) {
    toast.error('Failed to fetch rule statistics');
    throw error;
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
  // Rules Management
  createRule,
  updateRule,
  deleteRule,
  listRules,
  getRule,
  toggleRuleStatus,
  getRulesByCategory,
  getRuleStatistics,
  searchRules,
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
  generateFeeReport,
  // Emergency Alert Management
  createEmergencyAlert,
  sendAlert,
  getEmergencyAlerts,
  updateAlertStatus,
  deleteEmergencyAlert,
  getAlertStatistics,
  ALERT_TYPES,
  SEVERITY_LEVELS,
  TARGET_AUDIENCES
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

// Search rules
export async function searchRules(searchTerm, options = {}) {
  try {
    if (!searchTerm) {
      return await listRules(options);
    }

    return await listRules({
      ...options,
      search: searchTerm
    });
  } catch (error) {
    toast.error('Failed to search rules');
    throw error;
}
}

// Emergency Alert Management Functions

// Alert types and their configurations
export const ALERT_TYPES = {
  FIRE_EMERGENCY: {
    id: 'fire_emergency',
    name: 'Fire Emergency',
    description: 'Fire outbreak or fire safety emergency',
    defaultSeverity: 'critical',
    requiresImmediate: true,
    icon: 'Flame'
  },
  MEDICAL_EMERGENCY: {
    id: 'medical_emergency',
    name: 'Medical Emergency',
    description: 'Medical emergency requiring immediate attention',
    defaultSeverity: 'critical',
    requiresImmediate: true,
    icon: 'Heart'
  },
  SECURITY_ALERT: {
    id: 'security_alert',
    name: 'Security Alert',
    description: 'Security breach or safety concern',
    defaultSeverity: 'high',
    requiresImmediate: true,
    icon: 'Shield'
  },
  NATURAL_DISASTER: {
    id: 'natural_disaster',
    name: 'Natural Disaster',
    description: 'Earthquake, flood, or other natural emergency',
    defaultSeverity: 'critical',
    requiresImmediate: true,
    icon: 'CloudRain'
  },
  POWER_OUTAGE: {
    id: 'power_outage',
    name: 'Power Outage',
    description: 'Electrical power disruption',
    defaultSeverity: 'medium',
    requiresImmediate: false,
    icon: 'Zap'
  },
  WATER_SHORTAGE: {
    id: 'water_shortage',
    name: 'Water Shortage',
    description: 'Water supply disruption or shortage',
    defaultSeverity: 'medium',
    requiresImmediate: false,
    icon: 'Droplets'
  },
  GAS_LEAK: {
    id: 'gas_leak',
    name: 'Gas Leak',
    description: 'Gas leak emergency',
    defaultSeverity: 'critical',
    requiresImmediate: true,
    icon: 'AlertTriangle'
  },
  MAINTENANCE_ALERT: {
    id: 'maintenance_alert',
    name: 'Maintenance Alert',
    description: 'Scheduled maintenance or service disruption',
    defaultSeverity: 'low',
    requiresImmediate: false,
    icon: 'Wrench'
  },
  CUSTOM: {
    id: 'custom',
    name: 'Custom Alert',
    description: 'Custom emergency or important notification',
    defaultSeverity: 'medium',
    requiresImmediate: false,
    icon: 'Bell'
  }
};

// Severity levels
export const SEVERITY_LEVELS = {
  LOW: {
    id: 'low',
    name: 'Low',
    color: 'blue',
    priority: 1,
    description: 'Information or minor issues'
  },
  MEDIUM: {
    id: 'medium',
    name: 'Medium',
    color: 'yellow',
    priority: 2,
    description: 'Important notifications requiring attention'
  },
  HIGH: {
    id: 'high',
    name: 'High',
    color: 'orange',
    priority: 3,
    description: 'Urgent issues requiring immediate action'
  },
  CRITICAL: {
    id: 'critical',
    name: 'Critical',
    color: 'red',
    priority: 4,
    description: 'Emergency situations requiring immediate response'
  }
};

// Target audiences
export const TARGET_AUDIENCES = {
  ALL_RESIDENTS: {
    id: 'all_residents',
    name: 'All Residents',
    description: 'Send to all hostel residents'
  },
  SPECIFIC_FLOOR: {
    id: 'specific_floor',
    name: 'Specific Floor',
    description: 'Send to residents of specific floor(s)'
  },
  SPECIFIC_ROOM: {
    id: 'specific_room',
    name: 'Specific Room',
    description: 'Send to specific room(s)'
  },
  STAFF_ONLY: {
    id: 'staff_only',
    name: 'Staff Only',
    description: 'Send to hostel staff members only'
  },
  MANAGEMENT_ONLY: {
    id: 'management_only',
    name: 'Management Only',
    description: 'Send to management team only'
  },
  MAINTENANCE_TEAM: {
    id: 'maintenance_team',
    name: 'Maintenance Team',
    description: 'Send to maintenance staff'
  },
  SECURITY_PERSONNEL: {
    id: 'security_personnel',
    name: 'Security Personnel',
    description: 'Send to security team'
  },
  CUSTOM: {
    id: 'custom',
    name: 'Custom',
    description: 'Send to custom selected recipients'
  }
};

// Create emergency alert
export const createEmergencyAlert = async (alertData) => {
  try {
    // Validate required fields
    const requiredFields = ['title', 'message', 'alertType', 'severity', 'targetAudience'];
    for (const field of requiredFields) {
      if (!alertData[field]) {
        toast.error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return { success: false, error: `${field} is required` };
      }
    }

    // Validate alert type
    if (!Object.values(ALERT_TYPES).some(type => type.id === alertData.alertType)) {
      toast.error('Invalid alert type');
      return { success: false, error: 'Invalid alert type' };
    }

    // Validate severity
    if (!Object.values(SEVERITY_LEVELS).some(level => level.id === alertData.severity)) {
      toast.error('Invalid severity level');
      return { success: false, error: 'Invalid severity level' };
    }

    // Validate target audience
    if (!Object.values(TARGET_AUDIENCES).some(audience => audience.id === alertData.targetAudience)) {
      toast.error('Invalid target audience');
      return { success: false, error: 'Invalid target audience' };
    }

    // Create alert record
    const alert = {
      id: uuidv4(),
      title: alertData.title,
      message: alertData.message,
      alertType: alertData.alertType,
      severity: alertData.severity,
      targetAudience: alertData.targetAudience,
      targetDetails: alertData.targetDetails || {},
      scheduledFor: alertData.scheduledFor || null,
      status: alertData.scheduledFor ? 'scheduled' : 'sent',
      createdAt: new Date().toISOString(),
      sentAt: alertData.scheduledFor ? null : new Date().toISOString(),
      createdBy: alertData.createdBy || 'System',
      recipients: alertData.recipients || [],
      deliveryStats: {
        total: 0,
        delivered: 0,
        failed: 0,
        pending: 0
      },
      metadata: {
        estimatedRecipients: calculateRecipientCount(alertData.targetAudience, alertData.targetDetails),
        urgency: ALERT_TYPES[alertData.alertType.toUpperCase()]?.requiresImmediate || false,
        ...alertData.metadata
      }
    };

    // Add to data store
    if (!dataStore.emergencyAlerts) {
      dataStore.emergencyAlerts = [];
    }

    dataStore.emergencyAlerts.push(alert);

    // Send immediately if not scheduled
    if (!alertData.scheduledFor) {
      const sendResult = await sendAlert(alert.id);
      if (!sendResult.success) {
        toast.warning('Alert created but failed to send immediately');
      }
    }

    toast.success(`Emergency alert ${alertData.scheduledFor ? 'scheduled' : 'sent'} successfully`);
    return { success: true, data: alert };
  } catch (error) {
    toast.error(`Error creating emergency alert: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Calculate estimated recipient count
const calculateRecipientCount = (targetAudience, targetDetails) => {
  try {
    const residents = dataStore.occupants || [];
    
    switch (targetAudience) {
      case 'all_residents':
        return residents.length;
      case 'specific_floor':
        if (targetDetails.floorIds && Array.isArray(targetDetails.floorIds)) {
          return residents.filter(resident => 
            targetDetails.floorIds.some(floorId => {
              const room = (dataStore.rooms || []).find(r => r.id === resident.roomId);
              return room && room.floorId === floorId;
            })
          ).length;
        }
        return 0;
      case 'specific_room':
        if (targetDetails.roomIds && Array.isArray(targetDetails.roomIds)) {
          return residents.filter(resident => 
            targetDetails.roomIds.includes(resident.roomId)
          ).length;
        }
        return 0;
      case 'staff_only':
      case 'management_only':
      case 'maintenance_team':
      case 'security_personnel':
        // Estimated staff count - in real implementation, this would come from staff database
        return 5;
      case 'custom':
        return targetDetails.customRecipients ? targetDetails.customRecipients.length : 0;
      default:
        return 0;
    }
  } catch (error) {
    return 0;
  }
};

// Send alert
export const sendAlert = async (alertId) => {
  try {
    const alerts = dataStore.emergencyAlerts || [];
    const index = alerts.findIndex(alert => alert.id === alertId);
    
    if (index === -1) {
      toast.error('Alert not found');
      return { success: false, error: 'Alert not found' };
    }

    const alert = alerts[index];
    
    if (alert.status === 'sent') {
      toast.warning('Alert has already been sent');
      return { success: false, error: 'Alert already sent' };
    }

    // Simulate sending process
    const recipients = await getAlertRecipients(alert);
    const deliveryResults = await simulateAlertDelivery(recipients, alert);

    // Update alert status
    const updatedAlert = {
      ...alert,
      status: 'sent',
      sentAt: new Date().toISOString(),
      recipients: recipients,
      deliveryStats: deliveryResults
    };

    dataStore.emergencyAlerts[index] = updatedAlert;

    toast.success(`Alert sent to ${deliveryResults.delivered} recipients successfully`);
    return { success: true, data: updatedAlert };
  } catch (error) {
    toast.error(`Error sending alert: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Get alert recipients based on target audience
const getAlertRecipients = async (alert) => {
  try {
    const recipients = [];
    const residents = dataStore.occupants || [];
    const rooms = dataStore.rooms || [];

    switch (alert.targetAudience) {
      case 'all_residents':
        residents.forEach(resident => {
          recipients.push({
            id: resident.id,
            name: resident.name,
            email: resident.email,
            phone: resident.phone,
            type: 'resident'
          });
        });
        break;

      case 'specific_floor':
        if (alert.targetDetails.floorIds) {
          residents.forEach(resident => {
            const room = rooms.find(r => r.id === resident.roomId);
            if (room && alert.targetDetails.floorIds.includes(room.floorId)) {
              recipients.push({
                id: resident.id,
                name: resident.name,
                email: resident.email,
                phone: resident.phone,
                type: 'resident',
                floor: room.floorId
              });
            }
          });
        }
        break;

      case 'specific_room':
        if (alert.targetDetails.roomIds) {
          residents.forEach(resident => {
            if (alert.targetDetails.roomIds.includes(resident.roomId)) {
              recipients.push({
                id: resident.id,
                name: resident.name,
                email: resident.email,
                phone: resident.phone,
                type: 'resident',
                room: resident.roomId
              });
            }
          });
        }
        break;

      case 'staff_only':
      case 'management_only':
      case 'maintenance_team':
      case 'security_personnel':
        // Add simulated staff recipients
        recipients.push({
          id: 'staff-1',
          name: 'Admin User',
          email: 'admin@hostel.com',
          phone: '+1234567890',
          type: alert.targetAudience
        });
        break;

      case 'custom':
        if (alert.targetDetails.customRecipients) {
          recipients.push(...alert.targetDetails.customRecipients);
        }
        break;
    }

    return recipients;
  } catch (error) {
    return [];
  }
};

// Simulate alert delivery
const simulateAlertDelivery = async (recipients, alert) => {
  try {
    let delivered = 0;
    let failed = 0;

    // Simulate delivery success rate based on severity
    const successRate = alert.severity === 'critical' ? 0.98 : 
                       alert.severity === 'high' ? 0.95 : 
                       alert.severity === 'medium' ? 0.92 : 0.90;

    recipients.forEach(() => {
      if (Math.random() < successRate) {
        delivered++;
      } else {
        failed++;
      }
    });

    return {
      total: recipients.length,
      delivered,
      failed,
      pending: 0
    };
  } catch (error) {
    return {
      total: recipients.length,
      delivered: 0,
      failed: recipients.length,
      pending: 0
    };
  }
};

// Get emergency alerts with filtering
export const getEmergencyAlerts = async (filters = {}) => {
  try {
    let alerts = [...(dataStore.emergencyAlerts || [])];

    // Apply filters
    if (filters.status) {
      alerts = alerts.filter(alert => alert.status === filters.status);
    }

    if (filters.severity) {
      alerts = alerts.filter(alert => alert.severity === filters.severity);
    }

    if (filters.alertType) {
      alerts = alerts.filter(alert => alert.alertType === filters.alertType);
    }

    if (filters.targetAudience) {
      alerts = alerts.filter(alert => alert.targetAudience === filters.targetAudience);
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      alerts = alerts.filter(alert => {
        const alertDate = new Date(alert.createdAt);
        return alertDate >= new Date(start) && alertDate <= new Date(end);
      });
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      alerts = alerts.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm) ||
        alert.message.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by creation date (newest first)
    alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { success: true, data: alerts };
  } catch (error) {
    toast.error(`Error getting emergency alerts: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Update alert status
export const updateAlertStatus = async (alertId, status, notes = '') => {
  try {
    const validStatuses = ['draft', 'scheduled', 'sent', 'cancelled', 'failed'];
    if (!validStatuses.includes(status)) {
      toast.error('Invalid alert status');
      return { success: false, error: 'Invalid status' };
    }

    const alerts = dataStore.emergencyAlerts || [];
    const index = alerts.findIndex(alert => alert.id === alertId);
    
    if (index === -1) {
      toast.error('Alert not found');
      return { success: false, error: 'Alert not found' };
    }

    const updatedAlert = {
      ...alerts[index],
      status,
      updatedAt: new Date().toISOString(),
      notes: notes || alerts[index].notes
    };

    dataStore.emergencyAlerts[index] = updatedAlert;
    
    const statusMessages = {
      cancelled: 'Alert cancelled successfully',
      failed: 'Alert marked as failed',
      sent: 'Alert marked as sent'
    };

    toast.success(statusMessages[status] || `Alert status updated to ${status}`);
    return { success: true, data: updatedAlert };
  } catch (error) {
    toast.error(`Error updating alert status: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Delete emergency alert
export const deleteEmergencyAlert = async (alertId) => {
  try {
    const alerts = dataStore.emergencyAlerts || [];
    const index = alerts.findIndex(alert => alert.id === alertId);
    
    if (index === -1) {
      toast.error('Alert not found');
      return { success: false, error: 'Alert not found' };
    }

    const deletedAlert = dataStore.emergencyAlerts.splice(index, 1)[0];
    
    toast.success('Emergency alert deleted successfully');
    return { success: true, data: deletedAlert };
  } catch (error) {
    toast.error(`Error deleting alert: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Get alert statistics
export const getAlertStatistics = async () => {
  try {
    const alerts = dataStore.emergencyAlerts || [];
    
    const total = alerts.length;
    const sent = alerts.filter(alert => alert.status === 'sent').length;
    const scheduled = alerts.filter(alert => alert.status === 'scheduled').length;
    const failed = alerts.filter(alert => alert.status === 'failed').length;

    const bySeverity = {};
    const byType = {};
    const byAudience = {};

    alerts.forEach(alert => {
      // Count by severity
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
      
      // Count by type
      byType[alert.alertType] = (byType[alert.alertType] || 0) + 1;
      
      // Count by audience
      byAudience[alert.targetAudience] = (byAudience[alert.targetAudience] || 0) + 1;
    });

    // Calculate delivery statistics
    const totalRecipients = alerts.reduce((sum, alert) => sum + (alert.deliveryStats?.total || 0), 0);
    const totalDelivered = alerts.reduce((sum, alert) => sum + (alert.deliveryStats?.delivered || 0), 0);
    const deliveryRate = totalRecipients > 0 ? (totalDelivered / totalRecipients) * 100 : 0;

    // Recent alerts (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentAlerts = alerts.filter(alert => new Date(alert.createdAt) > oneWeekAgo);

    return {
      success: true,
      data: {
        total,
        sent,
        scheduled,
        failed,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        totalRecipients,
        totalDelivered,
        bySeverity,
        byType,
        byAudience,
        recentCount: recentAlerts.length,
        recentAlerts: recentAlerts.slice(0, 5)
      }
    };
  } catch (error) {
    toast.error(`Error getting alert statistics: ${error.message}`);
    return { success: false, error: error.message };
  }
};