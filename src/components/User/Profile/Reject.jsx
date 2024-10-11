import React, { useContext, useState } from 'react'
import close from './assets/close-dark.svg'
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { AuthContext } from '../../General/AuthProvider';

function Reject({application, closeReject, petImage}) {
    const [rejectReason, setRejectReason] = useState('');
    const [loading, setLoading] = useState(false);
    const {user, userData} = useContext(AuthContext);

    const handleRejectApplication = async () => {
        setLoading(true);

        if(!rejectReason.trim()){
            notifyErrorOrange('Plase provide a reason for rejection.');
            setLoading(false)
            return;
        }

        try{
            const applicationRef = doc(db, 'adoptionApplications', application.applicationID);

            await addDoc(collection(db, 'rejectedApplications'), {
                adopterID: application.adopterUserID,
                applicationID: application.applicationID,
                petID: application.petID,
                rejectReason: rejectReason,
                timestamp: serverTimestamp(),
                petOwnerID: application.petOwnerID,
            });

            await updateDoc(applicationRef, {
                status: 'rejected',
            });

            const notificationRef = collection(db, 'notifications');
            await addDoc(notificationRef, {
                content: 'rejected your adoption application.',
                adopterID: application.adopterUserID,
                applicationID: application.applicationID,
                type: 'adoption',
                image: petImage,
                senderName: userData.fullName,
                isRead: false,
                timestamp: serverTimestamp(),
            });

            notifySuccessOrange('Submitted successfully!');
            setTimeout(() => {
                window.location.reload();
            }, [2000]);
        }
        catch(error){
            console.error(error);
            notifyErrorOrange('Failed to submit. Please try again.');
        }
        finally{
            setLoading(false);
        }

    }



    return (
        <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/50'>
            <div className="relative px-5 bg-[#d8d8d8] w-[90%] sm:w-[30rem] h-[50%] rounded-lg py-3 flex flex-col">
                <img onClick={closeReject} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
                <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Reject Application</h1>
                
                {/* REASON OF REJECTION */}
                <div className='pt-4 pb-11 flex-grow'>
                    <p className='font-medium pb-1 text-lg'>Reason for rejection</p>
                    <textarea required onChange={(e) => setRejectReason(e.target.value)} value={rejectReason} className='py-2 mb-5 w-full h-full px-3 outline-none rounded-md' placeholder='State your reason...'></textarea>
                </div>
                
                <div className='flex justify-center'>
                    <button onClick={handleRejectApplication} className='bg-primary hover:bg-primaryHover duration-150 py-2 px-5 rounded-md text-white'>{loading ? 'Submitting...' : 'Submit'}</button>
                </div>
                
            </div>
        </div>
    )
}

export default Reject