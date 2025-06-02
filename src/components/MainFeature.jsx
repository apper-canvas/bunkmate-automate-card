import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('rooms')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkInDate: '',
    duration: '1'
  })

  // Availability search states
  const [availabilityFilters, setAvailabilityFilters] = useState({
    checkInDate: '',
    checkOutDate: '',
    roomType: 'all',
    guestCount: 1,
    amenities: [],
    minPrice: '',
    maxPrice: ''
  })

  const [availableRooms, setAvailableRooms] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Common amenities for filtering
  const commonAmenities = ['wifi', 'ac', 'private_bathroom', 'balcony', 'tv', 'refrigerator', 'wardrobe', 'study_table']
  
  // Room types for filtering
  const roomTypes = ['single', 'double', 'triple', 'quad', 'dormitory', 'suite', 'studio', 'shared']

  // Sample data
  const [rooms, setRooms] = useState([
    { id: '1', number: '101', type: 'Single', capacity: 1, currentOccupancy: 1, status: 'occupied', rent: 500 },
    { id: '2', number: '102', type: 'Single', capacity: 1, currentOccupancy: 0, status: 'available', rent: 500 },
    { id: '3', number: '103', type: 'Double', capacity: 2, currentOccupancy: 1, status: 'partial', rent: 750 },
    { id: '4', number: '104', type: 'Double', capacity: 2, currentOccupancy: 2, status: 'occupied', rent: 750 },
    { id: '5', number: '201', type: 'Quad', capacity: 4, currentOccupancy: 3, status: 'partial', rent: 1200 },
    { id: '6', number: '202', type: 'Quad', capacity: 4, currentOccupancy: 0, status: 'available', rent: 1200 },
    { id: '7', number: '203', type: 'Single', capacity: 1, currentOccupancy: 0, status: 'maintenance', rent: 500 },
    { id: '8', number: '204', type: 'Double', capacity: 2, currentOccupancy: 2, status: 'occupied', rent: 750 }
  ])

  const [residents, setResidents] = useState([
    { id: '1', name: 'John Doe', email: 'john@email.com', phone: '+1234567890', roomId: '1', status: 'active', checkInDate: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@email.com', phone: '+1234567891', roomId: '3', status: 'active', checkInDate: '2024-02-01' },
    { id: '3', name: 'Mike Johnson', email: 'mike@email.com', phone: '+1234567892', roomId: '4', status: 'active', checkInDate: '2024-01-20' }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'occupied': return 'bg-red-500'
      case 'partial': return 'bg-yellow-500'
      case 'maintenance': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'CheckCircle'
      case 'occupied': return 'UserCheck'
      case 'partial': return 'Users'
      case 'maintenance': return 'Wrench'
      default: return 'Circle'
    }
  }

  const filteredRooms = rooms.filter(room => 
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.phone.includes(searchTerm)
  )

  const handleRoomClick = (room) => {
    if (room.status === 'available' || room.status === 'partial') {
      setSelectedRoom(room)
      setShowModal(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone || !formData.checkInDate) {
      toast.error('Please fill in all required fields')
      return
    }

    // Create new resident
    const newResident = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      roomId: selectedRoom.id,
      status: 'active',
      checkInDate: formData.checkInDate
    }

    // Update room occupancy
    const updatedRooms = rooms.map(room => {
      if (room.id === selectedRoom.id) {
        const newOccupancy = room.currentOccupancy + 1
        return {
          ...room,
          currentOccupancy: newOccupancy,
          status: newOccupancy >= room.capacity ? 'occupied' : 'partial'
        }
      }
      return room
    })

    setResidents([...residents, newResident])
    setRooms(updatedRooms)
    setShowModal(false)
    setFormData({ name: '', email: '', phone: '', checkInDate: '', duration: '1' })
    setSelectedRoom(null)
    
    toast.success(`Successfully assigned ${formData.name} to Room ${selectedRoom.number}`)
  }

  const handleRemoveResident = (residentId) => {
    const resident = residents.find(r => r.id === residentId)
    if (!resident) return

    // Update room occupancy
    const updatedRooms = rooms.map(room => {
      if (room.id === resident.roomId) {
        const newOccupancy = Math.max(0, room.currentOccupancy - 1)
        return {
          ...room,
          currentOccupancy: newOccupancy,
          status: newOccupancy === 0 ? 'available' : newOccupancy < room.capacity ? 'partial' : 'occupied'
        }
      }
      return room
    })

    setResidents(residents.filter(r => r.id !== residentId))
    setRooms(updatedRooms)
    toast.success(`${resident.name} has been checked out`)
  }

const tabs = [
    { id: 'rooms', label: 'Room Management', icon: 'Building' },
    { id: 'residents', label: 'Residents', icon: 'Users' },
    { id: 'availability', label: 'Room Search', icon: 'Calendar' }
  ]

  // Availability search handlers
  const handleFilterChange = (key, value) => {
    setAvailabilityFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAmenityToggle = (amenity) => {
    setAvailabilityFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleAvailabilitySearch = async () => {
    if (!availabilityFilters.checkInDate) {
      toast.error('Please select a check-in date')
      return
    }

    setIsSearching(true)
    
    try {
      // Import the function dynamically to avoid circular dependencies
      const { checkRoomAvailability } = await import('../utils/dataManager')
      
      const searchCriteria = {
        checkInDate: availabilityFilters.checkInDate,
        checkOutDate: availabilityFilters.checkOutDate || null,
        roomType: availabilityFilters.roomType === 'all' ? null : availabilityFilters.roomType,
        guestCount: availabilityFilters.guestCount,
        amenities: availabilityFilters.amenities,
        minPrice: availabilityFilters.minPrice ? parseFloat(availabilityFilters.minPrice) : null,
        maxPrice: availabilityFilters.maxPrice ? parseFloat(availabilityFilters.maxPrice) : null
      }

      const result = await checkRoomAvailability(searchCriteria)
      
      if (result.success) {
        setAvailableRooms(result.data)
        if (result.data.length === 0) {
          toast.info('No rooms available for the selected criteria. Try adjusting your filters.')
        }
      } else {
        toast.error(result.error || 'Failed to search rooms')
        setAvailableRooms([])
      }
    } catch (error) {
      console.error('Error searching rooms:', error)
      toast.error('An error occurred while searching for rooms')
      setAvailableRooms([])
    } finally {
      setIsSearching(false)
    }
  }

  const clearAvailabilityFilters = () => {
    setAvailabilityFilters({
      checkInDate: '',
      checkOutDate: '',
      roomType: 'all',
      guestCount: 1,
      amenities: [],
      minPrice: '',
      maxPrice: ''
    })
    setAvailableRooms([])
    toast.info('Search filters cleared')
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-soft border border-surface-200 dark:border-surface-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
              Hostel Dashboard
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mt-1">
              Manage your hostel operations efficiently
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-surface-100 dark:bg-surface-700 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-none ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-surface-600 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
              }`}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'rooms' && (
          <motion.div
            key="rooms"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Room Grid */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-soft border border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white">
                  Room Layout
                </h3>
                <div className="flex items-center space-x-4 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-surface-600 dark:text-surface-400">Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-surface-600 dark:text-surface-400">Partial</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-surface-600 dark:text-surface-400">Occupied</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {filteredRooms.map((room) => (
                  <motion.div
                    key={room.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRoomClick(room)}
                    className={`room-grid-item p-3 sm:p-4 border-2 border-dashed ${
                      room.status === 'available' || room.status === 'partial'
                        ? 'cursor-pointer hover:border-primary-400 bg-gradient-to-br from-white to-surface-50 dark:from-surface-700 dark:to-surface-800'
                        : 'cursor-not-allowed bg-surface-100 dark:bg-surface-700'
                    } ${getStatusColor(room.status)} border-opacity-30`}
                  >
                    <div className="flex flex-col items-center space-y-2 h-full justify-center">
                      <ApperIcon 
                        name={getStatusIcon(room.status)} 
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${getStatusColor(room.status).replace('bg-', 'text-')}`} 
                      />
                      <div className="text-center">
                        <div className="font-bold text-sm sm:text-base text-surface-900 dark:text-white">
                          {room.number}
                        </div>
                        <div className="text-xs text-surface-600 dark:text-surface-400">
                          {room.type}
                        </div>
                        <div className="text-xs text-surface-500 dark:text-surface-500 mt-1">
                          {room.currentOccupancy}/{room.capacity}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'residents' && (
          <motion.div
            key="residents"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Residents List */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-soft border border-surface-200 dark:border-surface-700">
              <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white mb-6">
                Current Residents
              </h3>

              <div className="space-y-4">
                {filteredResidents.map((resident) => {
                  const room = rooms.find(r => r.id === resident.roomId)
                  return (
                    <motion.div
                      key={resident.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-50 dark:bg-surface-700 rounded-xl border border-surface-200 dark:border-surface-600"
                    >
                      <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-surface-900 dark:text-white">
                            {resident.name}
                          </div>
                          <div className="text-sm text-surface-600 dark:text-surface-400">
                            {resident.email} • {resident.phone}
                          </div>
                          <div className="text-xs text-surface-500 dark:text-surface-500">
                            Room {room?.number} • Check-in: {resident.checkInDate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="status-badge bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                        <button
                          onClick={() => handleRemoveResident(resident.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <ApperIcon name="UserMinus" className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}

                {filteredResidents.length === 0 && (
                  <div className="text-center py-12">
                    <ApperIcon name="Users" className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                    <p className="text-surface-600 dark:text-surface-400">
                      {searchTerm ? 'No residents found matching your search.' : 'No residents checked in yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
</motion.div>
        )}

        {activeTab === 'availability' && (
          <motion.div
            key="availability"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Search Filters */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-soft border border-surface-200 dark:border-surface-700">
              <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white mb-6">
                Search Available Rooms
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    value={availabilityFilters.checkInDate}
                    onChange={(e) => handleFilterChange('checkInDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={availabilityFilters.checkOutDate}
                    onChange={(e) => handleFilterChange('checkOutDate', e.target.value)}
                    min={availabilityFilters.checkInDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Room Type
                  </label>
                  <select
                    value={availabilityFilters.roomType}
                    onChange={(e) => handleFilterChange('roomType', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">All Types</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Number of Guests
                  </label>
                  <select
                    value={availabilityFilters.guestCount}
                    onChange={(e) => handleFilterChange('guestCount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(count => (
                      <option key={count} value={count}>
                        {count} Guest{count > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
                  Required Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        availabilityFilters.amenities.includes(amenity)
                          ? 'bg-primary-500 text-white'
                          : 'bg-surface-100 dark:bg-surface-600 text-surface-700 dark:text-surface-300 hover:bg-primary-100 dark:hover:bg-primary-900'
                      }`}
                    >
                      {amenity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAvailabilitySearch}
                  disabled={isSearching || !availabilityFilters.checkInDate}
                  className="flex items-center justify-center space-x-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Search" className="h-4 w-4" />
                      <span>Search Rooms</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={clearAvailabilityFilters}
                  className="flex items-center justify-center space-x-2 px-6 py-2 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                >
                  <ApperIcon name="RotateCcw" className="h-4 w-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 sm:p-6 shadow-soft border border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-white">
                  Available Rooms
                  {availableRooms.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-surface-600 dark:text-surface-400">
                      ({availableRooms.length} found)
                    </span>
                  )}
                </h3>
              </div>

              {availableRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRooms.map((room) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl border border-surface-200 dark:border-surface-600 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-surface-900 dark:text-white">
                            Room {room.roomNumber}
                          </h4>
                          <p className="text-sm text-surface-600 dark:text-surface-400 capitalize">
                            {room.type} Room
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          room.availability.status === 'available' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {room.availability.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-surface-600 dark:text-surface-400">Capacity:</span>
                          <span className="font-medium text-surface-900 dark:text-white">
                            {room.capacity.maxOccupants} guests
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-600 dark:text-surface-400">Available Beds:</span>
                          <span className="font-medium text-surface-900 dark:text-white">
                            {room.availableBeds}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-600 dark:text-surface-400">Monthly Rent:</span>
                          <span className="font-medium text-primary-600 dark:text-primary-400">
                            ${room.pricing.baseRent}
                          </span>
                        </div>
                        {availabilityFilters.checkOutDate && (
                          <div className="flex justify-between">
                            <span className="text-surface-600 dark:text-surface-400">Total Cost:</span>
                            <span className="font-medium text-primary-600 dark:text-primary-400">
                              ${room.totalCost?.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      {room.amenities?.available?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-600">
                          <p className="text-xs text-surface-600 dark:text-surface-400 mb-2">Amenities:</p>
                          <div className="flex flex-wrap gap-1">
                            {room.amenities.available.slice(0, 3).map(amenity => (
                              <span
                                key={amenity}
                                className="px-2 py-1 bg-surface-200 dark:bg-surface-600 text-xs rounded-md text-surface-700 dark:text-surface-300"
                              >
                                {amenity.replace('_', ' ')}
                              </span>
                            ))}
                            {room.amenities.available.length > 3 && (
                              <span className="px-2 py-1 bg-surface-200 dark:bg-surface-600 text-xs rounded-md text-surface-700 dark:text-surface-300">
                                +{room.amenities.available.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setSelectedRoom(room)
                          setShowModal(true)
                        }}
                        disabled={!room.isFullyAvailable}
                        className="w-full mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        {room.isFullyAvailable ? 'Book Now' : 'Insufficient Capacity'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="Calendar" className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                  <p className="text-surface-600 dark:text-surface-400">
                    {isSearching ? 'Searching for available rooms...' : 'Search for available rooms using the filters above.'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
                  Check In to Room {selectedRoom.number}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-600 dark:text-surface-400">Room Type:</span>
                    <span className="font-medium text-surface-900 dark:text-white">{selectedRoom.type}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-surface-600 dark:text-surface-400">Monthly Rent:</span>
                    <span className="font-medium text-surface-900 dark:text-white">${selectedRoom.rent}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-surface-600 dark:text-surface-400">Available Beds:</span>
                    <span className="font-medium text-surface-900 dark:text-white">
                      {selectedRoom.capacity - selectedRoom.currentOccupancy}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium"
                  >
{activeTab === 'availability' ? 'Book Room' : 'Check In'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
)}
      </AnimatePresence>

      {/* Room Change Request Modal */}
      <AnimatePresence>
        {showChangeRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowChangeRequestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
                  Room Change Request
                </h3>
                <button
                  onClick={() => setShowChangeRequestModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleChangeRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Requested By *
                  </label>
                  <input
                    type="text"
                    required
                    value={changeRequestFormData.requestedBy}
                    onChange={(e) => setChangeRequestFormData({ ...changeRequestFormData, requestedBy: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Current Room *
                  </label>
                  <select
                    required
                    value={changeRequestFormData.currentRoomId}
                    onChange={(e) => setChangeRequestFormData({ ...changeRequestFormData, currentRoomId: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select current room</option>
                    {rooms.filter(room => room.status === 'occupied' || room.status === 'partial').map(room => (
                      <option key={room.id} value={room.id}>
                        Room {room.number} - {room.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Desired Room *
                  </label>
                  <select
                    required
                    value={changeRequestFormData.desiredRoomId}
                    onChange={(e) => setChangeRequestFormData({ ...changeRequestFormData, desiredRoomId: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select desired room</option>
                    {rooms.filter(room => room.status === 'available' || room.status === 'partial').map(room => (
                      <option key={room.id} value={room.id}>
                        Room {room.number} - {room.type} (${room.rent}/month)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Reason for Change *
                  </label>
                  <textarea
                    required
                    value={changeRequestFormData.reason}
                    onChange={(e) => setChangeRequestFormData({ ...changeRequestFormData, reason: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    placeholder="Please explain why you want to change rooms..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Preferred Change Date
                  </label>
                  <input
                    type="date"
                    value={changeRequestFormData.preferredDate}
                    onChange={(e) => setChangeRequestFormData({ ...changeRequestFormData, preferredDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowChangeRequestModal(false)}
                    className="flex-1 px-4 py-2 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors font-medium"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature