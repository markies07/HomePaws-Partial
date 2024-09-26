@ -1,19 +1,20 @@
import React, { useContext, useEffect, useRef, useState } from 'react'
import back from './assets/back.svg'
import deleteMessage from './assets/delete.svg'
import kevin from './assets/kevin.png'
import image from './assets/image.svg'
import send from './assets/send.svg'
import { useNavigate, useParams } from 'react-router-dom'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { AuthContext } from '../../General/AuthProvider'
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
import { notifyErrorOrange } from '../../General/CustomToast'
import close from '../../../assets/icons/close-dark.svg'
import { confirm } from '../../General/CustomAlert'

function Conversation() {
    const navigate = useNavigate();

    const { userData } = useContext(AuthContext);
    const [setChats] = useOutletContext();
    const { user, userData } = useContext(AuthContext);
    const { chatID } = useParams();
    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState([]); 
@ -29,7 +30,7 @@ function Conversation() {

            if (chatDoc.exists()) {
                const chatData = chatDoc.data();
                const otherUserID = chatData.participants.find(uid => uid !== userData.uid);
                const otherUserID = chatData.participants.find(uid => uid !== user.uid);

                if (otherUserID) {
                    const otherUserRef = doc(db, 'users', otherUserID);
@ -45,7 +46,7 @@ function Conversation() {
        fetchOtherUser();

        const q = query(
            collection(db, 'chats', chatID, 'messages'),
            collection(db, 'chats', chatID, `messages_${user.uid}`),
            orderBy('sentAt')
        );

@ -55,22 +56,32 @@ function Conversation() {
        });

        return () => unsubscribe();
    }, [chatID, userData.uid]);
    }, [chatID]);

    
    // SENDING MESSAGES
    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {
            const messageRef = collection(doc(db, 'chats', chatID), 'messages');
        const chatRef = doc(db, 'chats', chatID);
        const chatDoc = await getDoc(chatRef);

        const chatData = chatDoc.data();
        const otherUserID = chatData.participants.find(uid => uid !== user.uid);

            await addDoc(messageRef, {
                sender: userData.uid,
        try {
            const message = {
                sender: user.uid,
                text: newMessage,
                sentAt: serverTimestamp(),
                read: false,
            });
            }

            const messagesRefUser1 = collection(db, 'chats', chatID, `messages_${user.uid}`);
            const messagesRefUser2 = collection(db, 'chats', chatID, `messages_${otherUserID}`);

            await addDoc(messagesRefUser1, message);
            await addDoc(messagesRefUser2, message);

            setNewMessage('');
        }
@ -80,6 +91,49 @@ function Conversation() {
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

@ -91,23 +145,22 @@ function Conversation() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    return (
        <div className='w-full h-full flex flex-col font-poppins'>

            {/* CONVERSATION */}
            <div className='bg-[#E9E9E9] w-full h-full flex flex-col flex-grow sm:rounded-lg'>
                <div className='flex justify-center items-center relative px-5 py-4 border-b-[1px] border-text'>
                    <img onClick={() => navigate('/dashboard/chat')} className='absolute md:hidden left-4 border-2 border-transparent hover:border-text duration-150 cursor-pointer p-1 w-10' src={back} alt="" />
                    <img onClick={handleCancelChat} className='absolute left-4 border-2 border-transparent hover:border-text duration-150 cursor-pointer p-1 w-10' src={back} alt="" />
                    <p className='font-medium text-xl'>{otherUser.fullName}</p>
                    <img className='absolute right-5 cursor-pointer' src={deleteMessage} alt="" />
                    <img onClick={deleteConversation} className='absolute right-5 cursor-pointer' src={deleteMessage} alt="" />
                </div>

                {/* MESSAGES */}
                <div className='p-4 flex flex-col overflow-y-auto max-h-[calc(100vh-301px)] md:max-h-[calc(100vh-335px)] lg:max-h-[calc(100vh-274px)] gap-3 flex-grow h-full'>

                    {messages.map((message) => (
                        message.sender === userData.uid ? (
                        message.sender === user.uid ? (
                            // RECIEVER
                            <div key={message.id} className='flex w-full justify-end'>
                                {/* MESSAGE */}
