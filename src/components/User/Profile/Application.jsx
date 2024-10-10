import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close.svg'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../firebase/firebase'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../General/AuthProvider'

function Application() {
    const {user} = useContext(AuthContext);
    const { applicationID } = useParams();
    const [applicationData, setApplicationData] = useState({});
    const [petData, setPetData] = useState({});

    useEffect(() => {
        const fetchApplication = async () => {
            try{
                const docRef = doc(db, 'adoptionApplications', applicationID);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()){
                    const application = docSnap.data();
                    setApplicationData(application);

                    if(application.petID){
                        fetchPetData(application.petID)
                    }
                }
                else{
                    console.log("No document!");
                }
            }
            catch(error){
                console.error(error);
            }
        }

        const fetchPetData = async (petID) => {
            try {
                const petRef = doc(db, 'petsForAdoption', petID);
                const petSnap = await getDoc(petRef);

                if (petSnap.exists()) {
                    const pet = petSnap.data();
                    setPetData(pet); // Set the pet data (including image URL)
                } else {
                    console.log("No such pet document!");
                }
            } catch (error) {
                console.error("Error fetching pet data: ", error);
            }
        };

        if(applicationID){
            fetchApplication();
        }
    }, [applicationID]);

    const image = petData.petImages && petData.petImages.length > 0 ? petData.petImages[0] : null;
   

    return (
        <div className='pt-36 relative lg:pt-[4.75rem] lg:pl-[12rem] xl:pl-[13.8rem] lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            <div className='bg-[#E9E9E9] p-3 my-3 lg:my-4 sm:p-5 relative w-full sm:w-[95%] lg:w-full sm:mx-auto shadow-custom h-full sm:rounded-md lg:rounded-lg'>
                <img className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' onClick={() => window.history.back()} src={close} alt="" />
                <div className='flex flex-col gap-4 justify-center items-center w-full'>
                    <h1 className='text-2xl sm:text-3xl font-medium text-center pt-7'>Adoption Application</h1>
                    <div className='w-60 mb-5 duration-150 relative h-64 flex flex-col drop-shadow-md rounded-xl overflow-hidden'>
                        <img draggable='false' src={image} className='h-full w-full object-cover bg-text' alt="" />
                        <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>{applicationData.petName}</p>
                    </div>
                </div>

                <div className='w-full sm:w-[80%] lg:w-[40rem] sm:mx-auto'>
                    <div className='w-full mb-3 mt-3'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* ADOPTER"S INFO */}
                    <div>
                        <h1 className='text-lg sm:text-xl pt-2 font-semibold mb-2 sm:mb-3'>Adopter's Information</h1>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-[75%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Full Name:</p>
                                <p>{applicationData.adopterName}</p>
                            </div>
                            <div className='flex flex-col shadow-custom w-[25%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Gender:</p>
                                <p>{applicationData.gender}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-[18%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Age:</p>
                                <p>{applicationData.age}</p>
                            </div>
                            <div className='flex flex-col shadow-custom w-[40%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Date of Birth:</p>
                                <p>{applicationData.dateOfBirth}</p>
                            </div>
                            <div className='flex flex-col shadow-custom w-[43%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Contact No:</p>
                                <p>{applicationData.contactNumber}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Email Address:</p>
                                <p>{applicationData.emailAddress}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Full Address:</p>
                                <p>{applicationData.fullAddress}</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full mb-3 mt-7'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* ADOPTION APPLICATION DETAILS */}
                    <div>
                        <h1 className='text-lg sm:text-xl pt-2 font-semibold mb-2 sm:mb-3'>Adoption Application Details</h1>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Reason for adopting:</p>
                                <p>{applicationData.reasonForAdopting}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Experience with pets:</p>
                                <p>{applicationData.experienceWithPets}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 sm:gap-3 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-[50%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Type of residence:</p>
                                <p>{applicationData.typeOfResidence}</p>
                            </div>
                            <div className='flex flex-col shadow-custom w-[50%] leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Occupation:</p>
                                <p>{applicationData.occupation}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Salary range:</p>
                                <p>{applicationData.salaryRange}</p>
                            </div>
                        </div>
                        <div className='w-full flex gap-2 mb-2 sm:mb-3'>
                            <div className='flex flex-col shadow-custom w-full leading-6 bg-secondary p-2 sm:p-3 lg:p-4 rounded-md'>
                                <p className='font-semibold'>Commitment:</p>
                                <p>{applicationData.commitment}</p>
                            </div>
                        </div>
                    </div>

                    {/* ACCEPT OR REJECT */}
                    <div className={`pt-5 pb-2 justify-center gap-3 sm:gap-5 ${applicationData.petOwnerID === user.uid ? 'flex' : 'hidden'}`}>
                        <button className='bg-[#84B725] cursor-pointer hover:bg-[#76a321] duration-150 font-medium text-white py-2 px-6 text-sm sm:text-base rounded-md'>ACCEPT</button>
                        <button className='bg-[#D25A5A] cursor-pointer hover:bg-[#b94d4d] duration-150 font-medium text-white py-2 px-6 text-sm sm:text-base rounded-md'>REJECT</button>
                    </div>
                    <div className={`pt-5 pb-2 justify-center gap-3 sm:gap-5 ${applicationData.petOwnerID !== user.uid ? 'flex' : 'hidden'}`}>
                        <p className='bg-primary font-medium text-white py-2 px-6 text-sm sm:text-base rounded-full'>Application Under Review</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Application