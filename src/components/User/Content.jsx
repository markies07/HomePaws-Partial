import React from 'react'
import { useSelector } from 'react-redux'
import FindPet from './Find Pet/FindPet'
import NewsFeed from './News Feed/NewsFeed';
import Chat from './Chat/Chat';
import Profile from './Profile/Profile';

function Content() {
    const activeTab = useSelector((state) => state.navigation.activeTab);

    return (
        <div className='pt-36 lg:pt-20 lg:pl-48 xl:pl-56 lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            {activeTab === 'FindPet' && <FindPet />}
            {activeTab === 'NewsFeed' && <NewsFeed />}
            {activeTab === 'Chat' && <Chat />}
            {activeTab === 'Profile' && <Profile />}
        </div>
    )
    }

export default Content