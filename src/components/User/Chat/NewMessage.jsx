import React, { useEffect, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import search from './assets/search.svg'
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

function NewMessage() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(fetchedUsers);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(user => 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function startConversation(user) {
        // Navigate to conversation page (without creating chatID)
        navigate(`convo/${user.id}`);
    }

    async function sendMessage(text) {
        if (!text.trim()) return;
      
        // Check if there's an existing chatID
        if (!chatID) {
          // Create new chat document in 'chats' collection
          const chatRef = await addDoc(collection(db, 'chats'), {
            participants: [currentUser.uid, otherUser.uid],
            createdAt: serverTimestamp(),
          });
      
          // Set chatID in the URL and state
          setChatID(chatRef.id);
          navigate(`/chat/convo/${chatRef.id}`);
        }
      
        // Add the message to the 'messages' collection
        await addDoc(collection(db, 'messages'), {
          chatID: chatID,
          sender: currentUser.uid,
          text: text,
          read: false,
          sentAt: serverTimestamp(),
        });
      }
      


    return (
        <>
            <div className='flex justify-between'>
                <h1 className='self-end text-2xl font-medium'>New Message</h1>
                <img className='p-2 bg-[#E1E1E1] rounded-full overflow-visible cursor-pointer hover:bg-[#cecece] duration-150' src={close} alt="" />
            </div>
            <div className='relative w-full rounded-full overflow-hidden mt-3 mb-5'>
                <img className='absolute top-2 left-3' src={search} alt="" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='bg-[#E1E1E1] w-full pl-11 py-2 outline-none pr-3' type="text" placeholder='Enter user name'/>
            </div>

            {/* USERS */}
            <div className='flex flex-col gap-3 max-h-[calc(100vh-320px)] lg:max-h-[calc(100vh-257px)] overflow-y-auto'>
                {filteredUsers.map(user => (

                    <div key={user.id} onClick={() => startConversation(user)} className='bg-[#E9E9E9] relative w-full p-3 rounded-lg flex items-center hover:bg-[#d6d6d6] duration-150 cursor-pointer'>
                        <img className='w-10 h-10 bg-text rounded-full' src={user.profilePictureURL} alt="" />
                        <p className='font-medium pl-3 leading-4 w-52'>{user.fullName}</p>
                    </div>
                    
                ))}
            </div>
        </>
    )
}

export default NewMessage