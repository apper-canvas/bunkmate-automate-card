import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  return (
<div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-950 dark:via-surface-900 dark:to-surface-800 bg-mesh">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="z-50"
        toastClassName="backdrop-blur-lg bg-white/90 dark:bg-surface-800/90 text-surface-900 dark:text-surface-100 border border-surface-200/50 dark:border-surface-700/50 shadow-card rounded-2xl"
        bodyClassName="text-sm font-medium"
        progressClassName="bg-gradient-to-r from-primary-500 to-secondary-500"
      />
    </div>
  )
}

export default App