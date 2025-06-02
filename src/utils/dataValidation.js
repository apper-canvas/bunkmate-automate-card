// Data validation utilities for hostel management schemas
import { toast } from 'react-toastify';

// Generic validation helper functions
export const validateRequired = (value, fieldName) => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[0-9]{10,15}$/;
  if (phone && !phoneRegex.test(phone)) {
    return 'Invalid phone number format';
  }
  return null;
};

export const validateUrl = (url) => {
  try {
    if (url) new URL(url);
    return null;
  } catch {
    return 'Invalid URL format';
  }
};

export const validateRange = (value, min, max, fieldName) => {
  if (value !== null && value !== undefined) {
    if (value < min || value > max) {
      return `${fieldName} must be between ${min} and ${max}`;
    }
  }
  return null;
};

export const validateEnum = (value, enumValues, fieldName) => {
  if (value && !enumValues.includes(value)) {
    return `${fieldName} must be one of: ${enumValues.join(', ')}`;
  }
  return null;
};

export const validateDate = (dateString, fieldName) => {
  if (dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return `${fieldName} must be a valid date`;
    }
  }
  return null;
};

export const validateUUID = (uuid, fieldName) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuid && !uuidRegex.test(uuid)) {
    return `${fieldName} must be a valid UUID`;
  }
  return null;
};

export const validatePincode = (pincode) => {
  const pincodeRegex = /^[0-9]{6}$/;
  if (pincode && !pincodeRegex.test(pincode)) {
    return 'Pincode must be exactly 6 digits';
  }
  return null;
};

export const validateTime = (time, fieldName) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (time && !timeRegex.test(time)) {
    return `${fieldName} must be in HH:MM format`;
  }
  return null;
};

// Hostel validation functions
export const validateHostelData = (hostelData) => {
  const errors = [];

  // Basic information validation
  const nameError = validateRequired(hostelData.name, 'Hostel name') ||
                   validateMinLength(hostelData.name, 2, 'Hostel name') ||
                   validateMaxLength(hostelData.name, 100, 'Hostel name');
  if (nameError) errors.push(nameError);

  // Location validation
  if (hostelData.location) {
    const addressError = validateRequired(hostelData.location.address, 'Address') ||
                        validateMinLength(hostelData.location.address, 10, 'Address') ||
                        validateMaxLength(hostelData.location.address, 200, 'Address');
    if (addressError) errors.push(addressError);

    const cityError = validateRequired(hostelData.location.city, 'City') ||
                     validateMinLength(hostelData.location.city, 2, 'City') ||
                     validateMaxLength(hostelData.location.city, 50, 'City');
    if (cityError) errors.push(cityError);

    const stateError = validateRequired(hostelData.location.state, 'State') ||
                      validateMinLength(hostelData.location.state, 2, 'State') ||
                      validateMaxLength(hostelData.location.state, 50, 'State');
    if (stateError) errors.push(stateError);

    const countryError = validateRequired(hostelData.location.country, 'Country') ||
                        validateMinLength(hostelData.location.country, 2, 'Country') ||
                        validateMaxLength(hostelData.location.country, 50, 'Country');
    if (countryError) errors.push(countryError);

    const pincodeError = validateRequired(hostelData.location.pincode, 'Pincode') ||
                        validatePincode(hostelData.location.pincode);
    if (pincodeError) errors.push(pincodeError);

    // Coordinates validation
    if (hostelData.location.coordinates) {
      const latError = validateRange(hostelData.location.coordinates.latitude, -90, 90, 'Latitude');
      if (latError) errors.push(latError);

      const lngError = validateRange(hostelData.location.coordinates.longitude, -180, 180, 'Longitude');
      if (lngError) errors.push(lngError);
    }
  }

  // Capacity validation
  if (hostelData.capacity) {
    const totalRoomsError = validateRequired(hostelData.capacity.totalRooms, 'Total rooms') ||
                           validateRange(hostelData.capacity.totalRooms, 1, 1000, 'Total rooms');
    if (totalRoomsError) errors.push(totalRoomsError);

    const totalBedsError = validateRequired(hostelData.capacity.totalBeds, 'Total beds') ||
                          validateRange(hostelData.capacity.totalBeds, 1, 5000, 'Total beds');
    if (totalBedsError) errors.push(totalBedsError);

    const maxOccupancyError = validateRequired(hostelData.capacity.maxOccupancy, 'Max occupancy') ||
                             validateRange(hostelData.capacity.maxOccupancy, 1, 5000, 'Max occupancy');
    if (maxOccupancyError) errors.push(maxOccupancyError);

    if (hostelData.capacity.currentOccupancy > hostelData.capacity.maxOccupancy) {
      errors.push('Current occupancy cannot exceed maximum occupancy');
    }
  }

  // Contact validation
  if (hostelData.contact) {
    const phoneError = validateRequired(hostelData.contact.phone, 'Phone') ||
                      validatePhone(hostelData.contact.phone);
    if (phoneError) errors.push(phoneError);

    const emailError = validateRequired(hostelData.contact.email, 'Email') ||
                      validateEmail(hostelData.contact.email);
    if (emailError) errors.push(emailError);

    if (hostelData.contact.website) {
      const websiteError = validateUrl(hostelData.contact.website);
      if (websiteError) errors.push('Website: ' + websiteError);
    }

    if (hostelData.contact.emergencyContact) {
      const emergencyError = validatePhone(hostelData.contact.emergencyContact);
      if (emergencyError) errors.push('Emergency contact: ' + emergencyError);
    }
  }

  // Management validation
  if (hostelData.management) {
    const managerNameError = validateRequired(hostelData.management.managerName, 'Manager name') ||
                            validateMinLength(hostelData.management.managerName, 2, 'Manager name') ||
                            validateMaxLength(hostelData.management.managerName, 100, 'Manager name');
    if (managerNameError) errors.push(managerNameError);

    const managerPhoneError = validateRequired(hostelData.management.managerPhone, 'Manager phone') ||
                             validatePhone(hostelData.management.managerPhone);
    if (managerPhoneError) errors.push(managerPhoneError);

    const managerEmailError = validateRequired(hostelData.management.managerEmail, 'Manager email') ||
                             validateEmail(hostelData.management.managerEmail);
    if (managerEmailError) errors.push(managerEmailError);

    // Operating hours validation
    if (hostelData.management.operatingHours) {
      const checkInError = validateTime(hostelData.management.operatingHours.checkIn, 'Check-in time');
      if (checkInError) errors.push(checkInError);

      const checkOutError = validateTime(hostelData.management.operatingHours.checkOut, 'Check-out time');
      if (checkOutError) errors.push(checkOutError);

      if (hostelData.management.operatingHours.officeHours) {
        const startError = validateTime(hostelData.management.operatingHours.officeHours.start, 'Office start time');
        if (startError) errors.push(startError);

        const endError = validateTime(hostelData.management.operatingHours.officeHours.end, 'Office end time');
        if (endError) errors.push(endError);
      }
    }
  }

  // Policies validation
  if (hostelData.policies) {
    const smokingPolicyError = validateEnum(
      hostelData.policies.smokingPolicy,
      ['allowed', 'designated_areas', 'prohibited'],
      'Smoking policy'
    );
    if (smokingPolicyError) errors.push(smokingPolicyError);

    const alcoholPolicyError = validateEnum(
      hostelData.policies.alcoholPolicy,
      ['allowed', 'prohibited'],
      'Alcohol policy'
    );
    if (alcoholPolicyError) errors.push(alcoholPolicyError);

    if (hostelData.policies.quietHours) {
      const startError = validateTime(hostelData.policies.quietHours.start, 'Quiet hours start');
      if (startError) errors.push(startError);

      const endError = validateTime(hostelData.policies.quietHours.end, 'Quiet hours end');
      if (endError) errors.push(endError);
    }

    if (hostelData.policies.curfew) {
      const curfewError = validateTime(hostelData.policies.curfew, 'Curfew time');
      if (curfewError) errors.push(curfewError);
    }

    if (hostelData.policies.securityDeposit !== undefined) {
      const depositError = validateRange(hostelData.policies.securityDeposit, 0, Infinity, 'Security deposit');
      if (depositError) errors.push(depositError);
    }
  }

  return errors;
};

// Room validation functions
export const validateRoomData = (roomData) => {
  const errors = [];

  // Basic information validation
  const hostelIdError = validateRequired(roomData.hostelId, 'Hostel ID') ||
                       validateUUID(roomData.hostelId, 'Hostel ID');
  if (hostelIdError) errors.push(hostelIdError);

  const floorIdError = validateRequired(roomData.floorId, 'Floor ID') ||
                      validateUUID(roomData.floorId, 'Floor ID');
  if (floorIdError) errors.push(floorIdError);

  const roomNumberError = validateRequired(roomData.roomNumber, 'Room number') ||
                         validateMinLength(roomData.roomNumber, 1, 'Room number') ||
                         validateMaxLength(roomData.roomNumber, 10, 'Room number');
  if (roomNumberError) errors.push(roomNumberError);

  const typeError = validateRequired(roomData.type, 'Room type') ||
                   validateEnum(
                     roomData.type,
                     ['single', 'double', 'triple', 'quad', 'dormitory', 'suite', 'studio', 'shared'],
                     'Room type'
                   );
  if (typeError) errors.push(typeError);

  // Capacity validation
  if (roomData.capacity) {
    const maxOccupantsError = validateRequired(roomData.capacity.maxOccupants, 'Max occupants') ||
                             validateRange(roomData.capacity.maxOccupants, 1, 20, 'Max occupants');
    if (maxOccupantsError) errors.push(maxOccupantsError);

    if (roomData.capacity.currentOccupants > roomData.capacity.maxOccupants) {
      errors.push('Current occupants cannot exceed maximum occupants');
    }

    // Bed validation
    if (roomData.capacity.beds && roomData.capacity.beds.length > 0) {
      roomData.capacity.beds.forEach((bed, index) => {
        const bedNumberError = validateRequired(bed.bedNumber, `Bed ${index + 1} number`);
        if (bedNumberError) errors.push(bedNumberError);

        const bedTypeError = validateRequired(bed.bedType, `Bed ${index + 1} type`) ||
                            validateEnum(
                              bed.bedType,
                              ['single', 'double', 'bunk_top', 'bunk_bottom'],
                              `Bed ${index + 1} type`
                            );
        if (bedTypeError) errors.push(bedTypeError);
      });
    }
  }

  // Pricing validation
  if (roomData.pricing) {
    const baseRentError = validateRequired(roomData.pricing.baseRent, 'Base rent') ||
                         validateRange(roomData.pricing.baseRent, 0, 100000, 'Base rent');
    if (baseRentError) errors.push(baseRentError);

    const securityDepositError = validateRange(roomData.pricing.securityDeposit, 0, 500000, 'Security deposit');
    if (securityDepositError) errors.push(securityDepositError);

    const maintenanceChargesError = validateRange(roomData.pricing.maintenanceCharges, 0, 10000, 'Maintenance charges');
    if (maintenanceChargesError) errors.push(maintenanceChargesError);

    const electricityChargesError = validateRange(roomData.pricing.electricityCharges, 0, 10000, 'Electricity charges');
    if (electricityChargesError) errors.push(electricityChargesError);

    const billingCycleError = validateEnum(
      roomData.pricing.billingCycle,
      ['monthly', 'quarterly', 'semi-annual', 'annual'],
      'Billing cycle'
    );
    if (billingCycleError) errors.push(billingCycleError);
  }

  // Availability validation
  if (roomData.availability) {
    const statusError = validateEnum(
      roomData.availability.status,
      ['available', 'occupied', 'maintenance', 'reserved', 'cleaning'],
      'Availability status'
    );
    if (statusError) errors.push(statusError);

    if (roomData.availability.availableFrom) {
      const availableFromError = validateDate(roomData.availability.availableFrom, 'Available from');
      if (availableFromError) errors.push(availableFromError);
    }

    if (roomData.availability.nextAvailable) {
      const nextAvailableError = validateDate(roomData.availability.nextAvailable, 'Next available');
      if (nextAvailableError) errors.push(nextAvailableError);
    }
  }

  // Dimensions validation
  if (roomData.dimensions) {
    if (roomData.dimensions.length !== undefined) {
      const lengthError = validateRange(roomData.dimensions.length, 1, 50, 'Room length');
      if (lengthError) errors.push(lengthError);
    }

    if (roomData.dimensions.width !== undefined) {
      const widthError = validateRange(roomData.dimensions.width, 1, 50, 'Room width');
      if (widthError) errors.push(widthError);
    }

    if (roomData.dimensions.height !== undefined) {
      const heightError = validateRange(roomData.dimensions.height, 2, 10, 'Room height');
      if (heightError) errors.push(heightError);
    }

    if (roomData.dimensions.area !== undefined) {
      const areaError = validateRange(roomData.dimensions.area, 1, 2500, 'Room area');
      if (areaError) errors.push(areaError);
    }
  }

  return errors;
};

// Floor validation functions
export const validateFloorData = (floorData) => {
  const errors = [];

  // Basic information validation
  const hostelIdError = validateRequired(floorData.hostelId, 'Hostel ID') ||
                       validateUUID(floorData.hostelId, 'Hostel ID');
  if (hostelIdError) errors.push(hostelIdError);

  const floorNumberError = validateRequired(floorData.floorNumber, 'Floor number') ||
                          validateRange(floorData.floorNumber, -5, 50, 'Floor number');
  if (floorNumberError) errors.push(floorNumberError);

  const floorNameError = validateRequired(floorData.floorName, 'Floor name') ||
                        validateMinLength(floorData.floorName, 1, 'Floor name') ||
                        validateMaxLength(floorData.floorName, 50, 'Floor name');
  if (floorNameError) errors.push(floorNameError);

  if (floorData.blockName) {
    const blockNameError = validateMinLength(floorData.blockName, 1, 'Block name') ||
                          validateMaxLength(floorData.blockName, 20, 'Block name');
    if (blockNameError) errors.push(blockNameError);
  }

  const typeError = validateEnum(
    floorData.type,
    ['residential', 'administrative', 'recreational', 'utility', 'commercial', 'mixed'],
    'Floor type'
  );
  if (typeError) errors.push(typeError);

  // Capacity validation
  if (floorData.capacity) {
    const totalRoomsError = validateRequired(floorData.capacity.totalRooms, 'Total rooms') ||
                           validateRange(floorData.capacity.totalRooms, 0, 100, 'Total rooms');
    if (totalRoomsError) errors.push(totalRoomsError);

    const totalBedsError = validateRequired(floorData.capacity.totalBeds, 'Total beds') ||
                          validateRange(floorData.capacity.totalBeds, 0, 500, 'Total beds');
    if (totalBedsError) errors.push(totalBedsError);

    const maxOccupancyError = validateRequired(floorData.capacity.maxOccupancy, 'Max occupancy') ||
                             validateRange(floorData.capacity.maxOccupancy, 0, 500, 'Max occupancy');
    if (maxOccupancyError) errors.push(maxOccupancyError);

    if (floorData.capacity.occupiedRooms > floorData.capacity.totalRooms) {
      errors.push('Occupied rooms cannot exceed total rooms');
    }

    if (floorData.capacity.occupiedBeds > floorData.capacity.totalBeds) {
      errors.push('Occupied beds cannot exceed total beds');
    }

    if (floorData.capacity.currentOccupancy > floorData.capacity.maxOccupancy) {
      errors.push('Current occupancy cannot exceed maximum occupancy');
    }
  }

  // Layout validation
  if (floorData.layout) {
    if (floorData.layout.dimensions) {
      if (floorData.layout.dimensions.length !== undefined) {
        const lengthError = validateRange(floorData.layout.dimensions.length, 1, 200, 'Floor length');
        if (lengthError) errors.push(lengthError);
      }

      if (floorData.layout.dimensions.width !== undefined) {
        const widthError = validateRange(floorData.layout.dimensions.width, 1, 200, 'Floor width');
        if (widthError) errors.push(widthError);
      }

      if (floorData.layout.dimensions.height !== undefined) {
        const heightError = validateRange(floorData.layout.dimensions.height, 2, 10, 'Floor height');
        if (heightError) errors.push(heightError);
      }

      if (floorData.layout.dimensions.totalArea !== undefined) {
        const areaError = validateRange(floorData.layout.dimensions.totalArea, 1, 40000, 'Floor area');
        if (areaError) errors.push(areaError);
      }
    }

    const roomLayoutError = validateEnum(
      floorData.layout.roomLayout,
      ['linear', 'l_shaped', 'u_shaped', 'rectangular', 'custom'],
      'Room layout'
    );
    if (roomLayoutError) errors.push(roomLayoutError);

    if (floorData.layout.corridorWidth !== undefined) {
      const corridorWidthError = validateRange(floorData.layout.corridorWidth, 1, 10, 'Corridor width');
      if (corridorWidthError) errors.push(corridorWidthError);
    }
  }

  return errors;
};

// Amenity validation functions
export const validateAmenityData = (amenityData) => {
  const errors = [];

  // Basic information validation
  const nameError = validateRequired(amenityData.name, 'Amenity name') ||
                   validateMinLength(amenityData.name, 2, 'Amenity name') ||
                   validateMaxLength(amenityData.name, 100, 'Amenity name');
  if (nameError) errors.push(nameError);

  const categoryError = validateRequired(amenityData.category, 'Category') ||
                       validateEnum(
                         amenityData.category,
                         [
                           'room_basic', 'room_luxury', 'bathroom', 'kitchen', 'connectivity',
                           'entertainment', 'comfort', 'storage', 'study', 'safety',
                           'maintenance', 'common_area', 'recreational', 'utility'
                         ],
                         'Category'
                       );
  if (categoryError) errors.push(categoryError);

  const typeError = validateRequired(amenityData.type, 'Type') ||
                   validateEnum(
                     amenityData.type,
                     ['appliance', 'furniture', 'fixture', 'service', 'utility', 'facility', 'equipment', 'accessory'],
                     'Type'
                   );
  if (typeError) errors.push(typeError);

  if (amenityData.description) {
    const descriptionError = validateMaxLength(amenityData.description, 500, 'Description');
    if (descriptionError) errors.push(descriptionError);
  }

  // Availability validation
  if (amenityData.availability) {
    const scopeError = validateRequired(amenityData.availability.scope, 'Scope') ||
                      validateEnum(
                        amenityData.availability.scope,
                        ['room_specific', 'floor_specific', 'building_wide', 'shared'],
                        'Scope'
                      );
    if (scopeError) errors.push(scopeError);

    const statusError = validateEnum(
      amenityData.availability.status,
      ['available', 'unavailable', 'maintenance', 'replacement_needed'],
      'Status'
    );
    if (statusError) errors.push(statusError);

    if (amenityData.availability.maxUsers !== undefined) {
      const maxUsersError = validateRange(amenityData.availability.maxUsers, 1, Infinity, 'Max users');
      if (maxUsersError) errors.push(maxUsersError);
    }

    if (amenityData.availability.currentUsers > amenityData.availability.maxUsers) {
      errors.push('Current users cannot exceed maximum users');
    }
  }

  // Location validation
  if (amenityData.location) {
    if (amenityData.location.hostelId) {
      const hostelIdError = validateUUID(amenityData.location.hostelId, 'Hostel ID');
      if (hostelIdError) errors.push(hostelIdError);
    }

    if (amenityData.location.floorId) {
      const floorIdError = validateUUID(amenityData.location.floorId, 'Floor ID');
      if (floorIdError) errors.push(floorIdError);
    }

    if (amenityData.location.roomId) {
      const roomIdError = validateUUID(amenityData.location.roomId, 'Room ID');
      if (roomIdError) errors.push(roomIdError);
    }

    if (amenityData.location.specificLocation) {
      const locationError = validateMaxLength(amenityData.location.specificLocation, 100, 'Specific location');
      if (locationError) errors.push(locationError);
    }

    if (amenityData.location.installationDate) {
      const installationDateError = validateDate(amenityData.location.installationDate, 'Installation date');
      if (installationDateError) errors.push(installationDateError);
    }
  }

  // Condition validation
  if (amenityData.condition) {
    const statusError = validateEnum(
      amenityData.condition.status,
      ['excellent', 'good', 'fair', 'poor', 'needs_replacement'],
      'Condition status'
    );
    if (statusError) errors.push(statusError);

    if (amenityData.condition.lastInspected) {
      const lastInspectedError = validateDate(amenityData.condition.lastInspected, 'Last inspected');
      if (lastInspectedError) errors.push(lastInspectedError);
    }

    if (amenityData.condition.nextInspection) {
      const nextInspectionError = validateDate(amenityData.condition.nextInspection, 'Next inspection');
      if (nextInspectionError) errors.push(nextInspectionError);
    }

    const frequencyError = validateEnum(
      amenityData.condition.inspectionFrequency,
      ['weekly', 'monthly', 'quarterly', 'semi_annual', 'annual'],
      'Inspection frequency'
    );
    if (frequencyError) errors.push(frequencyError);
  }

  // Cost validation
  if (amenityData.cost) {
    const purchasePriceError = validateRange(amenityData.cost.purchasePrice, 0, Infinity, 'Purchase price');
    if (purchasePriceError) errors.push(purchasePriceError);

    const installationCostError = validateRange(amenityData.cost.installationCost, 0, Infinity, 'Installation cost');
    if (installationCostError) errors.push(installationCostError);

    const monthlyMaintenanceError = validateRange(amenityData.cost.monthlyMaintenance, 0, Infinity, 'Monthly maintenance');
    if (monthlyMaintenanceError) errors.push(monthlyMaintenanceError);

    const annualMaintenanceError = validateRange(amenityData.cost.annualMaintenance, 0, Infinity, 'Annual maintenance');
    if (annualMaintenanceError) errors.push(annualMaintenanceError);

    const replacementCostError = validateRange(amenityData.cost.replacementCost, 0, Infinity, 'Replacement cost');
    if (replacementCostError) errors.push(replacementCostError);

    const depreciationRateError = validateRange(amenityData.cost.depreciationRate, 0, 100, 'Depreciation rate');
    if (depreciationRateError) errors.push(depreciationRateError);

    const currentValueError = validateRange(amenityData.cost.currentValue, 0, Infinity, 'Current value');
    if (currentValueError) errors.push(currentValueError);
  }

  return errors;
};

// Combined validation function
export const validateData = (data, schemaType) => {
  let errors = [];

  switch (schemaType) {
    case 'hostel':
      errors = validateHostelData(data);
      break;
    case 'room':
      errors = validateRoomData(data);
      break;
    case 'floor':
      errors = validateFloorData(data);
      break;
    case 'amenity':
      errors = validateAmenityData(data);
      break;
    default:
      errors = ['Unknown schema type'];
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Show validation errors as toast notifications
export const showValidationErrors = (errors) => {
  if (errors.length > 0) {
    errors.forEach((error, index) => {
      setTimeout(() => {
        toast.error(error, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }, index * 200); // Stagger the notifications
    });
  }
};

// Show validation success message
export const showValidationSuccess = (message = 'Data validated successfully') => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });
};

export default {
  validateData,
  validateHostelData,
  validateRoomData,
  validateFloorData,
  validateAmenityData,
  showValidationErrors,
  showValidationSuccess
};