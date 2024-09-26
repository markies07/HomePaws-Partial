import React, { useContext, useEffect, useState } from 'react'
import write from './assets/write.svg'
import search from './assets/search.svg'
import darkPaw from './assets/dark-paw.png'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../General/AuthProvider'
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
import NewMessage from './NewMessage'

function MainMenu() {
    const { user } = useContext(AuthContext);
    const [chats, setChats] = useState([]);
    const [usersData, setUsersData] = useState({});
    const [lastFetchedChat, setLastFetchedChat] = useState(null);
    const location = useLocation();
    const isConvoOpen = location.pathname.includes("convo/")
    const [newMessage, setNewMessage] = useState(false);
    const [openUsers, setOpenUsers] = useState(false);
    const navigate = useNavigate();
    const CHATS_PER_PAGE = 10;

    useEffect(() => {
        fetchChats();
    }, [user.uid]);

    const fetchChats = async () => {
        let q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', user.uid),
            limit(CHATS_PER_PAGE)
        );

        if (lastFetchedChat) {
            q = query(q, startAfter(lastFetchedChat));
        }

        const snapshot = await getDocs(q);
        const fetchedChats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch the latest message for each chat
        const chatsWithLatestMessage = await Promise.all(fetchedChats.map(async chat => {
            const messagesRef = collection(db, 'chats', chat.id, `messages_${user.uid}`);
            const latestMessageQuery = query(messagesRef, orderBy('sentAt', 'desc'), limit(1));
            const latestMessageSnapshot = await getDocs(latestMessageQuery);
            
            const latestMessage = latestMessageSnapshot.docs[0]?.data() || null;
            return { ...chat, latestMessage };
        }));

        // Filter out duplicate chats (based on participants)
        const uniqueChats = chatsWithLatestMessage.reduce((acc, current) => {
            const x = acc.find(item => item.participants.every(p => current.participants.includes(p)));
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        setChats(prevChats => {
            const allChats = [...prevChats, ...uniqueChats];
            return allChats.filter((chat, index, self) =>
                index === self.findIndex((t) => t.id === chat.id)
            );
        });
        setLastFetchedChat(snapshot.docs[snapshot.docs.length - 1]);

        // Fetch user data for new participants
        const newParticipants = uniqueChats.flatMap(chat => chat.participants)
            .filter(uid => !usersData[uid] && uid !== user.uid);
        
        if (newParticipants.length > 0) {
            const newUsersData = await fetchUsersData(newParticipants);
            setUsersData(prevData => ({ ...prevData, ...newUsersData }));
        }
    };

    const fetchUsersData = async (userIds) => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', 'in', userIds));
        const usersSnapshot = await getDocs(q);
        
        const users = {};
        usersSnapshot.forEach(doc => {
            users[doc.data().uid] = doc.data();
        });
        return users;
    };

    const handleOpenNewMessage = () => {
        setOpenUsers(!openUsers);
    }

    return (
        <div className='font-poppins relative flex mt-3 lg:mt-4 bg-secondary sm:mx-auto lg:mx-0 flex-grow mb-3 w-full lg:p-4 text-text sm:w-[90%] md:w-[97%] lg:w-full sm:rounded-md lg:rounded-lg shadow-custom'>
            <div className='py-4 px-5 lg:p-0 w-full md:max-w-[21rem] lg:max-w-[19rem] xl:max-w-[20rem]'>
                <div className={openUsers ? 'hidden' : 'block'}>
                    <div className='flex justify-between'>
                        <h1 className='self-end text-3xl font-medium'>Chat</h1>
                        <img onClick={handleOpenNewMessage} className='p-2 bg-[#E1E1E1] rounded-full overflow-visible cursor-pointer hover:bg-[#cecece] duration-150' src={write} alt="" />
                    </div>
                    <div className='relative w-full rounded-full overflow-hidden mt-3 mb-5'>
                        <img className='absolute top-2 left-3' src={search} alt="" />
                        <input className='bg-[#E1E1E1] w-full pl-11 py-2 outline-none pr-3' type="text" placeholder='Search user'/>
                    </div>

                    {/* USERS */}
                    <div className='flex flex-col gap-3 max-h-[calc(100vh-320px)] lg:max-h-[calc(100vh-257px)] overflow-y-auto'>
                        {chats.map((chat) => {
                            const otherParticipantId = chat.participants.find(p => p !== user.uid);
                            const otherUser = usersData[otherParticipantId];
                            return (
                                <div key={chat.id} onClick={() => navigate(`convo/${chat.id}`)} className='bg-[#E9E9E9] relative w-full p-3 rounded-lg flex items-center hover:bg-[#d6d6d6] duration-150 cursor-pointer'>
                                    {otherUser ? (
                                        <>
                                            <img className='w-10 h-10 bg-text rounded-full' src={otherUser.profilePictureURL} alt="" />
                                            <p className='font-medium pl-3 leading-4 w-52'>{otherUser.fullName}</p>
                                        </>
                                    ):(
                                        <p>Loading</p>
                                    )}
                                    
                                    {/* UNREAD */}
                                    {/* <div className='absolute w-4 h-4 rounded-full bg-primary right-4'></div> */}
                                </div>
                            )
                        })}
                    </div>
                    
                </div>

                {/* NEW MESSAGE */}
                <div className={openUsers ? 'block' : 'hidden'}>
                    <NewMessage setNewMessage={setNewMessage} closeUI={handleOpenNewMessage} />
                </div>

            </div>

            {/* CONVO IN LG SCREEN */}
            <div className='bg-[#E9E9E9] md:block hidden w-full my-4 mr-4 lg:m-0 lg:ml-4 rounded-md lg:rounded-lg'>
                <div className='flex justify-center items-center h-full flex-col'>
                    {isConvoOpen ? (
                        <Outlet context={[setChats]} />
                    ):(
                        <>
                            <img className='w-40' src={darkPaw} alt="" />
                            <p className='font-semibold -mt-3'>Messages</p>
                        </>
                    )}
                </div>
            </div>

            {isConvoOpen && (
                <div className='md:hidden h-full w-full absolute top-0'>
                    <Outlet context={[setChats]} />
                </div>
            )}
        </div>
    )
}

export default MainMenu