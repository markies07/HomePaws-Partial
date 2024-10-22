import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close.svg'
import check from './assets/check.svg'
import complete from './assets/complete.svg'
import comment from './assets/white-comment.svg'
import schedule from './assets/schedule.svg'
import whiteApplication from './assets/white-application.svg'
import cancel from './assets/cancel.svg'
import Schedule from './Schedule'
import { useNavigate, useParams } from 'react-router-dom'
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
import { AuthContext } from '../../General/AuthProvider'
import LoadingScreen from '../../General/LoadingScreen'
import AdoptionContract from './AdoptionContract'
import CancelRehome from './CancelRehome'
import paw from './assets/white-paw.svg'

function AcceptedApplication() {
    const {user, userData } = useContext(AuthContext);
    const navigate = useNavigate();
    const {applicationID} = useParams();
    const [data, setData] = useState({});
    const [pet, setPet] = useState({});
    const [adopter, setAdopter] = useState({});
    const [loading, setLoading] = useState(true);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isMeetup, setIsMeetup] = useState(false);
    const [isCancel, setIsCancel] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    
    // FETCHING ACCPETED APPLICAITON DATA
    useEffect(() => {
        const fetchApplication = async () => {
            try{
                const docRef = doc(db, 'acceptedApplications', applicationID);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()){
                    const application = docSnap.data();
                    setData(application);

                    if(application.petID){
                        fetchPetData(application.petID);
                        fetchAdopterData(application.adopterUserID);
                    }
                }
                else{
                    console.log("No document!");
                }
            }
            catch(error){
                console.error(error);
            }
            finally{
                setLoading(false);
            }
        }

        const fetchPetData = async (petID) => {
            try{
                const petRef = doc(db, 'petsForAdoption', petID);
                const petSnap = await getDoc(petRef);

                if(petSnap.exists()){
                    const petData = petSnap.data();
                    setPet(petData);
                }
                else {
                    console.log("No such pet document!");
                }
            } 
            catch (error){
                console.error("Error fetching pet data: ", error);
            }
            
        }

        const fetchAdopterData = async (userID) => {
            try{
                const userRef = doc(db, 'users', userID);
                const userSnap = await getDoc(userRef);

                if(userSnap.exists()){
                    setAdopter(userSnap.data());
                }
            } 
            catch (error){
                console.error(error);
            }
            
        }

        if(applicationID){
            fetchApplication();
        }
    }, [applicationID]);

    let image;

    if (pet && pet.petImages && pet.petImages.length > 0) {
        console.log('Pet Images:', pet.petImages);  // This will log the pet images array
        image = pet.petImages[0]; // Access the first image safely
      } else {
        console.log('No images found for the pet');
        image = null;  // Fallback if no images are found
      }


    // UPDATING STATUS
    useEffect(() => {
        const updateStatus = async () => {
      
          if (data?.meetupSchedule?.meetUpDate === today) {
            try {
                setIsMeetup(true);
                const docRef = doc(db, 'acceptedApplications', data.applicationID);
                // const notificationRef = collection(db, 'notifications');
                
                // ADOPTER
                // await addDoc(notificationRef, {
                //     content: `Today is your meet-up with ${pet.petName}.`,
                //     applicationID: data.applicationID,
                //     senderName: 'Today',
                //     type: 'adoption',
                //     image: image,
                //     senderId: data.petOwnerID,
                //     userId: data.adopterUserID,
                //     isRead: false,
                //     timestamp: serverTimestamp(),
                // });
                

                // // PET OWNER
                // await addDoc(notificationRef, {
                //     content: `Today is your meet-up with ${data.adopterName}.`,
                //     applicationID: data.applicationID,
                //     type: 'adoption',
                //     image: image,
                //     senderId: data.adopterUserID,
                //     userId: data.petOwnerID,
                //     isRead: false,
                //     timestamp: serverTimestamp(),
                // });

                await updateDoc(docRef, {
                    status: 'meetup',
                    meetupNotified: true,
                });
                

            } catch (error) {
                console.error("Error updating document: ", error);
            }
          } else {
                console.log('Condition not met, status not updated');
          }
        };
      
        if (data) {
            updateStatus();
        } else {
            console.log('Data is not available yet');
        }
      }, [data, today, db]);


    const toggleSchedule = () => {
        setIsScheduleOpen(!isScheduleOpen);
    }

    const toggleCancel = () => {
        setIsCancel(!isCancel);
    }

    // DAYS BEFORE MEETUP
    const calculateDaysUntilMeetup = (meetUpDate) => {
        const today = new Date(); // Get today's date
        const targetDate = new Date(meetUpDate); // Convert the meetUpDate to a Date object
    
        const timeDifference = targetDate - today; // Get the difference in milliseconds
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days
    
        return daysDifference;
    }


    // MESSAGING EACH OTHER
    const handleStartChat = async (receiver) => {

        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', receiver)
        );

        const querySnapshot = await getDocs(q);
        let existingChat = null;

        querySnapshot.forEach(doc => {
            const participants = doc.data().participants;
            if(participants.includes(receiver)) {
                existingChat = doc.id;
            }
        });

        let chatID;
        if(existingChat){
            chatID = existingChat;
        }
        else{
            const newChatRef = await addDoc(collection(db, 'chats'), {
                participants: [user.uid, receiver],
            })
            chatID = newChatRef.id;
        }
        navigate(`/dashboard/chat/convo/${chatID}`);
    }


    if (loading) {
        return <LoadingScreen />; 
    }

    // console.log(data);

    return (
        <div className='pt-[9.75rem] relative lg:pt-[5.75rem] lg:pl-48 xl:pl-[13.8rem] lg:pr-[13px] sm:px-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
          <div className='bg-secondary flex flex-col mb-3 pt-3 overflow-hidden flex-grow sm:pt-5 relative w-full shadow-custom h-full sm:rounded-md lg:rounded-lg'>
                <img onClick={() => window.history.back()} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <p className='text-2xl text-center sm:text-start pt-6 px-3 sm:px-5 font-semibold sm:pt-0'>Rehoming in Progress</p>
                {/* PROGRESS BAR */}
                <div className='relative sm:w-[90%] xl:w-[70%] sm:mx-auto mt-10 h-28 sm:h-auto px-5 flex justify-between'>
                    {/* 1ST PROGRESS */}
                    <div className='flex z-10 items-center self-end sm:self-auto sm:pt-5 flex-col justify-center'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex justify-center items-center'>
                            <img className='w-5 h-5' src={check} alt="" />
                        </div>
                        <p className='text-xs md:text-base leading-3 md:leading-tight font-semibold text-center py-2'>Accepted<br />Application</p>
                    </div>
                    {/* 2ND PROGRESS */}
                    <div className='flex z-10 items-center flex-col self-start sm:self-auto sm:pt-5 justify-center'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary flex justify-center items-center rounded-full sm:order-1 order-2'>
                            <img className={`${data.status !== 'accepted' ? 'block' : 'hidden'} w-5 h-5`} src={check} alt="" />
                        </div>
                        <p className='text-xs md:text-base leading-3 md:leading-tight font-semibold text-center py-2 order-1 sm:order-2'>Meet Up<br />Scheduled</p>
                    </div>
                    {/* 3RD PROGRESS */}
                    <div className='flex z-10 items-center flex-col self-end sm:self-auto sm:pt-5 justify-center'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary flex justify-center items-center rounded-full'>
                            <img className={`${data.status !== 'accepted' && data.status !== 'scheduled' || isMeetup ? 'block' : 'hidden'} w-5 h-5`} src={check} alt="" />
                        </div>
                        <p className='text-xs md:text-base leading-3 md:leading-tight font-semibold text-center py-2'>Day of<br />Meet-Up</p>
                    </div>
                    {/* 3RD PROGRESS */}
                    <div className='flex z-10 items-center flex-col self-start sm:self-auto justify-center pt-1'>
                        <div className='w-12 h-12 sm:w-14 sm:h-14 bg-primary flex justify-center items-center rounded-full sm:order-1 order-2'>
                            <img className='w-7 h-7 sm:w-8 sm:h-8' src={complete} alt="" />
                        </div>
                        <p className='text-xs md:text-base leading-3 md:leading-tight font-semibold text-center py-2 order-1 sm:order-2'>Rehomed</p>
                    </div>

                    {/* BAR */}
                    <div className='absolute px-14 md:px-16 top-0 sm:pb-4 md:pb-8 left-0 w-full h-full flex justify-between items-center'>
                        <div className={`${data.status !== 'accepted' ? 'bg-primary' : 'bg-[#D9D9D9]'} w-full h-3 border-r-2`}></div>
                        <div className={`${data.status !== 'accepted' && data.status !== 'scheduled' || isMeetup ? 'bg-primary' : 'bg-[#D9D9D9]'} w-full h-3 border-r-2`}></div>
                        <div className={`${data.status !== 'accepted' && data.status !== 'scheduled' && data.status !== 'meetup' ? 'bg-primary' : 'bg-[#D9D9D9]'} w-full h-3 border-r-2`}></div>
                    </div>
                </div>

                {/* STATUS */}
                <div className='w-full mt-7 sm:px-5 2xl:w-[90%] 2xl:mx-auto'>
                    <div className='w-full py-3 px-3 gap-2 md:gap-0 flex-col md:flex-row sm:px-5 flex justify-between items-center rounded-md lg:rounded-lg bg-[#E9E9E9]'>
                        <div className='flex md:flex-col sm:text-lg md:gap-0 xl:flex-row xl:gap-2 gap-2'>
                            <p className='font-semibold'>{data.status === 'accepted' ? 'Action needed:' : 'Status:'}</p>
                            <p>{data.status === 'accepted' ? 'Schedule the meet-up' : calculateDaysUntilMeetup(data.meetupSchedule.meetUpDate) >= 1 ? `${calculateDaysUntilMeetup(data.meetupSchedule.meetUpDate)} more ${calculateDaysUntilMeetup(data.meetupSchedule.meetUpDate) > 1 ? 'days' : 'day'} until meet up` : 'Meet-up day is here!'}</p>
                        </div>
                        <div className='flex gap-2'>
                            <button onClick={toggleSchedule} className={`flex bg-[#90b845] cursor-pointer duration-150 hover:bg-[#98c24a] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md`}><img className='w-4 h-4' src={schedule} alt="" />Meet-up Schedule</button>
                            <button onClick={toggleCancel} className='flex bg-[#D25A5A] text-xs md:text-base cursor-pointer duration-150 hover:bg-[#c25454] items-center font-medium gap-2 text-white p-2 rounded-md'><img className='w-[14px] h-[14px]' src={cancel} alt="" />Cancel Rehome</button>
                        </div>
                    </div>
                </div>


                <div className='w-full 2xl:w-[90%] 2xl:mx-auto flex flex-col lg:flex-row mt-5 lg:mt-3 lg:px-5 lg:gap-3'>

                    {/* PET DETAILS */}
                    <div className='w-full sm:px-5 lg:px-0 lg:w-1/2 pb-5 lg:order-2'>
                        <div className='w-full p-3 sm:px-5 rounded-md lg:rounded-lg bg-[#E9E9E9]'>
                            <p className='text-center text-xl font-semibold'>Pet Details</p>

                            <div className='flex flex-col gap-2 mt-4 text-sm sm:text-base'>
                                <div className='flex w-full gap-2'>
                                    <img className='w-32 shrink-0 object-cover h-[120px] sm:h-[152px] rounded-lg bg-text' src={pet.petImages && pet.petImages.length > 0 ? pet.petImages[0] : null} alt="" />
                                    <div className='w-full flex flex-col gap-2'>
                                        <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                            <p className='font-semibold'>Pet Name:</p>
                                            <p>{pet.petName}</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className='bg-secondary w-[50%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Pet Type:</p>
                                                <p>{pet.petType}</p>
                                            </div>
                                            <div className='bg-secondary w-[50%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Age:</p>
                                                <p>{pet.age}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Pet Owner:</p>
                                    <p>{pet.ownerName}</p>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Location:</p>
                                    <p>{pet.location}</p>
                                </div>
                            </div>
                            <div className='pt-5 pb-2 flex justify-center gap-2'>
                                <button onClick={() => handleStartChat(data.petOwnerID)} className={`${data.adopterUserID === user.uid ? 'flex' : 'hidden'} bg-[#6AAAAA] leading-snug cursor-pointer duration-150 hover:bg-[#619b9b] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md`}><img className='w-4 h-4' src={comment} alt="" />Message Owner</button>
                                {data.meetupSchedule && 
                                    <AdoptionContract data={data} pet={pet} />
                                }
                            </div>
                        </div>
                    </div>

                    {/* ADOPTER DETAILS */}
                    <div className='w-full sm:px-5 lg:px-0 lg:w-1/2 pb-5 lg:order-1'>
                        <div className='w-full p-3 sm:px-5 rounded-md lg:rounded-lg bg-[#E9E9E9]'>
                            <p className='text-center text-xl font-semibold'>Adopter Details</p>

                            <div className='flex flex-col gap-2 mt-4 text-sm sm:text-base'>
                                <div className='flex w-full gap-2'>
                                    <img className='w-32 shrink-0 h-[120px] sm:h-[152px] rounded-lg object-cover bg-text' src={adopter.profilePictureURL} alt="" />
                                    <div className='w-full flex flex-col gap-2'>
                                        <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                            <p className='font-semibold'>Full Name:</p>
                                            <p>{data.adopterName}</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className='bg-secondary w-[30%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Age:</p>
                                                <p>{data.age}</p>
                                            </div>
                                            <div className='bg-secondary w-[70%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Contact No:</p>
                                                <p>{data.contactNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Full Address:</p>
                                    <p>{data.fullAddress}</p>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Commitment:</p>
                                    <p>{data.commitment}</p>
                                </div>
                            </div>
                            <div className='pt-5 pb-2 flex justify-center gap-2'>
                                <button onClick={() => handleStartChat(data.adopterUserID)} className={`${data.petOwnerID === user.uid ? 'flex' : 'hidden'} bg-[#6AAAAA] leading-snug cursor-pointer duration-150 hover:bg-[#619b9b] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md`}><img className='w-4 h-4' src={comment} alt="" />Message Adopter</button>
                                <button onClick={() => navigate(`/dashboard/profile/applications/application/${data.applicationID}`)} className='flex bg-[#6AAAAA] leading-snug cursor-pointer duration-150 hover:bg-[#619b9b] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md'><img className='w-4 h-4' src={whiteApplication} alt="" />View Application</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SCHEDULE */}
                <div className={isScheduleOpen ? 'block' : 'hidden'}>
                    <Schedule isMeetup={isMeetup} closeUI={toggleSchedule} data={data} />
                </div>

                {/* CANCEL REHOME */}
                <div className={isCancel ? 'block' : 'hidden'}>
                    <CancelRehome data={data} pet={pet} closeCancel={toggleCancel} />
                </div>

          </div>
      </div>
    )
}

export default AcceptedApplication