import React, { useContext, useEffect, useState } from 'react'
import back from './assets/back.svg'
import deleteMessage from './assets/delete.svg'
import kevin from './assets/kevin.png'
import image from './assets/image.svg'
import send from './assets/send.svg'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../General/AuthProvider'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'

function Conversation() {
    const navigate = useNavigate();
    const { userData } = useContext(AuthContext);
    const { userID } = useParams();
    const [messages, setMessages] = useState([]);

    const fetchMessages = (conversationID) => {
        const q = query(
            collection(db, 'conversations', conversationID, 'messages'),
            orderBy('timestamp', 'asc')
        );

        onSnapshot(q, (snapshot) => {
            const mess = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(mess);
        })
    }

    useEffect(() => {
        const fetchConvoMessages = async () => {
            try{
                const fetchedMessages = await fetchMessages(userID);
                setMessages(fetchedMessages);
            }
            catch(error){
                console.log("Error fetching messages: ", error);
            }
        } 
        if(userID){
            fetchConvoMessages();
        }
    }, [userID])


    return (
        <div className='w-full h-full flex flex-col font-poppins'>

            {/* CONVERSATION */}
            <div className='bg-[#E9E9E9] w-full h-full flex flex-col flex-grow sm:rounded-lg'>
                <div className='flex justify-center items-center relative px-5 py-4 border-b-[1px] border-text'>
                    <img onClick={() => navigate('/dashboard/chat')} className='absolute md:hidden left-4 border-2 border-transparent hover:border-text duration-150 cursor-pointer p-1 w-10' src={back} alt="" />
                    <p className='font-medium text-xl'>Jordan B. Sorino</p>
                    <img className='absolute right-5 cursor-pointer' src={deleteMessage} alt="" />
                </div>

                {/* MESSAGES */}
                <div className='p-4 flex flex-col overflow-y-auto max-h-[calc(100vh-301px)] lg:max-h-[calc(100vh-246px)] gap-3 flex-grow h-full'>

                    {/* SENDER */}
                    <div className='flex w-full justify-start'>
                        {/* PROFILE */}
                        <img className='w-10 h-10 self-end shrink-0 rounded-full bg-text mr-3' src={kevin} alt="" />
                        {/* MESSAGE */}
                        <div className='w-[60%]'>
                            <p className='bg-text w-fit py-2 px-3 rounded-2xl rounded-bl-none text-white'>HAHA habang buhay ako sayong mag hihintayyy </p>
                        </div>
                    </div>

                    {/* SENDER */}
                    <div className='flex w-full justify-start'>
                        {/* PROFILE */}
                        <img className='w-10 h-10 self-end shrink-0 rounded-full bg-text mr-3' src={kevin} alt="" />
                        {/* MESSAGE */}
                        <div className='w-[60%] flex justify-start'>
                            <p className='bg-text w-fit py-2 px-3 rounded-2xl rounded-bl-none text-white'>Ampogi mo Mark</p>
                        </div>
                    </div>

                    {/* RECIEVER */}
                    <div className='flex w-full justify-end'>
                        {/* MESSAGE */}
                        <div className='w-[60%] flex justify-end'>
                            <p className='bg-primary w-fit py-2 px-3 rounded-2xl rounded-br-none text-white'>Alam ko gago</p>
                        </div>
                        {/* PROFILE */}
                        <img className='w-10 h-10 self-end shrink-0 rounded-full bg-text ml-3' src="" alt="" />
                    </div>
                    
                </div>

                {/* ACTIONS */}
                <div className='flex px-4 py-4 border-t-[1px] border-text'>
                    <img className='w-10 overflow-visible p-[9px] bg-[#BCBCBC] hover:bg-[#adadad] cursor-pointer duration-150 rounded-full' src={image} alt="" />
                    <input className='w-full mx-4 rounded-full px-3 outline-none' placeholder='Aa' type="text" />
                    <img className='w-10 overflow-visible py-[9px] pl-[11px] pr-[7px] bg-[#BCBCBC] hover:bg-[#adadad] cursor-pointer duration-150 rounded-full' src={send} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Conversation