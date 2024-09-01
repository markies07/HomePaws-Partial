import React from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import LandingPage from "./components/Landing Page/LandingPage"
import Dashboard from "./components/User/Dashboard"
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "./components/General/AuthProvider"

function App() {
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  )
}

export default App
