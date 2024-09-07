import React, { useState } from 'react'
import findpet from './assets/findpet-icon.svg'
import activefindpet from './assets/active-findpet.svg'
import newsfeed from './assets/newsfeed-icon.svg'
import activenewsfeed from './assets/active-newsfeed.svg'
import chat from './assets/chat-icon.svg'
import activechat from './assets/active-chat.svg'
import profile from './assets/profile-icon.svg'
import activeprofile from './assets/active-profile.svg'
import { setActiveTab } from '../../store/navigationSlice'
import { useDispatch, useSelector } from 'react-redux'

function NavBar() {
  const activeTab = useSelector((state) => state.navigation.activeTab);
  const dispatch = useDispatch();

  const handleTabClick = (tab) => {
    dispatch(setActiveTab(tab));
  }

  // const [activeTab , setactiveTab ] = useState('findpet');

  // const handleIconClick = (iconName) => {
  //   setactiveTab (iconName);
  // }

  return (
    <>
      {/* MOBILE VIEW */}
      <div className='fixed top-20 z-10 w-full text-text bg-secondary items-center flex justify-between px-10 sm:px-14 md:px-28 pb-3 pt-2 -mt-1 shadow-md lg:hidden'>
        {/* FIND PET */}
        <div className={`py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md ${activeTab === 'FindPet' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleTabClick('FindPet')}>
          {activeTab  === 'FindPet' ? (
              <img src={activefindpet} alt="Paw Icon" />
            ) : (
              <img src={findpet} alt="Paw Icon" />
            )}
        </div>
        {/* NEWS FEED */}
        <div className={`py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md ${activeTab  === 'NewsFeed' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleTabClick('NewsFeed')}>
          {activeTab  === 'NewsFeed' ? (
              <img src={activenewsfeed} alt="Paw Icon" />
            ) : (
              <img src={newsfeed} alt="Paw Icon" />
            )}
        </div>
        {/* CHAT */}
        <div className={`py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md ${activeTab  === 'Chat' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleTabClick('Chat')}>
          {activeTab  === 'Chat' ? (
              <img src={activechat} alt="Paw Icon" />
            ) : (
              <img src={chat} alt="Paw Icon" />
            )}
        </div>
        {/* PROFILE */}
        <div className={`py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md ${activeTab  === 'Profile' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleTabClick('Profile')}>
          {activeTab  === 'Profile' ? ( 
              <img className='w-8' src={activeprofile} alt="Paw Icon" />
            ) : ( 
              <img className='w-8' src={profile} alt="Paw Icon" />
            )}
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className='hidden lg:block fixed top-24'>
        <div className='bg-secondary min-h-screen pt-7 flex flex-col items-center rounded-tr-lg gap-5 shadow-xl px-3 xl:w-56 text-text font-semibold'>
          {/* FIND PET */}
          <div className={`flex hover:bg-[#D9D9D9] duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 ${activeTab  === 'FindPet' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleTabClick('FindPet')}>
            {activeTab  === 'FindPet' ? (
              <div className='flex items-center'>
                <img className='pl-5 w-14' src={activefindpet} alt="" />
                <p className='text-base text-secondary font-semibold pl-5'>Find Pet</p>
              </div>
            ) : (
              <div className='flex items-center'>
                <img className='pl-5 w-14' src={findpet} alt="" />
                <p className='text-base font-semibold pl-5'>Find Pet</p>
              </div>
            )}
          </div>

          {/* NEWS FEED */}
          <div className={`flex hover:bg-[#D9D9D9] duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 ${activeTab  === 'NewsFeed' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleTabClick('NewsFeed')}>
            {activeTab  === 'NewsFeed' ? (
              <div className='flex items-center'>
                <img className='pl-6 w-13' src={activenewsfeed} alt="" />
                <p className='text-base text-secondary font-semibold pl-6'>News Feed</p>
              </div>
            ) : (
              <div className='flex items-center'>
                <img className='pl-6 w-13' src={newsfeed} alt="" />
                <p className='text-base font-semibold pl-6'>News Feed</p>
              </div>
            )}
          </div>

          {/* CHAT */}
          <div className={`flex hover:bg-[#D9D9D9] duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 ${activeTab  === 'Chat' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleTabClick('Chat')}>
            {activeTab  === 'Chat' ? (
              <div className='flex items-center'>
                <img className='pl-6 w-13' src={activechat} alt="" />
                <p className='text-base text-secondary font-semibold pl-6'>Chat</p>
              </div>
            ) : (
              <div className='flex items-center'>
                <img className='pl-6 w-13' src={chat} alt="" />
                <p className='text-base font-semibold pl-6'>Chat</p>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className={`flex hover:bg-[#D9D9D9] duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-44 xl:w-48 ${activeTab  === 'Profile' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleTabClick('Profile')}>
            {activeTab  === 'Profile' ? (
              <div className='flex items-center'>
                <img className='pl-5 w-14' src={activeprofile} alt="" />
                <p className='text-base text-secondary font-semibold pl-5'>Profile</p>
              </div>
            ) : (
              <div className='flex items-center'>
                <img className='pl-5 w-14' src={profile} alt="" />
                <p className='text-base text font-semibold pl-5'>Profile</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default NavBar