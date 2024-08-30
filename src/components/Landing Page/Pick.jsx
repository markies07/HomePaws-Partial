import React from 'react'
import close from './assets/close.svg'

function Pick({pickOpen, pickClose}) {
  return (
    <div 
    style={{
        display: pickOpen ? 'block' : 'none',
        }}
    className='fixed z-40 right-0 top-0 bg-secondary min-h-screen max-h-screen overflow-auto w-full flex flex-col text-text font-poppins'>
        <div onClick={pickClose} className='absolute top-4 right-4 border-2 border-secondary hover:border-primary cursor-pointer p-1 duration-150'>
            <img src={close} alt="" />
        </div>
    </div>
  )
}

export default Pick