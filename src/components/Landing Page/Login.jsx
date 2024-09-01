import React, {useState} from 'react'
import close from './assets/close.svg'
import logo from './assets/white-logo.png'
import image from './assets/login-pic.jpg'
import google from './assets/google.svg'
import facebook from './assets/facebook.svg'
import { useNavigate } from 'react-router-dom'
import { notifyErrorOrange, notifySuccessOrange } from '../General/CustomToast'
import { auth, provider, signInWithPopup, facebookProvider } from '../../firebase/firebase'


function Login({ isOpen, onClose, handleCreateClick, handleLogin }) {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('User Info: ', user);
            notifySuccessOrange('Login Successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        }
        catch (error) {
            console.error('Error during Google login:', error);
            notifyErrorOrange("Failed to log in with Google.")
        }
    }

    const handleFacebookLogin = async () => {
        try{
            const result = await signInWithPopup(auth, facebookProvider);
            const user = result.user;
            console.log('User Info: ', user);
            notifySuccessOrange('Login Successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        }
        catch{
            console.error("Facebook login error");
            notifyErrorOrange("Failed to log in with Facebook.")
        }
        
    }
    

    return (
        <div style={{
                right: isOpen ? '0' : '-50rem',
                transition: 'right 0.5s ease-in-out',
                }}
        className='fixed top-0 bg-secondary z-30 w-full md:w-96 min-h-screen max-h-screen flex flex-col overflow-auto'>
        
            <div className='w-full relative flex flex-col py-6 sm:pt-8 sm:pb-6 items-center justify-center'>
                <img className='w-52' src={logo} alt="" />
                <button onClick={onClose} className='absolute top-4 right-4 p-1 duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959]'>
                    <img className='w-6 h-sm:w-7' src={close} alt="" />
                </button>
            </div>
            <div className='w-full h-52 h-sm:h-64'>
                <img className='object-cover w-full h-full' src={image} alt="" />
            </div>
            <div className='flex flex-col items-center h-full'>
                <div className='w-[80%] py-16'>
                    <p className='text-4xl text-text font-semibold'>Login to <br /> start adopting.</p>
                </div>
                <div className='w-[80%] flex gap-2 h-full items-end'>
                    <button onClick={handleCreateClick} className='w-full py-3 h-sm:py-4 font-medium rounded-lg border-2 hover:bg-[#df4545] hover:border-[#df4545] duration-150 border-primary bg-primary text-secondary'>Create Account</button>
                    <button onClick={handleLogin} className='w-full py-3 h-sm:py-4 font-medium rounded-lg border-2 hover:bg-[#ffdddd] duration-150 border-primary text-primary'>Log in</button>
                </div>
                <div className='w-[80%] my-5'>
                    <div className='h-[1.3px] w-full relative bg-[#9e9e9e]'>
                        <div className='absolute -top-3 w-full text-center'>
                        <p className='text-sm bg-secondary text-[#9e9e9e] font-medium inline-block px-3'>or continue with</p> 
                        </div>
                    </div>
                </div>
                <div className='w-[80%] pb-10 flex flex-col gap-2'>
                    <button onClick={handleGoogleLogin} className='w-full relative py-2 h-sm:py-3 font-medium rounded-lg border-2 border-[#179C52] text-secondary hover:bg-[#138847] hover:border-[#138847] bg-[#179C52] duration-150'>Log in with Google
                        <img className='absolute top-[7px] h-sm:top-[11px] left-[14px] w-[25px]' src={google} alt="" />
                    </button>
                    <button onClick={handleFacebookLogin} className='w-full relative py-2 h-sm:py-3 font-medium rounded-lg border-2 border-[#3B5998] bg-[#3B5998] text-secondary hover:border-[#314b85] hover:bg-[#314b85]  duration-150'>Log in with Facebook
                        <img className='absolute top-[6px] h-sm:top-[10px] left-3 w-7' src={facebook} alt="" />
                    </button>
                </div>
            </div>
        </div>
    
    )
}

export default Login