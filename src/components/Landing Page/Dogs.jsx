import React from 'react'
import close from './assets/close.svg'
import AnimalCard from '../General/AnimalCard'

function Dogs({isOpen, isClose, onLoginClick}) {
  return (
    <div 
    style={{
        display: isOpen ? 'block' : 'none',
        }}
    className='fixed z-10 right-0 top-0 px-5 py-5 sm:px-10 sm:py-10 bg-secondary min-h-screen max-h-screen overflow-auto w-full flex flex-col text-text font-poppins'>
        <div onClick={isClose} className='absolute top-4 right-4 border-2 border-secondary hover:border-primary cursor-pointer p-1 duration-150'>
            <img src={close} alt="" />
        </div>
        <h1 className='text-3xl font-medium mt-10 sm:mt-0 text-center sm:text-start'>Dogs for adoption</h1>
        <div className='mt-7 flex flex-wrap w-full items-center justify-center gap-5 sm:justify-start'>
          <AnimalCard onLoginClick={onLoginClick} />
        </div>
    </div>
  )
}

export default Dogs