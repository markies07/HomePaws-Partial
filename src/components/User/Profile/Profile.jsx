import React from 'react'
import UserProfile from './UserProfile'
import UserPosts from './UserPosts'

function Profile() {
  return (
    <div className='pt-36 relative lg:pt-20 lg:pl-48 xl:pl-56 lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
      < UserProfile />
      < UserPosts />
    </div>
  )
}

export default Profile