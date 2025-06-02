// Room Schema Definition
export const roomSchema = {
  id: {
    type: 'string',
    required: true,
    unique: true,
    format: 'uuid'
  },
  hostelId: {
    type: 'string',
    required: true,
    format: 'uuid'
  },
  floorId: {
    type: 'string',
    required: true,
    format: 'uuid'
  },
  roomNumber: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 10,
    validate: (value) => /^[A-Z0-9\-]+$/.test(value)
  },
  type: {
    type: 'string',
    required: true,
    enum: [
      'single',
      'double',
      'triple',
      'quad',
      'dormitory',
      'suite',
      'studio',
      'shared'
    ]
  },
  capacity: {
    type: 'object',
    required: true,
    properties: {
      maxOccupants: {
        type: 'number',
        required: true,
        min: 1,
        max: 20
      },
      currentOccupants: {
        type: 'number',
        default: 0,
        min: 0
      },
      beds: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            bedNumber: { type: 'string', required: true },
            bedType: { 
              type: 'string', 
              enum: ['single', 'double', 'bunk_top', 'bunk_bottom'],
              required: true 
            },
            isOccupied: { type: 'boolean', default: false },
            occupantId: { type: 'string', default: null }
          }
        }
      }
    }
  },
  dimensions: {
    type: 'object',
    properties: {
      length: { type: 'number', min: 1, max: 50 },
      width: { type: 'number', min: 1, max: 50 },
      height: { type: 'number', min: 2, max: 10 },
      area: { type: 'number', min: 1, max: 2500 }
    }
  },
  availability: {
    type: 'object',
    required: true,
    properties: {
      status: {
        type: 'string',
        enum: ['available', 'occupied', 'maintenance', 'reserved', 'cleaning'],
        default: 'available'
      },
      availableFrom: {
        type: 'string',
        format: 'date-time'
      },
      nextAvailable: {
        type: 'string',
        format: 'date-time'
      }
    }
  },
  pricing: {
    type: 'object',
    required: true,
    properties: {
      baseRent: {
        type: 'number',
        required: true,
        min: 0,
        max: 100000
      },
      securityDeposit: {
        type: 'number',
        default: 0,
        min: 0,
        max: 500000
      },
      maintenanceCharges: {
        type: 'number',
        default: 0,
        min: 0,
        max: 10000
      },
      electricityCharges: {
        type: 'number',
        default: 0,
        min: 0,
        max: 10000
      },
      currency: {
        type: 'string',
        default: 'INR'
      },
      billingCycle: {
        type: 'string',
        enum: ['monthly', 'quarterly', 'semi-annual', 'annual'],
        default: 'monthly'
      }
    }
  },
amenities: {
    type: 'object',
    properties: {
      available: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            amenityId: {
              type: 'string',
              required: true,
              format: 'uuid'
            },
            name: {
              type: 'string',
              required: true,
              enum: [
                'wifi',
                'ac',
                'fan',
                'heater',
                'private_bathroom',
                'shared_bathroom',
                'balcony',
                'window',
                'wardrobe',
                'desk',
                'chair',
                'mirror',
                'attached_kitchenette',
                'refrigerator',
                'tv',
                'geyser',
                'power_backup',
                'study_table',
                'bed_linen',
                'pillow',
                'mattress',
                'locker',
                'dustbin',
                'curtains',
                'night_lamp',
                'microwave',
                'washing_machine',
                'iron',
                'hair_dryer',
                'kettle',
                'coffee_maker',
                'air_purifier',
                'humidifier',
                'dehumidifier',
                'vacuum_cleaner',
                'cctv',
                'intercom',
                'safe',
                'mini_fridge'
              ]
            },
            category: {
              type: 'string',
              enum: ['essential', 'comfort', 'luxury', 'safety', 'convenience'],
              required: true
            },
            status: {
              type: 'string',
              enum: ['working', 'not_working', 'maintenance', 'unavailable'],
              default: 'working'
            },
            condition: {
              type: 'string',
              enum: ['excellent', 'good', 'fair', 'poor', 'needs_replacement'],
              default: 'good'
            },
            installationDate: {
              type: 'string',
              format: 'date-time'
            },
            lastMaintenance: {
              type: 'string',
              format: 'date-time'
            },
            nextMaintenance: {
              type: 'string',
              format: 'date-time'
            },
            warrantyExpiry: {
              type: 'string',
              format: 'date-time'
            },
            specifications: {
              type: 'object',
              properties: {
                brand: { type: 'string' },
                model: { type: 'string' },
                capacity: { type: 'string' },
                powerRating: { type: 'string' },
                voltage: { type: 'string' },
                frequency: { type: 'string' },
                dimensions: { type: 'string' },
                weight: { type: 'string' },
                color: { type: 'string' },
                material: { type: 'string' }
              }
            },
            usage: {
              type: 'object',
              properties: {
                dailyUsageHours: { type: 'number', default: 0 },
                monthlyUsage: { type: 'number', default: 0 },
                energyConsumption: { type: 'number', default: 0 },
                lastUsed: { type: 'string', format: 'date-time' },
                usageCount: { type: 'number', default: 0 }
              }
            },
            issues: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  issueId: { type: 'string', required: true },
                  description: { type: 'string', required: true },
                  severity: {
                    type: 'string',
                    enum: ['minor', 'moderate', 'major', 'critical'],
                    default: 'minor'
                  },
                  reportedAt: { type: 'string', format: 'date-time' },
                  reportedBy: { type: 'string' },
                  status: {
                    type: 'string',
                    enum: ['open', 'in_progress', 'resolved', 'closed'],
                    default: 'open'
                  },
                  resolvedAt: { type: 'string', format: 'date-time' },
                  resolution: { type: 'string' }
                }
              }
            },
            cost: {
              type: 'object',
              properties: {
                purchasePrice: { type: 'number', default: 0 },
                installationCost: { type: 'number', default: 0 },
                maintenanceCost: { type: 'number', default: 0 },
                operationalCost: { type: 'number', default: 0 },
                currency: { type: 'string', default: 'INR' }
              }
            },
            accessibility: {
              type: 'object',
              properties: {
                location: { type: 'string' },
                isShared: { type: 'boolean', default: false },
                accessInstructions: { type: 'string' },
                operatingHours: { type: 'string' },
                restrictions: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        }
      },
      summary: {
        type: 'object',
        properties: {
          totalCount: { type: 'number', default: 0 },
          workingCount: { type: 'number', default: 0 },
          maintenanceCount: { type: 'number', default: 0 },
          outOfOrderCount: { type: 'number', default: 0 },
          lastUpdated: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  furnishing: {
    type: 'object',
    properties: {
      furnished: {
        type: 'string',
        enum: ['fully_furnished', 'semi_furnished', 'unfurnished'],
        default: 'semi_furnished'
      },
      furniture: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            itemName: { type: 'string', required: true },
            quantity: { type: 'number', required: true, min: 1 },
            condition: {
              type: 'string',
              enum: ['excellent', 'good', 'fair', 'poor', 'needs_replacement'],
              default: 'good'
            },
            lastMaintenance: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  maintenance: {
    type: 'object',
    properties: {
      lastCleaned: { type: 'string', format: 'date-time' },
      lastInspected: { type: 'string', format: 'date-time' },
      nextInspection: { type: 'string', format: 'date-time' },
      maintenanceIssues: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            issueId: { type: 'string', required: true },
            description: { type: 'string', required: true },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              default: 'medium'
            },
            status: {
              type: 'string',
              enum: ['reported', 'in_progress', 'resolved', 'cancelled'],
              default: 'reported'
            },
            reportedAt: { type: 'string', format: 'date-time' },
            resolvedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  utilities: {
    type: 'object',
    properties: {
      electricity: {
        type: 'object',
        properties: {
          meterNumber: { type: 'string' },
          currentReading: { type: 'number', default: 0 },
          lastReading: { type: 'number', default: 0 },
          ratePerUnit: { type: 'number', default: 0 }
        }
      },
      water: {
        type: 'object',
        properties: {
          supply: {
            type: 'string',
            enum: ['24x7', 'scheduled', 'tank', 'bore_well'],
            default: 'scheduled'
          },
          timing: { type: 'string' }
        }
      }
    }
  },
  safety: {
    type: 'object',
    properties: {
      fireExtinguisher: { type: 'boolean', default: false },
      smokeDetector: { type: 'boolean', default: false },
      emergencyExit: { type: 'boolean', default: false },
      firstAidKit: { type: 'boolean', default: false },
      securityCamera: { type: 'boolean', default: false }
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
  history: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        eventType: {
          type: 'string',
          enum: ['occupied', 'vacated', 'maintenance', 'cleaning', 'inspection'],
          required: true
        },
        eventDate: { type: 'string', format: 'date-time', required: true },
        occupantId: { type: 'string' },
        notes: { type: 'string' },
        duration: { type: 'number' }
      }
    }
  },
  timestamps: {
    type: 'object',
    properties: {
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      lastOccupied: { type: 'string', format: 'date-time' },
      lastVacated: { type: 'string', format: 'date-time' }
    }
  }
};

// Default room object
export const defaultRoom = {
  id: '',
  hostelId: '',
  floorId: '',
  roomNumber: '',
  type: 'single',
  capacity: {
    maxOccupants: 1,
    currentOccupants: 0,
    beds: []
  },
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    area: 0
  },
  availability: {
    status: 'available',
    availableFrom: new Date().toISOString(),
    nextAvailable: null
  },
  pricing: {
    baseRent: 0,
    securityDeposit: 0,
    maintenanceCharges: 0,
    electricityCharges: 0,
    currency: 'INR',
    billingCycle: 'monthly'
  },
amenities: {
    available: [],
    summary: {
      totalCount: 0,
      workingCount: 0,
      maintenanceCount: 0,
      outOfOrderCount: 0,
      lastUpdated: new Date().toISOString()
    }
  },
  furnishing: {
    furnished: 'semi_furnished',
    furniture: []
  },
  maintenance: {
    lastCleaned: null,
    lastInspected: null,
    nextInspection: null,
    maintenanceIssues: []
  },
  utilities: {
    electricity: {
      meterNumber: '',
      currentReading: 0,
      lastReading: 0,
      ratePerUnit: 0
    },
    water: {
      supply: 'scheduled',
      timing: '06:00-08:00, 18:00-20:00'
    }
  },
  safety: {
    fireExtinguisher: false,
    smokeDetector: false,
    emergencyExit: false,
    firstAidKit: false,
    securityCamera: false
  },
  images: [],
  history: [],
  timestamps: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastOccupied: null,
    lastVacated: null
  }
};

// Room type configurations
export const roomTypeConfigs = {
  single: { defaultCapacity: 1, defaultBeds: 1, suggestedArea: 100 },
  double: { defaultCapacity: 2, defaultBeds: 2, suggestedArea: 150 },
  triple: { defaultCapacity: 3, defaultBeds: 3, suggestedArea: 200 },
  quad: { defaultCapacity: 4, defaultBeds: 4, suggestedArea: 250 },
  dormitory: { defaultCapacity: 8, defaultBeds: 8, suggestedArea: 400 },
  suite: { defaultCapacity: 2, defaultBeds: 2, suggestedArea: 300 },
  studio: { defaultCapacity: 1, defaultBeds: 1, suggestedArea: 200 },
  shared: { defaultCapacity: 6, defaultBeds: 6, suggestedArea: 300 }
};