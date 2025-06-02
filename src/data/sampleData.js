// Sample data demonstrating schema usage
import { v4 as uuidv4 } from 'uuid';

// Sample Hostel Data
export const sampleHostels = [
  {
    id: 'hostel-001',
    name: 'Green Valley Hostel',
    location: {
      address: '123 University Road, Near Metro Station',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pincode: '560001',
      coordinates: {
        latitude: 12.9716,
        longitude: 77.5946
      }
    },
    capacity: {
      totalRooms: 48,
      totalBeds: 144,
      maxOccupancy: 144,
      currentOccupancy: 128
    },
    contact: {
      phone: '+91-9876543210',
      email: 'info@greenvalleyhostel.com',
      website: 'www.greenvalleyhostel.com',
      emergencyContact: '+91-9876543211'
    },
    management: {
      managerName: 'Rajesh Kumar',
      managerPhone: '+91-9876543212',
      managerEmail: 'manager@greenvalleyhostel.com',
      operatingHours: {
        checkIn: '14:00',
        checkOut: '11:00',
        officeHours: {
          start: '08:00',
          end: '20:00'
        }
      }
    },
    facilities: [
      'wifi', 'parking', 'laundry', 'security', 'cctv', 'generator',
      'common_room', 'kitchen', 'dining_hall', 'study_room', 'gym'
    ],
    policies: {
      guestPolicy: 'Visitors allowed between 9 AM to 9 PM with prior registration',
      smokingPolicy: 'designated_areas',
      alcoholPolicy: 'prohibited',
      quietHours: {
        start: '22:00',
        end: '06:00'
      },
      curfew: '23:30',
      securityDeposit: 5000
    },
    status: 'active',
    ratings: {
      overall: 4.2,
      cleanliness: 4.5,
      safety: 4.8,
      staff: 4.0,
      facilities: 3.9,
      totalReviews: 156
    },
    financial: {
      monthlyRevenue: 432000,
      occupancyRate: 88.9,
      averageStayDuration: 8.5,
      paymentMethods: ['cash', 'card', 'upi', 'bank_transfer']
    },
    timestamps: {
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:22:00Z',
      lastInspection: '2024-01-10T09:00:00Z'
    }
  },
  {
    id: 'hostel-002',
    name: 'City Center Residence',
    location: {
      address: '456 Business District, Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001',
      coordinates: {
        latitude: 19.0760,
        longitude: 72.8777
      }
    },
    capacity: {
      totalRooms: 72,
      totalBeds: 180,
      maxOccupancy: 180,
      currentOccupancy: 165
    },
    contact: {
      phone: '+91-8765432109',
      email: 'contact@citycenterresidence.com',
      website: 'www.citycenterresidence.com',
      emergencyContact: '+91-8765432108'
    },
    management: {
      managerName: 'Priya Sharma',
      managerPhone: '+91-8765432107',
      managerEmail: 'priya@citycenterresidence.com',
      operatingHours: {
        checkIn: '15:00',
        checkOut: '11:00',
        officeHours: {
          start: '09:00',
          end: '21:00'
        }
      }
    },
    facilities: [
      'wifi', 'parking', 'laundry', 'security', 'cctv', 'elevator',
      'common_room', 'kitchen', 'dining_hall', 'study_room', 'medical_room'
    ],
    policies: {
      guestPolicy: 'Visitors allowed between 8 AM to 10 PM with ID verification',
      smokingPolicy: 'prohibited',
      alcoholPolicy: 'prohibited',
      quietHours: {
        start: '23:00',
        end: '06:00'
      },
      curfew: '00:00',
      securityDeposit: 7500
    },
    status: 'active',
    ratings: {
      overall: 4.6,
      cleanliness: 4.7,
      safety: 4.9,
      staff: 4.5,
      facilities: 4.4,
      totalReviews: 234
    },
    financial: {
      monthlyRevenue: 675000,
      occupancyRate: 91.7,
      averageStayDuration: 11.2,
      paymentMethods: ['cash', 'card', 'upi', 'bank_transfer', 'cheque']
    },
    timestamps: {
      createdAt: '2022-06-10T12:00:00Z',
      updatedAt: '2024-01-16T11:45:00Z',
      lastInspection: '2024-01-12T10:30:00Z'
    }
  }
];

// Sample Floor Data
export const sampleFloors = [
  {
    id: 'floor-001',
    hostelId: 'hostel-001',
    floorNumber: 1,
    floorName: 'Ground Floor',
    blockName: 'A',
    type: 'mixed',
    capacity: {
      totalRooms: 8,
      occupiedRooms: 7,
      totalBeds: 16,
      occupiedBeds: 14,
      maxOccupancy: 16,
      currentOccupancy: 14
    },
    layout: {
      dimensions: {
        length: 80,
        width: 40,
        height: 3.5,
        totalArea: 3200
      },
      roomLayout: 'linear',
      corridorWidth: 2.0
    },
    facilities: {
      commonAreas: [
        {
          name: 'common_bathroom',
          quantity: 2,
          capacity: 4,
          area: 20,
          isAccessible: true
        },
        {
          name: 'common_kitchen',
          quantity: 1,
          capacity: 10,
          area: 40,
          isAccessible: true
        },
        {
          name: 'lobby',
          quantity: 1,
          capacity: 20,
          area: 60,
          isAccessible: true
        }
      ],
      utilities: {
        waterSupply: {
          mainSupply: true,
          backupTank: true,
          tankCapacity: 2000,
          waterTiming: '06:00-08:00, 18:00-20:00'
        },
        electricity: {
          mainConnection: true,
          backup: true,
          backupType: 'generator',
          totalLoad: 50
        },
        internet: {
          wifiAvailable: true,
          speed: '100 Mbps',
          provider: 'Airtel',
          coverage: 'full'
        }
      },
      safety: {
        fireExtinguishers: [
          {
            location: 'Near Main Entrance',
            type: 'ABC Dry Powder',
            lastInspected: '2024-01-01T10:00:00Z',
            expiryDate: '1/1/2025 10:00:00 AMZ'
          }
        ],
        emergencyExits: [
          {
            location: 'Main Entrance',
            type: 'stairs',
            capacity: 50,
            isAccessible: true
          }
        ],
        smokeDeteectors: [
          {
            location: 'Corridor Center',
            batteryLevel: 85,
            lastTested: '2024-01-01T10:00:00Z'
          }
        ],
        securityCameras: [
          {
            location: 'Main Corridor',
            type: 'corridor',
            isWorking: true,
            recordingEnabled: true
          }
        ]
      }
    },
    accessibility: {
      elevatorAccess: false,
      stairAccess: true,
      wheelchairAccessible: true,
      rampAvailable: true,
      handrailsInstalled: true,
      emergencyEvacuation: {
        evacuationPlan: true,
        assemblyPoint: 'Front Garden',
        evacuationTime: 3
      }
    },
    rules: {
      genderRestriction: 'mixed',
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
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:22:00Z',
      activatedAt: '2023-01-20T08:00:00Z',
      lastOccupied: '2024-01-15T16:30:00Z'
    }
  },
  {
    id: 'floor-002',
    hostelId: 'hostel-001',
    floorNumber: 2,
    floorName: 'First Floor',
    blockName: 'A',
    type: 'residential',
    capacity: {
      totalRooms: 12,
      occupiedRooms: 11,
      totalBeds: 36,
      occupiedBeds: 33,
      maxOccupancy: 36,
      currentOccupancy: 33
    },
    layout: {
      dimensions: {
        length: 80,
        width: 40,
        height: 3.5,
        totalArea: 3200
      },
      roomLayout: 'rectangular',
      corridorWidth: 1.8
    },
    facilities: {
      commonAreas: [
        {
          name: 'common_bathroom',
          quantity: 3,
          capacity: 4,
          area: 20,
          isAccessible: true
        },
        {
          name: 'study_room',
          quantity: 1,
          capacity: 15,
          area: 50,
          isAccessible: true
        },
        {
          name: 'recreation_room',
          quantity: 1,
          capacity: 12,
          area: 45,
          isAccessible: true
        }
      ],
      utilities: {
        waterSupply: {
          mainSupply: true,
          backupTank: true,
          tankCapacity: 1500,
          waterTiming: '06:00-08:00, 18:00-20:00'
        },
        electricity: {
          mainConnection: true,
          backup: true,
          backupType: 'inverter',
          totalLoad: 45
        },
        internet: {
          wifiAvailable: true,
          speed: '100 Mbps',
          provider: 'Airtel',
          coverage: 'full'
        }
      },
      safety: {
        fireExtinguishers: [
          {
            location: 'Corridor End',
            type: 'ABC Dry Powder',
            lastInspected: '2024-01-01T10:00:00Z',
            expiryDate: '2025-01-01T10:00:00Z'
          }
        ],
        emergencyExits: [
          {
            location: 'Staircase',
            type: 'stairs',
            capacity: 40,
            isAccessible: true
          }
        ],
        smokeDeteectors: [
          {
            location: 'Corridor Center',
            batteryLevel: 90,
            lastTested: '2024-01-01T10:00:00Z'
          }
        ],
        securityCameras: [
          {
            location: 'Main Corridor',
            type: 'corridor',
            isWorking: true,
            recordingEnabled: true
          }
        ]
      }
    },
    accessibility: {
      elevatorAccess: false,
      stairAccess: true,
      wheelchairAccessible: false,
      rampAvailable: false,
      handrailsInstalled: true,
      emergencyEvacuation: {
        evacuationPlan: true,
        assemblyPoint: 'Front Garden',
        evacuationTime: 4
      }
    },
    rules: {
      genderRestriction: 'male_only',
      ageRestriction: {
        minAge: 18,
        maxAge: 30
      },
      visitorPolicy: {
        allowedHours: '10:00-20:00',
        registrationRequired: true,
        escortRequired: true,
        maxVisitors: 1
      },
      quietHours: {
        startTime: '22:00',
        endTime: '06:00'
      }
    },
    status: 'active',
    timestamps: {
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:22:00Z',
      activatedAt: '2023-01-20T08:00:00Z',
      lastOccupied: '2024-01-16T12:15:00Z'
    }
  }
];

// Sample Room Data
export const sampleRooms = [
  {
    id: 'room-001',
    hostelId: 'hostel-001',
    floorId: 'floor-001',
    roomNumber: 'A101',
    type: 'double',
    capacity: {
      maxOccupants: 2,
      currentOccupants: 2,
      beds: [
        {
          bedNumber: 'A101-B1',
          bedType: 'single',
          isOccupied: true,
          occupantId: 'user-001'
        },
        {
          bedNumber: 'A101-B2',
          bedType: 'single',
          isOccupied: true,
          occupantId: 'user-002'
        }
      ]
    },
    dimensions: {
      length: 12,
      width: 10,
      height: 3.5,
      area: 120
    },
    availability: {
      status: 'occupied',
      availableFrom: null,
      nextAvailable: '2024-06-30T11:00:00Z'
    },
    pricing: {
      baseRent: 8000,
      securityDeposit: 5000,
      maintenanceCharges: 500,
      electricityCharges: 0,
      currency: 'INR',
      billingCycle: 'monthly'
    },
    amenities: [
      'wifi', 'fan', 'wardrobe', 'desk', 'chair', 'mirror', 
      'shared_bathroom', 'window', 'bed_linen', 'pillow', 
      'mattress', 'dustbin', 'curtains'
    ],
    furnishing: {
      furnished: 'semi_furnished',
      furniture: [
        {
          itemName: 'Study Table',
          quantity: 2,
          condition: 'good',
          lastMaintenance: '2023-12-01T10:00:00Z'
        },
        {
          itemName: 'Chair',
          quantity: 2,
          condition: 'excellent',
          lastMaintenance: '2023-12-01T10:00:00Z'
        },
        {
          itemName: 'Wardrobe',
          quantity: 1,
          condition: 'good',
          lastMaintenance: '2023-11-15T10:00:00Z'
        }
      ]
    },
    maintenance: {
      lastCleaned: '2024-01-15T08:00:00Z',
      lastInspected: '2024-01-10T10:00:00Z',
      nextInspection: '2024-02-10T10:00:00Z',
      maintenanceIssues: []
    },
    utilities: {
      electricity: {
        meterNumber: 'EM-A101',
        currentReading: 1250,
        lastReading: 1180,
        ratePerUnit: 6.5
      },
      water: {
        supply: 'scheduled',
        timing: '06:00-08:00, 18:00-20:00'
      }
    },
    safety: {
      fireExtinguisher: false,
      smokeDetector: true,
      emergencyExit: true,
      firstAidKit: false,
      securityCamera: false
    },
    images: [
      {
        url: 'https://example.com/room-a101-main.jpg',
        caption: 'Main room view',
        isPrimary: true,
        uploadedAt: '2023-01-15T10:30:00Z'
      },
      {
        url: 'https://example.com/room-a101-wardrobe.jpg',
        caption: 'Wardrobe area',
        isPrimary: false,
        uploadedAt: '2023-01-15T10:35:00Z'
      }
    ],
    history: [
      {
        eventType: 'occupied',
        eventDate: '2023-08-01T14:00:00Z',
        occupantId: 'user-001',
        notes: 'First occupant check-in',
        duration: null
      },
      {
        eventType: 'occupied',
        eventDate: '2023-09-15T15:30:00Z',
        occupantId: 'user-002',
        notes: 'Second occupant check-in',
        duration: null
      }
    ],
    timestamps: {
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:22:00Z',
      lastOccupied: '2023-09-15T15:30:00Z',
      lastVacated: null
    }
  },
  {
    id: 'room-002',
    hostelId: 'hostel-001',
    floorId: 'floor-001',
    roomNumber: 'A102',
    type: 'single',
    capacity: {
      maxOccupants: 1,
      currentOccupants: 0,
      beds: [
        {
          bedNumber: 'A102-B1',
          bedType: 'single',
          isOccupied: false,
          occupantId: null
        }
      ]
    },
    dimensions: {
      length: 10,
      width: 8,
      height: 3.5,
      area: 80
    },
    availability: {
      status: 'available',
      availableFrom: '2024-01-16T11:00:00Z',
      nextAvailable: '2024-01-16T11:00:00Z'
    },
    pricing: {
      baseRent: 6500,
      securityDeposit: 4000,
      maintenanceCharges: 400,
      electricityCharges: 0,
      currency: 'INR',
      billingCycle: 'monthly'
    },
    amenities: [
      'wifi', 'ac', 'wardrobe', 'desk', 'chair', 'mirror', 
      'private_bathroom', 'window', 'bed_linen', 'pillow', 
      'mattress', 'locker', 'dustbin', 'curtains', 'night_lamp'
    ],
    furnishing: {
      furnished: 'fully_furnished',
      furniture: [
        {
          itemName: 'Study Table',
          quantity: 1,
          condition: 'excellent',
          lastMaintenance: '2023-12-01T10:00:00Z'
        },
        {
          itemName: 'Ergonomic Chair',
          quantity: 1,
          condition: 'excellent',
          lastMaintenance: '2023-12-01T10:00:00Z'
        },
        {
          itemName: 'Wardrobe',
          quantity: 1,
          condition: 'good',
          lastMaintenance: '2023-11-15T10:00:00Z'
        },
        {
          itemName: 'Side Table',
          quantity: 1,
          condition: 'good',
          lastMaintenance: '2023-11-15T10:00:00Z'
        }
      ]
    },
    maintenance: {
      lastCleaned: '2024-01-16T08:00:00Z',
      lastInspected: '2024-01-12T10:00:00Z',
      nextInspection: '2024-02-12T10:00:00Z',
      maintenanceIssues: []
    },
    utilities: {
      electricity: {
        meterNumber: 'EM-A102',
        currentReading: 980,
        lastReading: 950,
        ratePerUnit: 6.5
      },
      water: {
        supply: 'scheduled',
        timing: '06:00-08:00, 18:00-20:00'
      }
    },
    safety: {
      fireExtinguisher: false,
      smokeDetector: true,
      emergencyExit: true,
      firstAidKit: true,
      securityCamera: false
    },
    images: [
      {
        url: 'https://example.com/room-a102-main.jpg',
        caption: 'Single occupancy room',
        isPrimary: true,
        uploadedAt: '2023-01-15T10:30:00Z'
      },
      {
        url: 'https://example.com/room-a102-bathroom.jpg',
        caption: 'Private bathroom',
        isPrimary: false,
        uploadedAt: '2023-01-15T10:35:00Z'
      }
    ],
    history: [
      {
        eventType: 'vacated',
        eventDate: '2024-01-15T11:00:00Z',
        occupantId: 'user-003',
        notes: 'Previous occupant check-out',
        duration: 180
      },
      {
        eventType: 'cleaning',
        eventDate: '2024-01-16T08:00:00Z',
        occupantId: null,
        notes: 'Deep cleaning completed',
        duration: 2
      }
    ],
    timestamps: {
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2024-01-16T08:30:00Z',
      lastOccupied: '2023-06-01T14:00:00Z',
      lastVacated: '2024-01-15T11:00:00Z'
    }
  }
];

// Sample Amenity Data
export const sampleAmenities = [
  {
    id: 'amenity-001',
    name: 'Split AC 1.5 Ton',
    category: 'room_luxury',
    type: 'appliance',
    description: 'Energy efficient split air conditioner with remote control',
    specifications: {
      brand: 'Voltas',
      model: 'VS-1850',
      size: '1.5 Ton',
      capacity: '5100W',
      powerRating: '1520W',
      warranty: {
        duration: '5 years comprehensive',
        expiryDate: '2028-03-15T00:00:00Z',
        coverage: 'Parts and service'
      }
    },
    availability: {
      scope: 'room_specific',
      status: 'available',
      isShared: false,
      maxUsers: 1,
      currentUsers: 1
    },
    location: {
      hostelId: 'hostel-001',
      floorId: 'floor-001',
      roomId: 'room-002',
      specificLocation: 'Wall mounted above bed',
      installationDate: '2023-03-15T10:00:00Z'
    },
    condition: {
      status: 'excellent',
      lastInspected: '2024-01-10T10:00:00Z',
      nextInspection: '2024-04-10T10:00:00Z',
      inspectionFrequency: 'quarterly',
      notes: 'Working perfectly, regular servicing maintained'
    },
    maintenance: {
      lastMaintenance: '2023-12-15T10:00:00Z',
      nextMaintenance: '2024-03-15T10:00:00Z',
      maintenanceFrequency: 'quarterly',
      maintenanceHistory: [
        {
          maintenanceId: 'maint-001',
          date: '2023-12-15T10:00:00Z',
          type: 'routine',
          description: 'Filter cleaning and gas pressure check',
          cost: 800,
          vendor: 'Voltas Service Center',
          warranty: '3 months',
          completedBy: 'Technician Raj',
          notes: 'All systems working normal'
        }
      ],
      issues: []
    },
    usage: {
      usageFrequency: 'daily',
      operatingHours: {
        startTime: '18:00',
        endTime: '08:00',
        is24x7: false
      },
      accessRequirements: ['none'],
      restrictions: ['Use only during specified hours to save energy']
    },
    cost: {
      purchasePrice: 32000,
      installationCost: 2500,
      monthlyMaintenance: 200,
      annualMaintenance: 2400,
      replacementCost: 35000,
      depreciationRate: 15,
      currentValue: 27200
    },
    energy: {
      powerConsumption: {
        wattage: 1520,
        dailyUsage: 8,
        monthlyUnits: 240,
        costPerMonth: 1560
      },
      energyRating: '3_star',
      environmentalImpact: {
        carbonFootprint: 180,
        recyclable: true,
        ecoFriendly: false
      }
    },
    vendor: {
      vendorName: 'Voltas Service Center',
      vendorContact: {
        phone: '+91-9876543220',
        email: 'service@voltas.com',
        address: 'Service Center, Main Road, Bangalore'
      },
      serviceContract: {
        contractId: 'VSC-2023-001',
        startDate: '2023-03-15T00:00:00Z',
        endDate: '2028-03-15T00:00:00Z',
        serviceCoverage: 'Comprehensive AMC',
        responseTime: '24 hours'
      }
    },
    compliance: {
      certifications: [
        {
          certificationType: 'BIS',
          certificateNumber: 'BIS-AC-2023-001',
          issuedBy: 'Bureau of Indian Standards',
          issuedDate: '2023-01-15T00:00:00Z',
          expiryDate: '2028-01-15T00:00:00Z',
          status: 'valid'
        }
      ],
      safetyStandards: ['BIS', 'ISI'],
      regulations: ['Energy efficiency standards']
    },
    images: [
      {
        url: 'https://example.com/ac-installation.jpg',
        caption: 'AC installed in room',
        isPrimary: true,
        uploadedAt: '2023-03-15T10:30:00Z'
      }
    ],
    tags: ['cooling', 'energy_efficient', 'remote_control'],
    ratings: {
      userRating: 4.5,
      reliabilityRating: 4.8,
      maintenanceRating: 4.2,
      overallRating: 4.5,
      reviewCount: 12
    },
    timestamps: {
      createdAt: '2023-03-15T10:00:00Z',
      updatedAt: '2024-01-10T10:30:00Z',
      purchaseDate: '2023-03-10T00:00:00Z',
      installationDate: '2023-03-15T10:00:00Z',
      lastUsed: '2024-01-16T08:00:00Z'
    }
  },
  {
    id: 'amenity-002',
    name: 'High Speed WiFi Router',
    category: 'connectivity',
    type: 'equipment',
    description: 'Dual band wireless router for high speed internet connectivity',
    specifications: {
      brand: 'TP-Link',
      model: 'Archer C6',
      size: 'Compact',
      capacity: '1200 Mbps',
      powerRating: '12W',
      warranty: {
        duration: '2 years',
        expiryDate: '2025-06-01T00:00:00Z',
        coverage: 'Hardware replacement'
      }
    },
    availability: {
      scope: 'floor_specific',
      status: 'available',
      isShared: true,
      maxUsers: 50,
      currentUsers: 28
    },
    location: {
      hostelId: 'hostel-001',
      floorId: 'floor-001',
      roomId: null,
      specificLocation: 'Network room near staircase',
      installationDate: '2023-06-01T10:00:00Z'
    },
    condition: {
      status: 'good',
      lastInspected: '2024-01-05T10:00:00Z',
      nextInspection: '2024-04-05T10:00:00Z',
      inspectionFrequency: 'quarterly',
      notes: 'Signal strength good across the floor'
    },
    maintenance: {
      lastMaintenance: '2023-11-01T10:00:00Z',
      nextMaintenance: '2024-02-01T10:00:00Z',
      maintenanceFrequency: 'quarterly',
      maintenanceHistory: [
        {
          maintenanceId: 'maint-002',
          date: '2023-11-01T10:00:00Z',
          type: 'routine',
          description: 'Firmware update and speed optimization',
          cost: 300,
          vendor: 'Network Solutions',
          warranty: '1 month',
          completedBy: 'Tech Support',
          notes: 'Performance improved after firmware update'
        }
      ],
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
      restrictions: ['Fair usage policy applies']
    },
    cost: {
      purchasePrice: 3500,
      installationCost: 500,
      monthlyMaintenance: 100,
      annualMaintenance: 1200,
      replacementCost: 4000,
      depreciationRate: 20,
      currentValue: 2800
    },
    energy: {
      powerConsumption: {
        wattage: 12,
        dailyUsage: 24,
        monthlyUnits: 9,
        costPerMonth: 58
      },
      energyRating: 'not_rated',
      environmentalImpact: {
        carbonFootprint: 8,
        recyclable: true,
        ecoFriendly: true
      }
    },
    vendor: {
      vendorName: 'Network Solutions',
      vendorContact: {
        phone: '+91-9876543230',
        email: 'support@networksolutions.com',
        address: 'Tech Park, Bangalore'
      },
      serviceContract: {
        contractId: 'NS-2023-002',
        startDate: '2023-06-01T00:00:00Z',
        endDate: '2025-06-01T00:00:00Z',
        serviceCoverage: 'Technical support and maintenance',
        responseTime: '4 hours'
      }
    },
    compliance: {
      certifications: [
        {
          certificationType: 'FCC',
          certificateNumber: 'FCC-WF-2023-002',
          issuedBy: 'Federal Communications Commission',
          issuedDate: '2023-01-01T00:00:00Z',
          expiryDate: '2028-01-01T00:00:00Z',
          status: 'valid'
        }
      ],
      safetyStandards: ['FCC', 'CE'],
      regulations: ['Wireless communication standards']
    },
    images: [
      {
        url: 'https://example.com/wifi-router-setup.jpg',
        caption: 'WiFi router in network room',
        isPrimary: true,
        uploadedAt: '2023-06-01T10:30:00Z'
      }
    ],
    tags: ['internet', 'wireless', 'high_speed', 'shared'],
    ratings: {
      userRating: 4.3,
      reliabilityRating: 4.6,
      maintenanceRating: 4.0,
      overallRating: 4.3,
      reviewCount: 28
    },
    timestamps: {
      createdAt: '2023-06-01T10:00:00Z',
      updatedAt: '2024-01-05T10:30:00Z',
      purchaseDate: '2023-05-25T00:00:00Z',
      installationDate: '2023-06-01T10:00:00Z',
      lastUsed: '2024-01-16T23:59:00Z'
    }
  }
];

// Export all sample data as a combined object for easy access
export const sampleData = {
  hostels: sampleHostels,
  floors: sampleFloors,
  rooms: sampleRooms,
  amenities: sampleAmenities
};

export default sampleData;