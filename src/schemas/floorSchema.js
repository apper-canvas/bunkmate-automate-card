// Floor/Block Schema Definition
export const floorSchema = {
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
  floorNumber: {
    type: 'number',
    required: true,
    min: -5,
    max: 50
  },
  floorName: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 50,
    validate: (value) => /^[a-zA-Z0-9\s\-_]+$/.test(value)
  },
  blockName: {
    type: 'string',
    minLength: 1,
    maxLength: 20,
    validate: (value) => /^[A-Z0-9\-]+$/.test(value)
  },
  type: {
    type: 'string',
    enum: [
      'residential',
      'administrative',
      'recreational',
      'utility',
      'commercial',
      'mixed'
    ],
    default: 'residential'
  },
  capacity: {
    type: 'object',
    required: true,
    properties: {
      totalRooms: {
        type: 'number',
        required: true,
        min: 0,
        max: 100
      },
      occupiedRooms: {
        type: 'number',
        default: 0,
        min: 0
      },
      totalBeds: {
        type: 'number',
        required: true,
        min: 0,
        max: 500
      },
      occupiedBeds: {
        type: 'number',
        default: 0,
        min: 0
      },
      maxOccupancy: {
        type: 'number',
        required: true,
        min: 0,
        max: 500
      },
      currentOccupancy: {
        type: 'number',
        default: 0,
        min: 0
      }
    }
  },
  layout: {
    type: 'object',
    properties: {
      dimensions: {
        type: 'object',
        properties: {
          length: { type: 'number', min: 1, max: 200 },
          width: { type: 'number', min: 1, max: 200 },
          height: { type: 'number', min: 2, max: 10 },
          totalArea: { type: 'number', min: 1, max: 40000 }
        }
      },
      roomLayout: {
        type: 'string',
        enum: ['linear', 'l_shaped', 'u_shaped', 'rectangular', 'custom'],
        default: 'linear'
      },
      corridorWidth: {
        type: 'number',
        min: 1,
        max: 10,
        default: 1.5
      }
    }
  },
  facilities: {
    type: 'object',
    properties: {
      commonAreas: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              enum: [
                'common_bathroom',
                'common_kitchen',
                'study_room',
                'recreation_room',
                'laundry_room',
                'storage_room',
                'pantry',
                'lobby',
                'waiting_area',
                'balcony',
                'terrace_access'
              ],
              required: true
            },
            quantity: { type: 'number', min: 1, default: 1 },
            capacity: { type: 'number', min: 1 },
            area: { type: 'number', min: 1 },
            isAccessible: { type: 'boolean', default: true }
          }
        }
      },
      utilities: {
        type: 'object',
        properties: {
          waterSupply: {
            type: 'object',
            properties: {
              mainSupply: { type: 'boolean', default: true },
              backupTank: { type: 'boolean', default: false },
              tankCapacity: { type: 'number', min: 0 },
              waterTiming: { type: 'string' }
            }
          },
          electricity: {
            type: 'object',
            properties: {
              mainConnection: { type: 'boolean', default: true },
              backup: { type: 'boolean', default: false },
              backupType: {
                type: 'string',
                enum: ['generator', 'inverter', 'ups'],
                default: 'inverter'
              },
              totalLoad: { type: 'number', min: 0 }
            }
          },
          internet: {
            type: 'object',
            properties: {
              wifiAvailable: { type: 'boolean', default: true },
              speed: { type: 'string' },
              provider: { type: 'string' },
              coverage: {
                type: 'string',
                enum: ['full', 'partial', 'none'],
                default: 'full'
              }
            }
          }
        }
      },
      safety: {
        type: 'object',
        properties: {
          fireExtinguishers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                location: { type: 'string', required: true },
                type: { type: 'string', required: true },
                lastInspected: { type: 'string', format: 'date-time' },
                expiryDate: { type: 'string', format: 'date-time' }
              }
            }
          },
          emergencyExits: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                location: { type: 'string', required: true },
                type: {
                  type: 'string',
                  enum: ['stairs', 'elevator', 'fire_escape'],
                  required: true
                },
                capacity: { type: 'number', min: 1 },
                isAccessible: { type: 'boolean', default: true }
              }
            }
          },
          smokeDeteectors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                location: { type: 'string', required: true },
                batteryLevel: { type: 'number', min: 0, max: 100 },
                lastTested: { type: 'string', format: 'date-time' }
              }
            }
          },
          securityCameras: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                location: { type: 'string', required: true },
                type: {
                  type: 'string',
                  enum: ['indoor', 'outdoor', 'corridor', 'entrance'],
                  required: true
                },
                isWorking: { type: 'boolean', default: true },
                recordingEnabled: { type: 'boolean', default: true }
              }
            }
          }
        }
      }
    }
  },
  accessibility: {
    type: 'object',
    properties: {
      elevatorAccess: { type: 'boolean', default: false },
      stairAccess: { type: 'boolean', default: true },
      wheelchairAccessible: { type: 'boolean', default: false },
      rampAvailable: { type: 'boolean', default: false },
      handrailsInstalled: { type: 'boolean', default: false },
      emergencyEvacuation: {
        type: 'object',
        properties: {
          evacuationPlan: { type: 'boolean', default: false },
          assemblyPoint: { type: 'string' },
          evacuationTime: { type: 'number', min: 1 }
        }
      }
    }
  },
  maintenance: {
    type: 'object',
    properties: {
      lastInspection: { type: 'string', format: 'date-time' },
      nextInspection: { type: 'string', format: 'date-time' },
      maintenanceSchedule: {
        type: 'object',
        properties: {
          cleaning: {
            type: 'object',
            properties: {
              frequency: {
                type: 'string',
                enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
                default: 'daily'
              },
              lastCleaned: { type: 'string', format: 'date-time' },
              nextCleaning: { type: 'string', format: 'date-time' }
            }
          },
          painting: {
            type: 'object',
            properties: {
              lastPainted: { type: 'string', format: 'date-time' },
              nextPainting: { type: 'string', format: 'date-time' },
              color: { type: 'string' }
            }
          },
          repairs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                repairId: { type: 'string', required: true },
                description: { type: 'string', required: true },
                area: { type: 'string', required: true },
                priority: {
                  type: 'string',
                  enum: ['low', 'medium', 'high', 'urgent'],
                  default: 'medium'
                },
                status: {
                  type: 'string',
                  enum: ['pending', 'in_progress', 'completed', 'cancelled'],
                  default: 'pending'
                },
                reportedAt: { type: 'string', format: 'date-time' },
                completedAt: { type: 'string', format: 'date-time' },
                cost: { type: 'number', min: 0 }
              }
            }
          }
        }
      }
    }
  },
  occupancy: {
    type: 'object',
    properties: {
      currentOccupancyRate: {
        type: 'number',
        min: 0,
        max: 100,
        default: 0
      },
      averageOccupancyRate: {
        type: 'number',
        min: 0,
        max: 100,
        default: 0
      },
      peakOccupancyPeriod: {
        type: 'object',
        properties: {
          startMonth: { type: 'number', min: 1, max: 12 },
          endMonth: { type: 'number', min: 1, max: 12 },
          occupancyRate: { type: 'number', min: 0, max: 100 }
        }
      },
      roomTurnover: {
        type: 'object',
        properties: {
          averageStayDuration: { type: 'number', min: 1 },
          monthlyTurnover: { type: 'number', min: 0 },
          annualTurnover: { type: 'number', min: 0 }
        }
      }
    }
  },
  rules: {
    type: 'object',
    properties: {
      genderRestriction: {
        type: 'string',
        enum: ['male_only', 'female_only', 'mixed', 'no_restriction'],
        default: 'no_restriction'
      },
      ageRestriction: {
        type: 'object',
        properties: {
          minAge: { type: 'number', min: 16, max: 100 },
          maxAge: { type: 'number', min: 16, max: 100 }
        }
      },
      visitorPolicy: {
        type: 'object',
        properties: {
          allowedHours: { type: 'string' },
          registrationRequired: { type: 'boolean', default: true },
          escortRequired: { type: 'boolean', default: false },
          maxVisitors: { type: 'number', min: 1, default: 2 }
        }
      },
      quietHours: {
        type: 'object',
        properties: {
          startTime: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
          endTime: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }
        }
      }
    }
  },
  status: {
    type: 'string',
    enum: ['active', 'inactive', 'maintenance', 'renovation', 'construction'],
    default: 'active'
  },
  timestamps: {
    type: 'object',
    properties: {
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      activatedAt: { type: 'string', format: 'date-time' },
      lastOccupied: { type: 'string', format: 'date-time' }
    }
  }
};

// Default floor object
export const defaultFloor = {
  id: '',
  hostelId: '',
  floorNumber: 0,
  floorName: '',
  blockName: '',
  type: 'residential',
  capacity: {
    totalRooms: 0,
    occupiedRooms: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    maxOccupancy: 0,
    currentOccupancy: 0
  },
  layout: {
    dimensions: {
      length: 0,
      width: 0,
      height: 3,
      totalArea: 0
    },
    roomLayout: 'linear',
    corridorWidth: 1.5
  },
  facilities: {
    commonAreas: [],
    utilities: {
      waterSupply: {
        mainSupply: true,
        backupTank: false,
        tankCapacity: 0,
        waterTiming: '06:00-08:00, 18:00-20:00'
      },
      electricity: {
        mainConnection: true,
        backup: false,
        backupType: 'inverter',
        totalLoad: 0
      },
      internet: {
        wifiAvailable: true,
        speed: '',
        provider: '',
        coverage: 'full'
      }
    },
    safety: {
      fireExtinguishers: [],
      emergencyExits: [],
      smokeDeteectors: [],
      securityCameras: []
    }
  },
  accessibility: {
    elevatorAccess: false,
    stairAccess: true,
    wheelchairAccessible: false,
    rampAvailable: false,
    handrailsInstalled: false,
    emergencyEvacuation: {
      evacuationPlan: false,
      assemblyPoint: '',
      evacuationTime: 0
    }
  },
  maintenance: {
    lastInspection: null,
    nextInspection: null,
    maintenanceSchedule: {
      cleaning: {
        frequency: 'daily',
        lastCleaned: null,
        nextCleaning: null
      },
      painting: {
        lastPainted: null,
        nextPainting: null,
        color: ''
      },
      repairs: []
    }
  },
  occupancy: {
    currentOccupancyRate: 0,
    averageOccupancyRate: 0,
    peakOccupancyPeriod: {
      startMonth: 1,
      endMonth: 12,
      occupancyRate: 0
    },
    roomTurnover: {
      averageStayDuration: 0,
      monthlyTurnover: 0,
      annualTurnover: 0
    }
  },
  rules: {
    genderRestriction: 'no_restriction',
    ageRestriction: {
      minAge: 18,
      maxAge: 35
    },
    visitorPolicy: {
      allowedHours: '09:00-21:00',
      registrationRequired: true,
      escortRequired: false,
      maxVisitors: 2
    },
    quietHours: {
      startTime: '22:00',
      endTime: '06:00'
    }
  },
  status: 'active',
  timestamps: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activatedAt: new Date().toISOString(),
    lastOccupied: null
  }
};