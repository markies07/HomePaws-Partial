import React from 'react'
import logo from '../../assets/images/white-logo.png'
import search from './assets/search-icon.svg'
import notif from './assets/notif-icon.svg'
import Logout from './Logout'
import { useAuth } from '../General/AuthProvider'

function Header({openLogout, isOpen, loading}) {
  const {user, userData} = useAuth();

  return (
    <div className='fixed top-0 z-20 bg-secondary w-full p-3 px-5 md:px-7 justify-between flex h-20 lg:drop-shadow-md'>
        <img className='w-40 md:w-40 object-contain' src={logo} alt="" />
        <div className='flex relative justify-center gap-3 sm:gap-5 lg:gap-7 items-center'>
            <img className='w-10 cursor-pointer hover:bg-[#facdcd] duration-300 p-2 overflow-visible bg-[#FFDEDE] rounded-full' src={search} alt="" />
            <img className='w-10 cursor-pointer hover:bg-[#facdcd] duration-300 p-2 overflow-visible bg-[#FFDEDE] rounded-full' src={notif} alt="" />
            <img onClick={openLogout} className='w-12 border-2 border-secondary hover:border-primary duration-150 cursor-pointer lg:ml-3 rounded-full' src={userData?.profilePictureURL} alt="" />
            <Logout isOpen={isOpen} loading={loading} />
        </div>
    </div>
  )
}

export default Header