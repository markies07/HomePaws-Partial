import React, { useContext, useEffect, useState } from 'react'
import write from './assets/write.svg'
import search from './assets/search.svg'
import darkPaw from './assets/dark-paw.png'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../General/AuthProvider';
import { collection, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import UserDisplay from './UserDisplay'

function MainMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const isConvoOpen = location.pathname.includes("convo/")

    const { userData } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);

    const fetchConversations = () => {
        const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userData.uid)
        );

        onSnapshot(q, (snapshot) => {
        const convo = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setConversations(convo);
        })
    }

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchUserData = async (userID) => {
        const userDoc = await getDoc(doc(db, 'users', userID));
        return userDoc.exists() ? userDoc.data() : null;
    };


    console.log(conversations);

    return (
        <div className='font-poppins relative flex mt-3 lg:mt-4 bg-secondary sm:mx-auto lg:mx-0 h-full flex-grow mb-3 w-full lg:p-4 text-text sm:w-[90%] md:w-[97%] lg:w-full sm:rounded-md lg:rounded-lg shadow-custom'>
            <div className='py-4 px-5 lg:p-0 w-full md:max-w-[21rem] lg:max-w-[19rem] xl:max-w-[20rem]'>
                <div className='flex justify-between'>
                    <h1 className='self-end text-3xl font-medium'>Chat</h1>
                    <img className='p-2 bg-[#E1E1E1] rounded-full overflow-visible cursor-pointer hover:bg-[#cecece] duration-150' src={write} alt="" />
                </div>
                <div className='relative w-full rounded-full overflow-hidden mt-3 mb-5'>
                    <img className='absolute top-2 left-3' src={search} alt="" />
                    <input className='bg-[#E1E1E1] w-full pl-11 py-2 outline-none pr-3' type="text" placeholder='Search user'/>
                </div>

                {/* USERS */}
                <div className='flex flex-col gap-3'>
                    {conversations.map((convo) => (
                        <div key={convo.id} onClick={() => navigate(`convo/${convo.id}`)} className='bg-[#E9E9E9] relative w-full p-3 rounded-lg flex items-center hover:bg-[#d6d6d6] duration-150 cursor-pointer'>
                            <UserDisplay participants={convo.participants} />
                            {/* UNREAD */}
                            {/* <div className='absolute w-4 h-4 rounded-full bg-primary right-4'></div> */}
                        </div>
                    ))}
                </div>
            </div>

            {/* CONVO IN LG SCREEN */}
            <div className='bg-[#E9E9E9] md:block hidden w-full my-4 mr-4 lg:m-0 lg:ml-4 rounded-md lg:rounded-lg'>
                <div className='flex justify-center items-center h-full flex-col'>
                    {isConvoOpen ? (
                        <Outlet />
                    ) : (
                        <>
                            <img className='w-40' src={darkPaw} alt="" />
                            <p className='font-semibold -mt-3'>Messages</p>
                        </>
                    )}
                </div>
            </div>

            {isConvoOpen && (
                <div className='md:hidden h-full w-full absolute top-0'>
                    <Outlet />
                </div>
            )}
        </div>
    )
}

export default MainMenu