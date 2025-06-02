// Amenity Schema Definition
export const amenitySchema = {
  id: {
    type: 'string',
    required: true,
    unique: true,
    format: 'uuid'
  },
  name: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 100,
    validate: (value) => /^[a-zA-Z0-9\s\-_&]+$/.test(value)
  },
  category: {
    type: 'string',
    required: true,
    enum: [
      'room_basic',
      'room_luxury',
      'bathroom',
      'kitchen',
      'connectivity',
      'entertainment',
      'comfort',
      'storage',
      'study',
      'safety',
      'maintenance',
      'common_area',
      'recreational',
      'utility'
    ]
  },
  type: {
    type: 'string',
    required: true,
    enum: [
      'appliance',
      'furniture',
      'fixture',
      'service',
      'utility',
      'facility',
      'equipment',
      'accessory'
    ]
  },
  description: {
    type: 'string',
    maxLength: 500
  },
  specifications: {
    type: 'object',
    properties: {
      brand: { type: 'string', maxLength: 50 },
      model: { type: 'string', maxLength: 50 },
      size: { type: 'string', maxLength: 50 },
      capacity: { type: 'string', maxLength: 50 },
      powerRating: { type: 'string', maxLength: 20 },
      warranty: {
        type: 'object',
        properties: {
          duration: { type: 'string' },
          expiryDate: { type: 'string', format: 'date-time' },
          coverage: { type: 'string' }
        }
      }
    }
  },
  availability: {
    type: 'object',
    required: true,
    properties: {
      scope: {
        type: 'string',
        enum: ['room_specific', 'floor_specific', 'building_wide', 'shared'],
        required: true
      },
      status: {
        type: 'string',
        enum: ['available', 'unavailable', 'maintenance', 'replacement_needed'],
        default: 'available'
      },
      isShared: { type: 'boolean', default: false },
      maxUsers: { type: 'number', min: 1, default: 1 },
      currentUsers: { type: 'number', default: 0, min: 0 }
    }
  },
  location: {
    type: 'object',
    properties: {
      hostelId: { type: 'string', format: 'uuid' },
      floorId: { type: 'string', format: 'uuid' },
      roomId: { type: 'string', format: 'uuid' },
      specificLocation: {
        type: 'string',
        maxLength: 100
      },
      installationDate: { type: 'string', format: 'date-time' }
    }
  },
  condition: {
    type: 'object',
    required: true,
    properties: {
      status: {
        type: 'string',
        enum: ['excellent', 'good', 'fair', 'poor', 'needs_replacement'],
        default: 'good'
      },
      lastInspected: { type: 'string', format: 'date-time' },
      nextInspection: { type: 'string', format: 'date-time' },
      inspectionFrequency: {
        type: 'string',
        enum: ['weekly', 'monthly', 'quarterly', 'semi_annual', 'annual'],
        default: 'monthly'
      },
      notes: { type: 'string', maxLength: 500 }
    }
  },
  maintenance: {
    type: 'object',
    properties: {
      lastMaintenance: { type: 'string', format: 'date-time' },
      nextMaintenance: { type: 'string', format: 'date-time' },
      maintenanceFrequency: {
        type: 'string',
        enum: ['weekly', 'monthly', 'quarterly', 'semi_annual', 'annual'],
        default: 'quarterly'
      },
      maintenanceHistory: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            maintenanceId: { type: 'string', required: true },
            date: { type: 'string', format: 'date-time', required: true },
            type: {
              type: 'string',
              enum: ['routine', 'repair', 'replacement', 'upgrade', 'emergency'],
              required: true
            },
            description: { type: 'string', required: true },
            cost: { type: 'number', min: 0 },
            vendor: { type: 'string' },
            warranty: { type: 'string' },
            completedBy: { type: 'string' },
            notes: { type: 'string' }
          }
        }
      },
      issues: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            issueId: { type: 'string', required: true },
            reportedDate: { type: 'string', format: 'date-time', required: true },
            reportedBy: { type: 'string', required: true },
            description: { type: 'string', required: true },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              default: 'medium'
            },
            status: {
              type: 'string',
              enum: ['reported', 'acknowledged', 'in_progress', 'resolved', 'cancelled'],
              default: 'reported'
            },
            resolvedDate: { type: 'string', format: 'date-time' },
            resolutionNotes: { type: 'string' }
          }
        }
      }
    }
  },
  usage: {
    type: 'object',
    properties: {
      usageFrequency: {
        type: 'string',
        enum: ['daily', 'weekly', 'monthly', 'occasional', 'rarely'],
        default: 'daily'
      },
      operatingHours: {
        type: 'object',
        properties: {
          startTime: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
          endTime: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
          is24x7: { type: 'boolean', default: true }
        }
      },
      accessRequirements: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['key', 'keycard', 'permission', 'supervision', 'booking', 'none']
        }
      },
      restrictions: {
        type: 'array',
        items: {
          type: 'string',
          maxLength: 200
        }
      }
    }
  },
  cost: {
    type: 'object',
    properties: {
      purchasePrice: { type: 'number', min: 0 },
      installationCost: { type: 'number', min: 0, default: 0 },
      monthlyMaintenance: { type: 'number', min: 0, default: 0 },
      annualMaintenance: { type: 'number', min: 0, default: 0 },
      replacementCost: { type: 'number', min: 0 },
      depreciationRate: { type: 'number', min: 0, max: 100, default: 10 },
      currentValue: { type: 'number', min: 0 }
    }
  },
  energy: {
    type: 'object',
    properties: {
      powerConsumption: {
        type: 'object',
        properties: {
          wattage: { type: 'number', min: 0 },
          dailyUsage: { type: 'number', min: 0 },
          monthlyUnits: { type: 'number', min: 0 },
          costPerMonth: { type: 'number', min: 0 }
        }
      },
      energyRating: {
        type: 'string',
        enum: ['1_star', '2_star', '3_star', '4_star', '5_star', 'not_rated'],
        default: 'not_rated'
      },
      environmentalImpact: {
        type: 'object',
        properties: {
          carbonFootprint: { type: 'number', min: 0 },
          recyclable: { type: 'boolean', default: false },
          ecoFriendly: { type: 'boolean', default: false }
        }
      }
    }
  },
  vendor: {
    type: 'object',
    properties: {
      vendorName: { type: 'string', maxLength: 100 },
      vendorContact: {
        type: 'object',
        properties: {
          phone: { type: 'string', pattern: /^[+]?[0-9]{10,15}$/ },
          email: { type: 'string', format: 'email' },
          address: { type: 'string', maxLength: 200 }
        }
      },
      serviceContract: {
        type: 'object',
        properties: {
          contractId: { type: 'string' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          serviceCoverage: { type: 'string' },
          responseTime: { type: 'string' }
        }
      }
    }
  },
  compliance: {
    type: 'object',
    properties: {
      certifications: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            certificationType: { type: 'string', required: true },
            certificateNumber: { type: 'string' },
            issuedBy: { type: 'string' },
            issuedDate: { type: 'string', format: 'date-time' },
            expiryDate: { type: 'string', format: 'date-time' },
            status: {
              type: 'string',
              enum: ['valid', 'expired', 'pending_renewal'],
              default: 'valid'
            }
          }
        }
      },
      safetyStandards: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['ISI', 'BIS', 'CE', 'FCC', 'ROHS', 'ISO', 'ANSI', 'UL']
        }
      },
      regulations: {
        type: 'array',
        items: {
          type: 'string',
          maxLength: 100
        }
      }
    }
  },
  images: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        url: { type: 'string', format: 'url', required: true },
        caption: { type: 'string' },
        isPrimary: { type: 'boolean', default: false },
        uploadedAt: { type: 'string', format: 'date-time' }
      }
    }
  },
  tags: {
    type: 'array',
    items: {
      type: 'string',
      maxLength: 30
    }
  },
  ratings: {
    type: 'object',
    properties: {
      userRating: { type: 'number', min: 0, max: 5, default: 0 },
      reliabilityRating: { type: 'number', min: 0, max: 5, default: 0 },
      maintenanceRating: { type: 'number', min: 0, max: 5, default: 0 },
      overallRating: { type: 'number', min: 0, max: 5, default: 0 },
      reviewCount: { type: 'number', default: 0 }
    }
  },
  timestamps: {
    type: 'object',
    properties: {
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      purchaseDate: { type: 'string', format: 'date-time' },
      installationDate: { type: 'string', format: 'date-time' },
      lastUsed: { type: 'string', format: 'date-time' }
    }
  }
};

// Default amenity object
export const defaultAmenity = {
  id: '',
  name: '',
  category: 'room_basic',
  type: 'appliance',
  description: '',
  specifications: {
    brand: '',
    model: '',
    size: '',
    capacity: '',
    powerRating: '',
    warranty: {
      duration: '',
      expiryDate: null,
      coverage: ''
    }
  },
  availability: {
    scope: 'room_specific',
    status: 'available',
    isShared: false,
    maxUsers: 1,
    currentUsers: 0
  },
  location: {
    hostelId: '',
    floorId: '',
    roomId: '',
    specificLocation: '',
    installationDate: null
  },
  condition: {
    status: 'good',
    lastInspected: null,
    nextInspection: null,
    inspectionFrequency: 'monthly',
    notes: ''
  },
  maintenance: {
    lastMaintenance: null,
    nextMaintenance: null,
    maintenanceFrequency: 'quarterly',
    maintenanceHistory: [],
    issues: []
  },
  usage: {
    usageFrequency: 'daily',
    operatingHours: {
      startTime: '00:00',
      endTime: '23:59',
      is24x7: true
    },
    accessRequirements: ['none'],
    restrictions: []
  },
  cost: {
    purchasePrice: 0,
    installationCost: 0,
    monthlyMaintenance: 0,
    annualMaintenance: 0,
    replacementCost: 0,
    depreciationRate: 10,
    currentValue: 0
  },
  energy: {
    powerConsumption: {
      wattage: 0,
      dailyUsage: 0,
      monthlyUnits: 0,
      costPerMonth: 0
    },
    energyRating: 'not_rated',
    environmentalImpact: {
      carbonFootprint: 0,
      recyclable: false,
      ecoFriendly: false
    }
  },
  vendor: {
    vendorName: '',
    vendorContact: {
      phone: '',
      email: '',
      address: ''
    },
    serviceContract: {
      contractId: '',
      startDate: null,
      endDate: null,
      serviceCoverage: '',
      responseTime: ''
    }
  },
  compliance: {
    certifications: [],
    safetyStandards: [],
    regulations: []
  },
  images: [],
  tags: [],
  ratings: {
    userRating: 0,
    reliabilityRating: 0,
    maintenanceRating: 0,
    overallRating: 0,
    reviewCount: 0
  },
  timestamps: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    purchaseDate: null,
    installationDate: null,
    lastUsed: null
  }
};

// Predefined amenity categories with common items
export const amenityCategories = {
  room_basic: [
    'bed', 'mattress', 'pillow', 'bed_sheet', 'blanket', 'wardrobe', 
    'mirror', 'fan', 'light_bulb', 'switch_board', 'door_lock'
  ],
  room_luxury: [
    'ac', 'heater', 'tv', 'refrigerator', 'microwave', 'water_heater',
    'study_table', 'chair', 'sofa', 'carpet', 'curtains', 'air_purifier'
  ],
  bathroom: [
    'toilet', 'wash_basin', 'shower', 'geyser', 'mirror', 'towel_rack',
    'soap_dispenser', 'toilet_paper_holder', 'exhaust_fan', 'water_tap'
  ],
  kitchen: [
    'gas_stove', 'cylinder', 'chimney', 'sink', 'water_filter', 
    'refrigerator', 'microwave', 'electric_kettle', 'dishwasher'
  ],
  connectivity: [
    'wifi_router', 'ethernet_port', 'cable_tv', 'intercom', 
    'telephone', 'internet_connection'
  ],
  entertainment: [
    'tv', 'sound_system', 'gaming_console', 'projector', 
    'speakers', 'cable_connection'
  ],
  comfort: [
    'ac', 'heater', 'humidifier', 'dehumidifier', 'air_cooler',
    'fan', 'room_heater', 'blanket', 'cushions'
  ],
  storage: [
    'wardrobe', 'chest_of_drawers', 'bookshelf', 'storage_box',
    'shoe_rack', 'coat_hanger', 'locker', 'safe'
  ],
  study: [
    'study_table', 'chair', 'desk_lamp', 'bookshelf', 'whiteboard',
    'computer', 'printer', 'scanner', 'stationery_holder'
  ],
  safety: [
    'smoke_detector', 'fire_extinguisher', 'first_aid_kit', 
    'emergency_light', 'cctv_camera', 'door_alarm', 'window_grill'
  ],
  maintenance: [
    'vacuum_cleaner', 'broom', 'mop', 'bucket', 'cleaning_supplies',
    'tool_kit', 'spare_bulbs', 'fuses'
  ],
  common_area: [
    'sofa_set', 'dining_table', 'chairs', 'tv', 'water_dispenser',
    'notice_board', 'suggestion_box', 'magazines', 'games'
  ],
  recreational: [
    'pool_table', 'chess_board', 'carrom_board', 'table_tennis',
    'gym_equipment', 'exercise_bike', 'treadmill', 'weights'
  ],
  utility: [
    'washing_machine', 'dryer', 'iron', 'ironing_board', 'generator',
    'inverter', 'water_pump', 'water_tank', 'solar_panel'
  ]
};