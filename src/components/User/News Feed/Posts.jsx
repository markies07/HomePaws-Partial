import React, { useEffect, useState } from 'react'
import unlike from './assets/unlike.svg'
import like from './assets/like.svg'
import comment from './assets/comment.svg'
import message from './assets/message.svg'
import { useUserPosts } from '../../General/UserPostsContext'


function Posts() {
    const { posts, loading } = useUserPosts();

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
          return years === 1 ? '1 year ago' : `${years} years ago`;
        } else if (months > 0) {
          return months === 1 ? '1 month ago' : `${months} months ago`;
        } else if (days > 0) {
          return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (hours > 0) {
          return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (minutes > 0) {
          return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else {
          return `${seconds} seconds ago`;
        }
      };

    return (
        <>
            {posts.length === 0 ? (
                <div className='py-3 text-center bg-secondary rounded-md shadow-custom font-medium'>No posts available</div>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className='bg-secondary w-full sm:rounded-lg shadow-custom py-4 px-5 md:px-7'>
                        {/* USER INFORMATION */}
                        <div className='flex w-full'>
                            <img src={post.userProfileImage} className='w-10 h-10 bg-[#D9D9D9] rounded-full' />
                            <div className='ml-2'>
                                <p className='font-medium'>{post.userName} <span className='text-sm font-normal ml-1 text-white rounded-full px-3' style={{backgroundColor: post.typeOfPost === 'story' ? '#A87CCD' : post.typeOfPost === 'missing' ? '#ED5050' : '#85B728'}}>{post.typeOfPost}</span></p>
                                <p className='-mt-[3px] text-xs'>{getTimeDifference(post.createdAt)}</p>
                            </div>
                        </div>

                        {/* CAPTION */}
                        <div className='mt-2'>
                            <p className='font-medium'>{post.caption}</p>
                        </div>

                        {/* IMAGES */}
                        <div className='flex gap-2 md:gap-3 justify-center mt-2 sm:w-[80%] sm:mx-auto'>
                        {post.images && post.images.length > 0 && ( 
                            post.images.map((img, index) => <img src={img} key={index} className='w-full object-cover max-w-40 h-44 md:h-52 bg-[#D9D9D9] rounded-md' />
                        ))}
                        </div>
                        
                        {/* LIKES AND COMMENTS */}
                        <div className='my-3 flex '>
                            {/* <div className='justify-between w-full' style={{ display: post.likes.length === 0 || post.comments.length === 0 ? 'none' : 'flex'}}>
                                <div className='flex items-center'>
                                    <img className='w-5' src={like} alt="" />
                                    <p className='text-sm ml-2'>{post.likes.length}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='text-sm ml-2'>{post.comments.length} comments</p>
                                </div>
                            </div> */}
                        </div>

                        {/* LINE */}
                        <div className='w-full mb-4'>
                            <div className='h-[1px] w-full relative bg-[#a5a5a5]'></div>
                        </div>

                        {/* USER INTERACTIONS */}
                        <div className='w-full gap-7 sm:gap-16 xl:gap-20 flex justify-center '>
                            <div className='flex items-center cursor-pointer'>
                                <img className='w-6' src={unlike} alt="" />
                                <p className='font-semibold pl-1 sm:pl-2 text-sm'>Like</p>
                            </div>
                            <div className='flex items-center cursor-pointer'>
                                <img className='w-[21px]' src={comment} alt="" />
                                <p className='font-semibold pl-1 sm:pl-2 text-sm'>Comment</p>
                            </div>
                            <div className='flex items-center cursor-pointer'>
                                <img className='w-5' src={message} alt="" />
                                <p className='font-semibold pl-1 sm:pl-2 text-sm'>Message</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </>
    )
}

export default Posts
