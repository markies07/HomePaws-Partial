import React, { useContext, useState } from 'react'
import NavBar from './NavBar'
import Header from './Header'
import LoadingScreen from '../General/LoadingScreen';
import { AuthContext } from '../General/AuthProvider';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) {
      return <Navigate to="/" />; // Redirect to the landing page if not logged in
  }
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutClick = async () => {
    setIsLogoutOpen(!isLogoutOpen);
  }

  return (
    <div className='w-full min-h-screen bg-[#A1E4E4] select-none'>
        {isLoading && <LoadingScreen />}
        <Header openLogout={handleLogoutClick} isOpen={isLogoutOpen} loading={setIsLoading}/>
        <NavBar />
    </div>

  )
}

export default Dashboard