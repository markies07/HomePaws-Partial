import React, { useState } from 'react';
import logo from '../../assets/images/orange-logo.svg'
import close from './assets/close-white.svg'
import picture from './assets/profile-pic.svg'
import pet from './assets/pet-image.png'
import { createUserWithEmailAndPassword, auth } from '../../firebase/firebase'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { notifyErrorWhite, notifySuccessWhite } from '../General/CustomToast'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function CreateAccount({ createOpen, createClose }) {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    const db = getFirestore();

    const resetForm = () => {
        setFullName('');
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setProfilePicture(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        console.log("Creating account...");
        if(password !== confirmPassword){
            notifyErrorWhite("Password don't match!");
            return;
        }

        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let profilePictureURL = '';
            if(profilePicture) {
                const storage = getStorage();
                const storageRef = ref(storage, `profilePictures/${user.uid}`);
                await uploadBytes(storageRef, profilePicture);
                profilePictureURL = await getDownloadURL(storageRef);
            }

            await setDoc(doc(db, 'users', user.uid), {
                fullName,
                phoneNumber,
                email,
                profilePictureURL,
                createdAt: new Date(),
            });

            notifySuccessWhite("Account created successfully!");
            resetForm();
        }
        catch(error){
            console.error('Error creating account: ', error);
            notifyErrorWhite("This email already exists!");
        }
    }

    return (
        <div 
        style={{
            left: createOpen ? '0' : '-200rem',
            transition: 'left 0.7s ease-in-out',
            }}
        className='fixed z-40 top-0 bg-primary min-h-screen max-h-screen overflow-auto w-full flex flex-col text-text font-poppins'>
            <div className='w-full relative flex shrink-0 h-28 justify-center md:justify-start   px-7'>
                <img draggable='false' className='w-32' src={logo} alt="" />
                <div onClick={createClose} className='absolute top-4 right-4 border-2 border-primary hover:border-secondary cursor-pointer p-1 duration-150'>
                    <img src={close} alt="" />
                </div>
            </div> 
            <div className='bg-secondary mb-10 h-full shrink-0 overflow-hidden mx-auto w-[95%] sm:w-[80%] md:w-[45rem] flex rounded-3xl shadow-[1px_1px_15px_2px_rgb(0,0,0,.13)]'>
                <div className='w-[40%] h-auto hidden md:block'>
                    <img className='w-full -ml-1 h-full object-cover shadow-[1px_1px_15px_2px_rgb(0,0,0,.12)]' src={pet} alt="" />
                </div>
                <div className='flex flex-col py-5 w-full md:w-[60%] justify-center items-center'>
                    <h1 className='text-3xl font-semibold'>Create Account</h1>
                    <div className='flex flex-col items-center mt-3'>
                        <img draggable='false' className='w-20 rounded-full' src={profilePicture ? URL.createObjectURL(profilePicture) : picture} alt="" />
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            style={{display: 'none'}} 
                            id="profile-picture-input"
                        />
                        <button type='button' onClick={() => document.getElementById('profile-picture-input').click()} className='bg-[#00ACAC] cursor-pointer hover:bg-[#0ec0c0] duration-150 text-secondary font-medium text-sm py-1 px-2 rounded-lg mt-3'>Profile Picture</button>
                    </div>
                    <form onSubmit={handleCreateAccount} className='w-full px-10 sm:px-20 md:px-10 mt-2'>
                        <p className='font-semibold'>Full Name</p>
                        <input onChange={(e) => setFullName(e.target.value)} required value={fullName} autoComplete='off' className='w-full mb-4 md:mb-3 py-2 px-3 rounded-lg outline-none bg-[#D9D9D9]' type="text" />
                        <p className='font-semibold'>Phone Number</p>
                        <input onChange={(e) => setPhoneNumber(e.target.value)} required value={phoneNumber} autoComplete='off' className='w-full mb-4 md:mb-3 py-2 px-3 rounded-lg outline-none bg-[#D9D9D9]' type="text" />
                        <p className='font-semibold'>Email Address</p>
                        <input onChange={(e) => setEmail(e.target.value)} required value={email} autoComplete='off' className='w-full mb-4 md:mb-3 py-2 px-3 rounded-lg outline-none bg-[#D9D9D9]' type="email" />
                        <p className='font-semibold'>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} required value={password} autoComplete='off' className='w-full mb-4 md:mb-3 py-2 px-3 rounded-lg outline-none bg-[#D9D9D9]' type="password" />
                        <p className='font-semibold'>Confirm Password</p>
                        <input onChange={(e) => setConfirmPassword(e.target.value)} required value={confirmPassword} autoComplete='off' className='w-full mb-4 md:mb-3 py-2 px-3 rounded-lg outline-none bg-[#D9D9D9]' type="password" />
                        <div className='mt-2 mb-2 flex justify-center'>
                            <button type="submit" className='bg-primary hover:bg-primaryHover duration-150 font-semibold text-secondary py-3 px-7 rounded-lg'>Create Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount