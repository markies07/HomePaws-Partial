import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../General/AuthProvider'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import accepted from '../assets/accepted.svg';


function Accepted({loading, otherApplications, myApplications, petImages, userImages}) {
  const [filter, setFilter] = useState('All');
  const {user, userData} = useContext(AuthContext);
  const navigate = useNavigate();


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
        return years === 1 ? '1y ago' : `${years}y ago`;
      } else if (months > 0) {
        return months === 1 ? '1m ago' : `${months}m ago`;
      } else if (days > 0) {
        return days === 1 ? '1d ago' : `${days}d ago`;
      } else if (hours > 0) {
        return hours === 1 ? '1h ago' : `${hours}h ago`;
      } else if (minutes > 0) {
        return minutes === 1 ? '1min ago' : `${minutes}min ago`;
      } else {
        return `${seconds}s ago`;
      }
  };

  const read = async (applicationID, adopterID) => {

    if(adopterID !== user.uid){
      const applciationRef = doc(db, 'adoptionApplications', applicationID);
      
      await updateDoc(applciationRef, {
        read: true,
      });
    }
    
    navigate(`application/${applicationID}`)
  }


  const renderApplication = (application, isMyApplication) => (
      <div key={application.id} onClick={() => read(application.id, application.adopterUserID)} className='bg-secondary relative items-center flex shadow-custom hover:bg-[#f1f1f1] duration-150 cursor-pointer w-full p-3 rounded-lg'>
        <div className='relative w-12 h-12 shrink-0'>
          <img className='w-full h-full bg-text object-cover rounded-full' src={isMyApplication ? petImages[application.id] : userImages[application.id]} alt="" />
          <img className='w-7 h-7 absolute rounded-full bottom-0 -right-1' src={accepted} alt="" />
        </div>
        <div className={`pl-3 flex flex-col justify-center`}>
          <p className={`${application.read === false && application.adopterUserID !== user.uid ? 'pr-7 sm:pr-10' : ''} font-semibold text-sm sm:text-base leading-4`}>
            {isMyApplication ? 'Your' : application.adopterName+'\'s'} <span className='font-normal'>adoption application for {application.petName} has been <span className='font-semibold text-[#4CAF50]'>accepted</span>.</span>
          </p>
          <p className='text-xs sm:text-[13px] text-[#8a8a8a] mt-1 sm:mt-0'>{getTimeDifference(application.dateSubmitted)}</p>
        </div>

        {/* UNREAD */}
        <div className={`${application.read === false && application.adopterUserID !== user.uid && application.petOwnerID !== user.uid ? 'flex' : 'hidden'} absolute right-3 sm:right-5 top-0 h-full items-center justify-center`}>
          <div className='w-4 h-4 bg-primary rounded-full' />
        </div>
      </div>
  );

  const filteredApplications = () => {
      switch(filter) {
          case 'Adoptee':
              return myApplications.map(app => renderApplication(app, true));
          case 'Adopter':
              return otherApplications.map(app => renderApplication(app, false));
          default:
              return [
                  ...otherApplications.map(app => renderApplication(app, false)),
                  ...myApplications.map(app => renderApplication(app, true))
              ];
      }
  }


  return (
    <div>
        <p className='text-lg font-semibold pt-1 sm:pt-0 sm:text-xl'>Accepted Applications</p>
        
        {/* FILTERING */}
        <div className='flex mb-3 sm:mb-4 mt-2 gap-1'>
            {['All', 'Adoptee', 'Adopter'].map(buttonText => (
                <button key={buttonText} onClick={() => setFilter(buttonText)} className={`text-xs sm:text-sm font-medium px-2 sm:px-3 cursor-pointer py-1 ${filter === buttonText ? 'bg-primary rounded-md text-white' : ''}`}>{buttonText}</button>
            ))}
        </div>

        {/* APPLICATIONS */}
        <div className='flex flex-col gap-2'>
            {loading ? (
                <div className="text-center bg-secondary relative items-center shadow-custom w-full p-5 rounded-lg font-medium">Loading...</div>
            ) : 
            filteredApplications().length > 0 ? (
                <div className='flex flex-col gap-2'>
                    {filteredApplications()}
                </div>
            ) : (
                <div className="text-center bg-secondary relative items-center shadow-custom w-full p-5 rounded-lg font-medium">No Application</div>
            )}
        </div>

    </div>
  )
}

export default Accepted