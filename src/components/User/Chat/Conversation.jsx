import React, { useContext, useEffect, useRef, useState } from 'react'
import back from './assets/back.svg'
import deleteMessage from './assets/delete.svg'
import image from './assets/image.svg'
import send from './assets/send.svg'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { AuthContext } from '../../General/AuthProvider'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
import { notifyErrorOrange } from '../../General/CustomToast'
import { confirm } from '../../General/CustomAlert'

function Conversation() {
    const navigate = useNavigate();
    const [setChats] = useOutletContext();
    const { chatID } = useParams();
    const { user, userData } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [lastFetchedMessage, setLastFetchedMessage] = useState(null);
    const MESSAGES_PER_PAGE = 20;

    const fetchOtherUser = async () => {
        try {
            const chatRef = doc(db, 'chats', chatID);
            const chatDoc = await getDoc(chatRef);

            if (chatDoc.exists()) {
                const chatData = chatDoc.data();
                const otherUserID = chatData.participants.find(uid => uid !== user.uid);

                if (otherUserID) {
                    const userRef = doc(db, 'users', otherUserID);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setOtherUser({ id: userDoc.id, ...userData });
                    } else {
                        console.error('Other user document not found');
                        setError('Other user not found');
                    }
                } else {
                    console.error('Other user ID not found in chat participants');
                    setError('Other user not found in chat');
                }
            } else {
                console.error('Chat document not found');
                setError('Chat not found');
            }
        } catch (error) {
            console.error('Error fetching other user:', error);
            setError('Failed to fetch other user');
        }
    };

    useEffect(() => {
        if (!chatID) return;

        const fetchOtherUser = async () => {
            const chatRef = doc(db, 'chats', chatID);
            const chatDoc = await getDoc(chatRef);

            if (chatDoc.exists()) {
                const chatData = chatDoc.data();
                const otherUserID = chatData.participants.find(uid => uid !== user.uid);

                if (otherUserID) {
                    const otherUserRef = doc(db, 'users', otherUserID);
                    const otherUserDoc = await getDoc(otherUserRef);

                    if (otherUserDoc.exists()) {
                        setOtherUser(otherUserDoc.data());
                    }
                }
            }
        };

        fetchOtherUser();

        const q = query(
            collection(db, 'chats', chatID, `messages_${user.uid}`),
            orderBy('sentAt')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [chatID]);

    
    // SENDING MESSAGES
    const handleSendMessage = async (e) => {
        e.preventDefault();

        const chatRef = doc(db, 'chats', chatID);
        const chatDoc = await getDoc(chatRef);

        const chatData = chatDoc.data();
        const otherUserID = chatData.participants.find(uid => uid !== user.uid);

        try {
            const message = {
                sender: user.uid,
                text: newMessage,
                sentAt: serverTimestamp(),
                read: false,
            }

            const messagesRefUser1 = collection(db, 'chats', chatID, `messages_${user.uid}`);
            const messagesRefUser2 = collection(db, 'chats', chatID, `messages_${otherUserID}`);

            await addDoc(messagesRefUser1, message);
            await addDoc(messagesRefUser2, message);

            setNewMessage('');
        }
        catch (error){
            console.error('Error sending message: ', error);
            notifyErrorOrange('Error sending message. Please try again.');
        }
    }

    // CANCELING NEW CONVERSATION
    const handleCancelChat = async () => {
        const messageRef = collection(db, 'chats', chatID, `messages_${user.uid}`);

        const messagesSnapshot = await getDocs(messageRef);

        if(messagesSnapshot.empty){
            await deleteDoc(doc(db, 'chats', chatID));
            navigate('/dashboard/chat')
        }

        navigate('/dashboard/chat')
    }


    // DELETING CONVERSATION
    const deleteConversation = async () => {
        confirm(`Deleting Conversation`, `Are you sure you want to delete this conversation?`).then(async (result) => {
            if(result.isConfirmed){
                try {
                    const messagesRef = collection(db, 'chats', chatID, `messages_${user.uid}`);
    
                    const messagesSnapshot = await getDocs(messagesRef);
            
                    // Delete all messages of the current user
                    messagesSnapshot.forEach(async (doc) => {
                        await deleteDoc(doc.ref);
                    });
    
                    // Trigger an immediate update in MainMenu by removing the chat from the state
                    setChats(prevChats => prevChats.filter(chat => chat.id !== chatID));
    
                    // Navigate back to chat list or dashboard
                    navigate('/dashboard/chat');
                } catch (error) {
                    notifyErrorOrange('There was an issue deleting this conversation. Please try again');
                    console.error('Error deleting conversation: ', error);
                }
            }
        });
    };
    

    // SCROLL DOWN TO THE LATEST MESSAGE
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className='w-full h-full flex flex-col font-poppins'>

            {/* CONVERSATION */}
            <div className='bg-[#E9E9E9] w-full h-full flex flex-col flex-grow sm:rounded-lg'>
                <div className='flex justify-center items-center relative px-5 py-4 border-b-[1px] border-text'>
                    <img onClick={handleCancelChat} className='absolute left-4 border-2 border-transparent hover:border-text duration-150 cursor-pointer p-1 w-10' src={back} alt="" />
                    <p className='font-medium text-xl'>{otherUser.fullName}</p>
                    <img onClick={deleteConversation} className='absolute right-5 cursor-pointer' src={deleteMessage} alt="" />
                </div>

                {/* MESSAGES */}
                <div className='p-4 flex flex-col overflow-y-auto max-h-[calc(100vh-301px)] md:max-h-[calc(100vh-335px)] lg:max-h-[calc(100vh-274px)] gap-3 flex-grow h-full'>

                    {messages.map((message) => (
                        message.sender === user.uid ? (
                            // RECIEVER
                            <div key={message.id} className='flex w-full justify-end'>
                                {/* MESSAGE */}
                                <div className='w-[60%] flex justify-end'>
                                    <p className='bg-primary w-fit py-2 px-3 rounded-2xl rounded-br-none text-white'>{message.text}</p>
                                </div>
                                {/* PROFILE */}
                                <img className='w-10 h-10 self-end shrink-0 rounded-full bg-text ml-3' src={userData.profilePictureURL} alt="" />
                            </div>

                        ):(
                            // SENDER
                            <div key={message.id} className='flex w-full justify-start'>
                                {/* PROFILE */}
                                <img className='w-10 h-10 self-end shrink-0 rounded-full bg-text mr-3' src={otherUser.profilePictureURL} alt="" />
                                {/* MESSAGE */}
                                <div className='w-[60%]'>
                                    <p className='bg-text w-fit py-2 px-3 rounded-2xl rounded-bl-none text-white'>{message.text}</p>
                                </div>
                            </div>
                        )
                        
                    ))}

                    <div ref={messagesEndRef} />

                </div>

                {/* ACTIONS */}
                <form onSubmit={handleSendMessage} className='flex px-4 py-4 border-t-[1px] border-text'>
                    <img className='w-10 overflow-visible p-[9px] bg-[#BCBCBC] hover:bg-[#adadad] cursor-pointer duration-150 rounded-full' src={image} alt="" />
                    <input required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className='w-full mx-4 rounded-full px-3 outline-none' placeholder='Aa' type="text" />
                    <button type='submit' className='w-10 shrink-0 h-10 flex justify-center items-center overflow-visible bg-[#BCBCBC] hover:bg-[#adadad] cursor-pointer duration-150 rounded-full'>
                        <img className='w-6 h-6 ml-1' src={send} alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Conversation