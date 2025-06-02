import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
<div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card sticky top-0 z-40 border-0 border-b border-surface-200/60 dark:border-surface-700/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 sm:h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow-sm">
                <ApperIcon name="Building2" className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text">BunkMate</h1>
                <p className="text-sm sm:text-base text-surface-600 dark:text-surface-400 font-medium">Smart Hostel Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={toggleDarkMode}
                className="modern-button modern-button-secondary p-3 !px-3 group"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="h-5 w-5 text-surface-700 dark:text-surface-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" 
                />
              </button>
              
              <div className="hidden sm:flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm bg-success-50 dark:bg-success-900/20 px-3 py-2 rounded-full border border-success-200 dark:border-success-800">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse-soft"></div>
                  <span className="text-success-700 dark:text-success-300 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <MainFeature />
      </main>

      {/* Enhanced Quick Stats Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card border-0 border-t border-surface-200/60 dark:border-surface-700/60 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Rooms", value: "48", icon: "Home", color: "primary" },
              { label: "Occupied", value: "36", icon: "Users", color: "error" },
              { label: "Available", value: "12", icon: "Calendar", color: "success" },
              { label: "Revenue", value: "$24,580", icon: "DollarSign", color: "accent" }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 text-white shadow-card group-hover:shadow-card-hover transition-all duration-300 group-hover:scale-110`}>
                  <ApperIcon name={stat.icon} className="h-6 w-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-surface-600 dark:text-surface-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home