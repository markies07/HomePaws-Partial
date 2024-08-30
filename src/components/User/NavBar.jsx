import React, { useState } from 'react'
import findpet from './assets/findpet-icon.svg'
import activefindpet from './assets/active-findpet.svg'
import newsfeed from './assets/newsfeed-icon.svg'
import activenewsfeed from './assets/active-newsfeed.svg'
import chat from './assets/chat-icon.svg'
import activechat from './assets/active-chat.svg'
import profile from './assets/profile-icon.svg'
import activeprofile from './assets/active-profile.svg'

function NavBar() {

  const [activeIcon, setActiveIcon] = useState('findpet');

  const handleIconClick = (iconName) => {
    setActiveIcon(iconName);
  }

  return (
    <>
      {/* MOBILE VIEW */}
      <div className='fixed top-20 w-full bg-secondary items-center flex justify-between px-10 sm:px-14 md:px-28 pb-3 pt-2 -mt-1 shadow-md lg:hidden'>
        {/* FIND PET */}
        <div className={`py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md ${activeIcon === 'findpet' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleIconClick('findpet')}>
          {activeIcon === 'findpet' ? (
              <img src={activefindpet} alt="Paw Icon" />
            ) : (
              <img src={findpet} alt="Paw Icon" />
            )}
        </div>
        {/* NEWS FEED */}
        <div className={`py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md ${activeIcon === 'newsfeed' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleIconClick('newsfeed')}>
          {activeIcon === 'newsfeed' ? (
              <img src={activenewsfeed} alt="Paw Icon" />
            ) : (
              <img src={newsfeed} alt="Paw Icon" />
            )}
        </div>
        {/* CHAT */}
        <div className={`py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md ${activeIcon === 'chat' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleIconClick('chat')}>
          {activeIcon === 'chat' ? (
              <img src={activechat} alt="Paw Icon" />
            ) : (
              <img src={chat} alt="Paw Icon" />
            )}
        </div>
        {/* PROFILE */}
        <div className={`py-2 hover:bg-[#D9D9D9] cursor-pointer duration-150 px-3 rounded-md ${activeIcon === 'profile' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleIconClick('profile')}>
          {activeIcon === 'profile' ? ( 
              <img className='w-8' src={activeprofile} alt="Paw Icon" />
            ) : ( 
              <img className='w-8' src={profile} alt="Paw Icon" />
            )}
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className='hidden lg:block fixed top-24'>
        <div className='bg-secondary min-h-screen pt-7 flex flex-col items-center rounded-tr-lg gap-5 shadow-xl w-56 text-text font-semibold'>
          {/* FIND PET */}
          <div className={`flex hover:bg-[#D9D9D9] duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 ${activeIcon === 'findpet' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleIconClick('findpet')}>
            {activeIcon === 'findpet' ? (
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
          <div className={`flex hover:bg-[#D9D9D9] duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 ${activeIcon === 'newsfeed' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleIconClick('newsfeed')}>
            {activeIcon === 'newsfeed' ? (
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
          <div className={`flex hover:bg-[#D9D9D9] duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 ${activeIcon === 'chat' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleIconClick('chat')}>
            {activeIcon === 'chat' ? (
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
          <div className={`flex hover:bg-[#D9D9D9] duration-150 cursor-pointer -ml-1 h-14 rounded-lg w-48 ${activeIcon === 'profile' ? 'bg-primary hover:bg-primary' : ''}`} onClick={() => handleIconClick('profile')}>
            {activeIcon === 'profile' ? (
              <div className='flex items-center'>
                <img className='pl-5 w-14' src={activeprofile} alt="" />
                <p className='text-base text-secondary font-semibold pl-6'>Profile</p>
              </div>
            ) : (
              <div className='flex items-center'>
                <img className='pl-5 w-14' src={profile} alt="" />
                <p className='text-base font-semibold pl-6'>Profile</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default NavBar