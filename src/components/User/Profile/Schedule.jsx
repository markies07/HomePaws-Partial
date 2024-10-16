import React, { useContext, useState } from 'react'
import close from './assets/close-dark.svg'
import { AuthContext } from '../../General/AuthProvider'
import { db } from '../../../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { successAlert } from '../../General/CustomAlert';
import { notifyErrorOrange } from '../../General/CustomToast';

function Schedule({closeUI, data}) {
    const {user} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [meetUpDate, setMeetUpDate] = useState('');
    const [meetUpTime, setMeetUpTime] = useState('');
    const [meetUpPlace, setMeetUpPlace] = useState('');

    const submitSchedule = async () => {
        setLoading(true);

        if (!meetUpDate || !meetUpTime || !meetUpPlace) {
            notifyErrorOrange("Please fill out all fields");
            return;
        }

        try{
            const applicationRef = doc(db, 'acceptedApplications', data.applicationID);
            
            const meetUpData = {
                meetupSchedule: {
                    meetUpDate,
                    meetUpTime,
                    meetUpPlace,
                    petOwnerConfirmation: {
                        isConfirmed: true,
                    },
                    adopterConfirmation: {
                        isConfirmed: false,
                    }
                },
                isScheduled: 'submitted',
            }
    
            await updateDoc(applicationRef, meetUpData);
            successAlert('Meet-up schedule submitted successfully!');
            setTimeout(() => {
                window.location.reload();
            }, [1000])
            
        }
        catch(error){
            console.error(error);
            notifyErrorOrange("Failed to submit meet-up schedule. Please try again.");
        }
        finally{
            setLoading(false);
        }
    }

    

    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/65'>
            <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-auto rounded-lg py-5 flex flex-col">
                <img onClick={closeUI} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 sm:pt-0 mb-4'>Meet up Schedule</h1>
                
                {/* SETTING UP SCHEDULE */}
                {data.isScheduled === 'waiting' && data.petOwnerID === user.uid ? (
                    <div className='mt-3'>
                        <div className='w-full flex gap-2'>
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Date</p>
                                <input required onChange={(e) => setMeetUpDate(e.target.value)} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="date" />
                            </div>
                            <div className='w-[50%]'>
                                <p className='font-semibold'>Time</p>
                                <input required onChange={(e) => setMeetUpTime(e.target.value)} className='py-[3px] text-sm sm:text-base bg-secondary w-full px-2 border-2 outline-none border-text rounded-md' type="time" />
                            </div>
                        </div>
                        <div className='w-full mt-3'>
                            <p className='font-semibold'>Place</p>
                            <textarea required onChange={(e) => setMeetUpPlace(e.target.value)} className='py-1 w-full h-20 px-2 outline-none border-2 border-text rounded-md' placeholder='Place of meet up'></textarea>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className='flex justify-center gap-2 pt-7'>
                            <button onClick={submitSchedule} className='bg-primary cursor-pointer duration-150 hover:bg-primaryHover font-medium gap-2 text-white py-1 px-5 rounded-md'>{loading ? 'SUBMITTING...' : 'SUBMIT'}</button>
                        </div>
                    </div>
                ) : (
                    <div className='w-full mt-3 bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                        <p className='font-semibold text-center leading-5'>Waiting for the pet owner to set-up schedule</p>
                    </div>
                )}

                {/* SUBMITTED SCHEDULE */}
                {data.isScheduled === 'submitted' && (
                    <div className='mt-2'>

                        <div className='flex gap-2'>
                            <div className='w-[65%] bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                                <p className='font-semibold'>Date:</p>
                                <p>November 7, 2024</p>
                            </div>
                            <div className='w-[35%] bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                                <p className='font-semibold'>Time:</p>
                                <p>12:00 PM</p>
                            </div>
                        </div>
                        <div className='w-full mt-3 bg-secondary shadow-custom p-2 sm:p-3 rounded-md'>
                            <p className='font-semibold'>Place:</p>
                            <p>Pasong Kawayan 2 General Trias, Cavite</p>
                        </div>

                        {/* CONFIRM BUTTONS */}
                        {data.isScheduled === 'submitted' ? (
                            <div className='flex justify-center gap-2 pt-7'>
                                <button className='bg-[#80A933] cursor-pointer duration-150 hover:bg-[#72972e] font-medium gap-2 text-white py-1 w-24 rounded-md'>CONFIRM</button>
                                <button className='bg-[#D25A5A] cursor-pointer duration-150 hover:bg-[#bd5252] font-medium gap-2 text-white py-1 w-24 rounded-md'>EDIT</button>
                            </div>
                        ) : (
                            // WAITING FOR RESPONSE 
                            <div className='hidden justify-center gap-2 pt-5'>
                                <p className='font-medium text-white shadow-custom bg-primary rounded-full py-2 px-4'>WAITING FOR CONFIRMATION</p>
                            </div>
                        )}

                        

                        {/* DAYS LEFT BEFORE MEETING THE PET */}
                        <div className='justify-center hidden gap-2 pt-3'>
                            <p className='font-medium text-center text-white shadow-custom bg-primary rounded-md py-3 px-4'>11 more days until meet up</p>
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    )
}

export default Schedule