import React, { useContext, useState } from 'react'
import NavBar from './NavBar'
import Header from './Header'
import LoadingScreen from '../General/LoadingScreen';
import { AuthContext } from '../General/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) {
      return <Navigate to="/" />; 
  }
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutClick = async () => {
    setIsLogoutOpen(!isLogoutOpen);
  }

  return (
    <div className='w-full min-h-screen bg-[#A1E4E4] select-none font-poppins'>
        {isLoading && <LoadingScreen />}
        <Header openLogout={handleLogoutClick} isOpen={isLogoutOpen} loading={setIsLoading}/>
        <Outlet />
        <NavBar />
    </div>

  )
}

export default Dashboard