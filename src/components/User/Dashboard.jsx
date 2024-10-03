import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Header from './Header'
import Question from './Question';
import LoadingScreen from '../General/LoadingScreen';
import { AuthContext } from '../General/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

function Dashboard() {
    const { user } = useContext(AuthContext);
    const [petOwnerTypeExists, setPetOwnerTypeExists] = useState(false);

    if (!user) {
        return <Navigate to="/" />; 
    }
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogoutClick = async () => {
      setIsLogoutOpen(!isLogoutOpen);
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try{
                setIsLoading(true);
                if(user){
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if(userDoc.exists()){
                        const userData = userDoc.data();

                        if(userData.petOwnerType){
                            setPetOwnerTypeExists(true);
                        }
                    }
                }
            }
            catch (error){
                console.error('Error fetching user data: ', error);
            }
            finally{
                setIsLoading(false);
            }
            
        }

        fetchUserData()
    }, [])

    const handlePetOwnerType = async (type) => {
        try{
            const userRef = doc(db, 'users', user.uid);

            await updateDoc(userRef, {
                petOwnerType: type
            });
            window.location.reload();

        }
        catch (error) {
            console.error(error);
        }
    }


    return (
        <div className='w-full min-h-screen bg-[#A1E4E4] select-none font-poppins text-text'>
            {isLoading && <LoadingScreen />}
            <Header openLogout={handleLogoutClick} isOpen={isLogoutOpen} loading={setIsLoading}/>
            {petOwnerTypeExists ? <Outlet /> : <Question petOwnerType={handlePetOwnerType} />}
            <NavBar />
        </div>

    )
}

export default Dashboard