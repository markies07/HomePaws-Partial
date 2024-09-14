import React from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import LandingPage from "./components/Landing Page/LandingPage"
import Dashboard from "./components/User/Dashboard"
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "./components/General/AuthProvider"
import PrivateRoute from "./components/General/PrivateRoute"
import FindPet from "./components/User/Find Pet/FindPet"
import NewsFeed from "./components/User/News Feed/NewsFeed"
import Chat from "./components/User/Chat/Chat"
import Profile from "./components/User/Profile/Profile"
import PetInfo from "./components/User/Find Pet/PetInfo"
import AdoptionForm from "./components/User/Find Pet/AdoptionForm"
import Notification from "./components/User/Notification/Notification"
import { UserDataProvider } from "./components/General/UserDataProvider"
import { AdoptionDataProvider } from "./components/General/AdoptionDataProvider"

function App() {
  
  return (
    <AuthProvider>
      <UserDataProvider>
        <AdoptionDataProvider>
        <Router>
          <Routes>
            {/* PUBLIC ROUTE */}
            <Route path="/" element={<LandingPage />} />

            {/* PUBLIC ROUTE */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard/*" element={<Dashboard />}>
                {/* DEFAULT ROUTE */}
                <Route path="" element={<Navigate replace to="find-pet" />} />

                {/* FIND PET SECTION */}
                <Route path="find-pet" element={<FindPet />} />
                <Route path="find-pet/:petID" element={<PetInfo />} />
                <Route path="find-pet/adoption/:petID" element={<AdoptionForm />} />

                {/* NEWS FEED SECTION */}
                <Route path="news-feed" element={<NewsFeed />} />

                {/* NOTIFICATION SECTION */}
                <Route path="notification" element={<Notification />} />

                {/* CHAT SECTION */}
                <Route path="chat" element={<Chat />} />

                {/* PROFILE SECTION */}
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
          />
        </Router>
        </AdoptionDataProvider>
      </UserDataProvider>
    </AuthProvider>
  )
}

export default App
