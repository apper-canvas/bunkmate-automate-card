// Hostel Schema Definition
export const hostelSchema = {
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
  location: {
    type: 'object',
    required: true,
    properties: {
      address: {
        type: 'string',
        required: true,
        minLength: 10,
        maxLength: 200
      },
      city: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 50
      },
      state: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 50
      },
      country: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 50
      },
      pincode: {
        type: 'string',
        required: true,
        pattern: /^[0-9]{6}$/
      },
      coordinates: {
        type: 'object',
        properties: {
          latitude: { type: 'number', min: -90, max: 90 },
          longitude: { type: 'number', min: -180, max: 180 }
        }
      }
    }
  },
  capacity: {
    type: 'object',
    required: true,
    properties: {
      totalRooms: {
        type: 'number',
        required: true,
        min: 1,
        max: 1000
      },
      totalBeds: {
        type: 'number',
        required: true,
        min: 1,
        max: 5000
      },
      maxOccupancy: {
        type: 'number',
        required: true,
        min: 1,
        max: 5000
      },
      currentOccupancy: {
        type: 'number',
        default: 0,
        min: 0
      }
    }
  },
  contact: {
    type: 'object',
    required: true,
    properties: {
      phone: {
        type: 'string',
        required: true,
        pattern: /^[+]?[0-9]{10,15}$/
      },
      email: {
        type: 'string',
        required: true,
        format: 'email'
      },
      website: {
        type: 'string',
        format: 'url'
      },
      emergencyContact: {
        type: 'string',
        pattern: /^[+]?[0-9]{10,15}$/
      }
    }
  },
  management: {
    type: 'object',
    properties: {
      managerName: {
        type: 'string',
        required: true,
        minLength: 2,
        maxLength: 100
      },
      managerPhone: {
        type: 'string',
        required: true,
        pattern: /^[+]?[0-9]{10,15}$/
      },
      managerEmail: {
        type: 'string',
        required: true,
        format: 'email'
      },
      operatingHours: {
        type: 'object',
        properties: {
          checkIn: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
          checkOut: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
          officeHours: {
            type: 'object',
            properties: {
              start: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
              end: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }
            }
          }
        }
      }
    }
  },
  facilities: {
    type: 'array',
    items: {
      type: 'string',
      enum: [
        'wifi',
        'parking',
        'laundry',
        'security',
        'cctv',
        'generator',
        'elevator',
        'common_room',
        'kitchen',
        'dining_hall',
        'study_room',
        'gym',
        'medical_room',
        'visitors_room',
        'garden',
        'terrace',
        'water_cooler',
        'recreation_room'
      ]
    }
  },
  policies: {
    type: 'object',
    properties: {
      guestPolicy: { type: 'string', maxLength: 500 },
      smokingPolicy: { type: 'string', enum: ['allowed', 'designated_areas', 'prohibited'] },
      alcoholPolicy: { type: 'string', enum: ['allowed', 'prohibited'] },
      quietHours: {
        type: 'object',
        properties: {
          start: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
          end: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }
        }
      },
      curfew: { type: 'string', pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
      securityDeposit: { type: 'number', min: 0 }
    }
  },
  status: {
    type: 'string',
    enum: ['active', 'inactive', 'maintenance', 'renovation'],
    default: 'active'
  },
  ratings: {
    type: 'object',
    properties: {
      overall: { type: 'number', min: 0, max: 5, default: 0 },
      cleanliness: { type: 'number', min: 0, max: 5, default: 0 },
      safety: { type: 'number', min: 0, max: 5, default: 0 },
      staff: { type: 'number', min: 0, max: 5, default: 0 },
      facilities: { type: 'number', min: 0, max: 5, default: 0 },
      totalReviews: { type: 'number', default: 0 }
    }
  },
  financial: {
    type: 'object',
    properties: {
      monthlyRevenue: { type: 'number', default: 0 },
      occupancyRate: { type: 'number', min: 0, max: 100, default: 0 },
      averageStayDuration: { type: 'number', default: 0 },
      paymentMethods: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque']
        }
      }
    }
  },
  timestamps: {
    type: 'object',
    properties: {
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      lastInspection: { type: 'string', format: 'date-time' }
    }
  }
};

// Default hostel object
export const defaultHostel = {
  id: '',
  name: '',
  location: {
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    coordinates: {
      latitude: 0,
      longitude: 0
    }
  },
  capacity: {
    totalRooms: 0,
    totalBeds: 0,
    maxOccupancy: 0,
    currentOccupancy: 0
  },
  contact: {
    phone: '',
    email: '',
    website: '',
    emergencyContact: ''
  },
  management: {
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    operatingHours: {
      checkIn: '14:00',
      checkOut: '11:00',
      officeHours: {
        start: '09:00',
        end: '18:00'
      }
    }
  },
  facilities: [],
  policies: {
    guestPolicy: '',
    smokingPolicy: 'prohibited',
    alcoholPolicy: 'prohibited',
    quietHours: {
      start: '22:00',
      end: '06:00'
    },
    curfew: '23:00',
    securityDeposit: 0
  },
  status: 'active',
  ratings: {
    overall: 0,
    cleanliness: 0,
    safety: 0,
    staff: 0,
    facilities: 0,
    totalReviews: 0
  },
  financial: {
    monthlyRevenue: 0,
    occupancyRate: 0,
    averageStayDuration: 0,
    paymentMethods: ['cash', 'upi']
  },
  timestamps: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastInspection: null
  }
};