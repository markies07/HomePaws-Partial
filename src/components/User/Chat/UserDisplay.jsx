import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../General/AuthProvider';

function UserDisplay({participants}) {
    const { userData } = useContext(AuthContext);
    const [otherUser, setOtherUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const otherUserID = participants.find(uid => uid !== userData.uid);
        }
    })

    return (
        <div>
            <>
                <img className='w-10 h-10 bg-text rounded-full' src={otherUser.profileImage || ''} alt='' />
                <p className='font-medium pl-3 leading-4 w-52'>{otherUser.name || 'Unknown User'}</p>
            </>
        </div>
    )
}

export default UserDisplay