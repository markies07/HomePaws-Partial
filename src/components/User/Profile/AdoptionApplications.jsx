import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close.svg'
import applicationIcon from './assets/application-icon.svg'
import { AuthContext } from '../../General/AuthProvider'
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

function AdoptionApplications({closeApplications}) {
    const {user, userData} = useContext(AuthContext);
    const [otherApplications, setOtherApplications] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchApplications = async () => {
            try{
                const otherApplicationsRef = query(
                    collection(db, 'adoptionApplications'), 
                    where('petOwnerID' , '==', user.uid), 
                    orderBy('dateSubmitted', 'desc')
                );

                const myApplicationsRef = query(
                    collection(db, 'adoptionApplications'), 
                    where('adopterUserID' , '==', user.uid), 
                    orderBy('dateSubmitted', 'desc')
                );

                const [otherSnapshot, mySnapshot] = await Promise.all([
                    getDocs(otherApplicationsRef),
                    getDocs(myApplicationsRef)
                ]);

                const otherApplications = otherSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const myApplications = mySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setOtherApplications(otherApplications);
                setMyApplications(myApplications);
            }
            catch(error){
                console.error(error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchApplications();
    }, [user.uid]);

    const [userImages, setUserImages] = useState({});
    const [petImages, setPetImages] = useState({});
  
    useEffect(() => {
      const fetchImages = async () => {
        const userImagePromises = otherApplications.map(async (app) => {
          const userDoc = await getDoc(doc(db, 'users', app.adopterUserID));
          return { [app.id]: userDoc.data().profilePictureURL };
        });
  
        const petImagePromises = myApplications.map(async (app) => {
          const petDoc = await getDoc(doc(db, 'petsForAdoption', app.petID));
          return { [app.id]: petDoc.data().petImages[1] };
        });
  
        const userImagesArray = await Promise.all(userImagePromises);
        const petImagesArray = await Promise.all(petImagePromises);
  
        setUserImages(Object.assign({}, ...userImagesArray));
        setPetImages(Object.assign({}, ...petImagesArray));
      };
  
      fetchImages();
    }, [db, otherApplications, myApplications]);

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
        <div key={application.id} onClick={() => read(application.id, application.adopterUserID)} className='bg-[#E9E9E9] relative items-center flex hover:bg-[#d3d3d3] duration-150 cursor-pointer w-full p-3 rounded-lg'>
          <div className='relative w-12 h-12 shrink-0'>
            <img className='w-full h-full bg-text object-cover rounded-full' src={isMyApplication ? petImages[application.id] : userImages[application.id]} alt="" />
            <img className='w-6 h-6 absolute rounded-full bottom-0 -right-1' src={applicationIcon} alt="" />
          </div>
          <div className={`pl-3 sm:pl-4 flex flex-col justify-center`}>
            <p className={`${application.read === false && application.adopterUserID !== user.uid ? 'pr-7 sm:pr-10' : ''} font-semibold text-sm sm:text-base leading-4`}>
              {isMyApplication ? 'You' : application.adopterName} <span className='font-normal'>submitted adoption application for {application.petName}.</span>
            </p>
            <p className='text-xs sm:text-[13px] text-[#8a8a8a] mt-1 sm:mt-0'>{getTimeDifference(application.dateSubmitted)}</p>
          </div>

          {/* UNREAD */}
          <div className={`${application.read === false && application.adopterUserID !== user.uid ? 'flex' : 'hidden'} absolute right-3 sm:right-5 top-0 h-full items-center justify-center`}>
            <div className='w-4 h-4 bg-primary rounded-full' />
          </div>
        </div>
    );

    const filteredApplications = () => {
        switch(filter) {
            case 'Yours':
                return myApplications.map(app => renderApplication(app, true));
            case 'Others':
                return otherApplications.map(app => renderApplication(app, false));
            default:
                return [
                    ...otherApplications.map(app => renderApplication(app, false)),
                    ...myApplications.map(app => renderApplication(app, true))
                ];
        }
    }


    return (
        <div className='p-3 lg:pt-3 lg:px-0 min-h-[calc(100dvh-145px)] lg:min-h-[calc(100dvh-80px)] w-full flex-grow'>
            <div className='bg-secondary p-3 sm:p-5 relative w-full shadow-custom h-full rounded-md lg:rounded-lg'>
                <img onClick={closeApplications} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <p className='text-xl font-medium pt-1 sm:pt-0 sm:text-2xl'>Adoption Applications</p>
                <div className='flex mb-3 mt-2'>
                    {['All', 'Yours', 'Others'].map(buttonText => (
                        <button key={buttonText} onClick={() => setFilter(buttonText)} className={`text-xs sm:text-sm font-medium px-2 sm:px-3 cursor-pointer py-1 ${filter === buttonText ? 'bg-primary rounded-md text-white' : ''}`}>{buttonText}</button>
                    ))}
                </div>

                {/* APPLICATIONS */}
                <div className='flex flex-col gap-2'>

                    {loading ? (
                        <div className="text-center text-gray-500 font-medium py-5 bg-[#E9E9E9] rounded-md">Loading...</div>
                    ) : 
                    filteredApplications().length > 0 ? (
                        <div className='flex flex-col gap-2'>
                            {filteredApplications()}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 font-medium py-5 bg-[#E9E9E9] rounded-md">No Application</div>
                    )}

                </div>

            </div>
        </div>
    )
}

export default AdoptionApplications