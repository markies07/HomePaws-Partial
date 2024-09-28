import React, { useContext, useEffect, useState } from 'react'
import markAsRead from './assets/read.svg'
import { AuthContext } from '../../General/AuthProvider'
import { collection, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import like from './assets/like.svg'
import comment from './assets/comment.svg'
import application from './assets/application.svg'

function Notification() {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [profile, setProfile] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try{
                const notificationsRef = query(
                    collection(db, 'notifications'),
                    where('userId', '==', user.uid),
                    orderBy('timestamp', 'desc')
                );
    
                const snapshot = await getDocs(notificationsRef);
                const userNotifications = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setNotifications(userNotifications);
            }
            catch(error){
                console.log('Error: ', error);
            }

        }
        fetchNotifications();
    }, [user.uid]);

    const getTimeDifference = (timestamp) => {
        const now = new Date();
        const timeDiff = Math.abs(now - timestamp.toDate()); // Convert Firestore timestamp to JS Date
      
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
      
        if (seconds < 10) {
          return 'Just now';
        } else if (years > 0) {
          return years === 1 ? '1 year ago' : `${years}y ago`;
        } else if (months > 0) {
          return months === 1 ? '1 month ago' : `${months}m ago`;
        } else if (days > 0) {
          return days === 1 ? '1 day ago' : `${days}d ago`;
        } else if (hours > 0) {
          return hours === 1 ? '1 hour ago' : `${hours}h ago`;
        } else if (minutes > 0) {
          return minutes === 1 ? '1 minute ago' : `${minutes}m ago`;
        } else {
          return `${seconds}s ago`;
        }
      };

    return (
        <div className='pt-36 relative lg:pt-20 lg:pl-48 xl:pl-56 lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            <div className='flex mt-3 lg:mt-4 bg-secondary sm:mx-auto lg:mx-0 flex-grow mb-3 w-full text-text sm:w-[97%] lg:w-full sm:rounded-md lg:rounded-lg shadow-custom'>
                <div className='p-5 md:px-7 w-full'>
                    <div className='flex justify-between'>
                        <h1 className='text-2xl font-semibold'>Notification</h1>
                        <img className='w-8 p-1 rounded-full hover:bg-[#d8d8d8] cursor-pointer duration-150' src={markAsRead} alt="" />
                    </div>
                    <div className='flex gap-1 my-3'>
                        <p className='cursor-pointer text-sm font-medium text-white bg-primary py-1 px-3 rounded-md'>All</p>
                        <p className='cursor-pointer text-sm font-medium py-1 px-3'>Unread</p>
                    </div>

                    {/* NOTIFICATION */}
                    <div className='mt-4 flex flex-col gap-3'>
                        {notifications.map((notification) => (
                            <div key={notification.id} className='bg-[#E9E9E9] relative items-center flex hover:bg-[#d3d3d3] duration-150 cursor-pointer w-full p-3 rounded-lg'>
                                <div className='relative w-12 h-12 shrink-0'>
                                    <img className='w-full h-full object-cover rounded-full' src={notification.image} alt="" />
                                    <img className='w-6 h-6 absolute rounded-full bottom-0 -right-1' src={notification.type == 'like' ? like : notification.type == 'comment' ? comment : application} alt="" />
                                </div>
                                <div className='pl-3 pr-7 sm:pl-4 flex flex-col justify-center'>
                                    <p className='font-semibold text-sm sm:text-base leading-4'>{notification.senderName} <span className='font-normal'>{notification.content}</span></p>
                                    <p className='text-xs sm:text-[13px] text-[#8a8a8a] mt-1 sm:mt-0'>{getTimeDifference(notification.timestamp)}</p>
                                </div>
                                <div style={{display: !notification.isRead ? 'block' : 'none'}} className='absolute w-4 h-4 right-3 sm:right-5 top-[27px] bg-primary rounded-full' />
                            </div>
                        ))}

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Notification