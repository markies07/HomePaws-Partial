import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import LandingPage from "./components/Landing Page/LandingPage"
import Dashboard from "./components/User/Dashboard"
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "./components/General/AuthProvider"
import PrivateRoute from "./components/General/PrivateRoute"

function App() {
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
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
