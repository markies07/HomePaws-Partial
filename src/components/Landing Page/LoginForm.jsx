import React, {useState} from 'react'
import close from './assets/close.svg'
import logo from './assets/white-logo.png'
import image from './assets/login-image.jpg'
import email from './assets/email.svg'
import password from './assets/password.svg'

function LoginForm({loginOpen, loginClose}) {
  return (
    <div 
    style={{
    right: loginOpen ? '0' : '-50rem',
    transition: 'right 0.5s ease-in-out',}}
    className='fixed top-0 right-0 bg-secondary z-40 w-full md:w-96 min-h-screen max-h-screen flex flex-col overflow-auto'>
        
        <div className='w-full relative flex flex-col py-6 sm:pt-8 sm:pb-6 items-center justify-center'>
            <img className='w-52' src={logo} alt="" />
            <button onClick={loginClose} className='absolute top-4 right-4 p-1 duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959]'>
                <img className='w-6 h-sm:w-7' src={close} alt="" />
            </button>
        </div>
        <div className='w-full flex justify-center h-52 sm:h-64'>
            <img className='object-cover sm:w-[80%] md:w-full w-full h-full' src={image} alt="" />
        </div>
        <div className='flex flex-col items-center'>
            <h1 className='text-3xl font-semibold text-text py-7'>Login your account</h1>
            <div className='w-full flex flex-col items-center px-10 sm:px-36 md:px-10 mt-2 text-text'>
                <div className='mb-2 w-full relative'>
                    <img className='absolute top-3 left-4 w-6' src={email} alt="" />
                    <input autoComplete='off' className='w-full md:mb-3 py-3 pr-3 pl-14 rounded-lg outline-none bg-[#D9D9D9]' type="text" placeholder='Enter Email' />
                </div>
                <div className='mb-3 w-full relative'>
                    <img className='absolute top-[9px] left-4 w-6 h-7' src={password} alt="" />
                    <input autoComplete='off' className='w-full md:mb-3 py-3 pr-3 pl-14 rounded-lg outline-none bg-[#D9D9D9]' type="password" placeholder='Enter Password' />
                </div>
                <button className='bg-primary hover:bg-primaryHover duration-150 font-semibold mb-5 text-secondary py-3 px-7 rounded-lg mt-5'>Login</button>
            </div>
        </div>
    </div>
  )
}

export default LoginForm