import React, { useContext, useEffect, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import back from './assets/back.svg'
import unfavorite from '../../../assets/icons/unfavorite.svg'
import { AuthContext } from '../../General/AuthProvider';
import { confirm } from '../../General/CustomAlert';
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { notifyErrorOrange, notifySuccessOrange } from '../../General/CustomToast';
import EditPet from './EditPet';
import { useNavigate, useParams } from 'react-router-dom';
import ImageModal from './ImageModal';

function PetInfo() {
    const { user } = useContext(AuthContext);
    const [isFaqsOpen, setIsFaqsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
    }

    const closeModal = () => {
        setSelectedImage(null);
    }
    
    const handleRemovePet = async (petID, petName) => {
        confirm(`Removing ${pet.petName}`, `Do you really want to remove ${pet.petName} from adoption?`).then(async (result) => {
            if(result.isConfirmed){
                try{
                    await deleteDoc(doc(db, 'petsForAdoption', petID));
                    notifySuccessOrange(`${petName} has been removed from adoption.`);
                    setTimeout(() => {
                        navigate(`/dashboard/find-pet`);
                    }, 2500);
                }
                catch(error){
                    console.error("Error removing pet: ", error);
                    notifyErrorOrange('There was an issue removing the pet.');
                }
            }
        })
    }

    const handleFaqsClick = () => {
        setIsFaqsOpen(!isFaqsOpen);
    }

    const handleEditPetClick = () => {
        setIsEditOpen(!isEditOpen);
    }

    const { petID } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        const fetchPetData = async () => {
          try {
            const petDocRef = doc(db, 'petsForAdoption', petID);  // Assume 'pets' is your collection
            const petDocSnap = await getDoc(petDocRef);
    
            if (petDocSnap.exists()) {
              setPet(petDocSnap.data());  // Store pet data in state
            } else {
              console.log('No such document!');
            }
          } catch (error) {
            console.error('Error fetching pet data:', error);
          } finally {
            setLoading(false);
          }
        };
    
        if (petID) {
          fetchPetData();
        }
      }, [petID]);

      useEffect(() => {
        if (user && petID) {
            const checkApplicationStatus = async () => {
                try {
                    // Create a reference to the 'adoptionApplications' collection
                    const adoptionApplicationsRef = collection(db, 'adoptionApplications');

                    // Create a query to find the application with the current user and petID
                    const q = query(
                        adoptionApplicationsRef,
                        where('adopterUserID', '==', user.uid),
                        where('petID', '==', petID)
                    );

                    // Execute the query
                    const querySnapshot = await getDocs(q);

                    // Check if there are any matching documents
                    if (!querySnapshot.empty) {
                        setIsPending(true);  // User has already applied
                    }
                    else {
                        setIsPending(false);
                    }
                    console.log(querySnapshot)
                } catch (error) {
                    console.error("Error checking application status: ", error);
                }
            };

            checkApplicationStatus();
        }
    }, [user, petID]);

      if (loading) {
        return <div>Loading...</div>;
      }


    return (
        <div className='pt-36 lg:pt-20 lg:pl-48 xl:pl-56 lg:pr-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
            <div className={ !isFaqsOpen && !isEditOpen ? 'w-full flex flex-col lg:flex-row gap-3 h-full lg:pb-4 mt-4' : 'hidden'}>
                <div className='relative px-4 pb-5 bg-secondary mx-auto sm:rounded-lg shadow-custom w-full sm:w-[90%] lg:w-full md:w-[80%] h-full'>
                    <img onClick={() => navigate(`/dashboard/find-pet`)} className='absolute border-2 lg:hidden border-secondary hover:border-text duration-150 cursor-pointer p-1 top-3 right-3' src={close} alt="" />
                    
                    {/* PICTURES */}
                    <div className='max-w-[38rem] pb-7 mx-auto flex pt-14 lg:pt-7 gap-3 sm:gap-5 xl:gap-7'>
                        <div className='bg-[#BCBCBC] overflow-hidden rounded-md h-44 sm:h-56 w-full flex justify-center'>
                            <img className='w-full object-cover cursor-pointer' src={pet.petImages[0]} onClick={() => openModal(pet.petImages[0])} alt="" />
                        </div>
                        <div className='bg-[#BCBCBC] overflow-hidden rounded-md h-44 sm:h-56 w-full flex justify-center'>
                            <img className='w-full object-cover cursor-pointer' src={pet.petImages[1]} onClick={() => openModal(pet.petImages[1])} alt="" />
                        </div>
                        <div className='bg-[#BCBCBC] overflow-hidden rounded-md h-44 sm:h-56 w-full flex justify-center'>
                            <img className='w-full object-cover cursor-pointer' src={pet.petImages[2]} onClick={() => openModal(pet.petImages[2])} alt="" />
                        </div>

                        {/* OPEN MODAL */}
                        {selectedImage && <ImageModal imageUrl={selectedImage} onClose={closeModal} />}
                    </div>

                    {/* INFORMATION */}
                    <div className='w-full relative bg-[#E9E9E9] p-3 rounded-md sm:px-5'>
                        <img className='p-2 bg-secondary rounded-full w-12 h-12 hover:bg-[#ffffff] duration-200 cursor-pointer absolute top-3 right-3' src={unfavorite} alt="" />
                        <div className='my-2'>
                            <p className='text-3xl font-medium pb-1'>{pet.petName}</p> 
                            <p className='font-medium py-2 text-sm text-[#5D5D5D] flex items-center leading-3'>{pet.petType} <span className='h-1 w-1 mx-2 bg-text rounded-full'></span> {pet.location}</p>   
                        </div>
                        <div className='w-full'>
                            <div className='h-[1px] w-full relative bg-text'></div>
                        </div>
                        <div className='my-2'> 
                            <p className='font-medium py-2 text-sm text-[#5D5D5D] flex items-center'>{pet.age} <span className='h-1 w-1 mx-2 bg-text rounded-full'></span> {pet.gender} <span className='h-1 w-1 mx-2 bg-text rounded-full'></span> {pet.size}</p>   
                        </div>
                        <div className='w-full'>
                            <div className='h-[1px] w-full relative bg-text'></div>
                        </div>
                        <div className='my-2'> 
                            <p className='text-2xl font-medium pt-2'>About</p> 
                            <p className='whitespace-pre-wrap'>{pet.aboutPet}</p>
                        </div>
                    </div>
                </div>

                {/* INTERESTED */}
                <div>
                    <div className={ user.uid != pet.userID ? 'w-[90%] sm:w-96 self-start lg:my-0 lg:rounded-lg shrink-0 lg:w-60 2xl:w-72 mx-auto bg-primary mt-4 mb-7 text-white shadow-custom p-3 rounded-md' : 'hidden'}>
                        <p className='text-lg text-center py-4'>Considering {pet.petName} for adoption?</p>
                        <div className='w-[90%] mx-auto py-3'>
                            <button onClick={() => navigate(`/dashboard/find-pet/adoption/${pet.petID}`)} disabled={isPending} className={`w-full text-sm border-2 border-secondary duration-200 bg-secondary font-semibold text-primary rounded-full py-3 mb-3 ${isPending ? 'cursor-default ' : 'hover:border-[#c74343] hover:bg-[#c74343] hover:text-white'} `}>{isPending ? 'PENDING ADOPTION' : 'START YOUR INQUIRY'}</button>
                            <button onClick={handleFaqsClick} className='w-full text-sm border-2 border-secondary bg-primary font-semibold text-secondary hover:bg-[#c74343] hover:border-[#c74343] duration-200 rounded-full py-3'>READ FAQS</button>
                        </div>
                    </div> 
                    
                    {/* PET OWNER ACTIONS */}
                    <div className={ user.uid === pet.userID ? 'w-[70%] sm:w-96 self-start lg:my-0 lg:rounded-lg shrink-0 lg:w-60 2xl:w-72 mx-auto bg-secondary mt-4 mb-7 text-text shadow-custom p-3 rounded-md' : 'hidden'}>
                        <p className='text-xl font-medium pb-3'>Actions</p>
                        <div className='lg:w-full w-[90%] mx-auto'>
                            <button onClick={handleEditPetClick} className='w-full text-sm hover:bg-[#82ac35] duration-200 bg-[#8FBB3E] font-semibold text-white rounded-lg py-3 mb-2'>EDIT PET</button>
                            <button onClick={() => handleRemovePet(pet.petID, pet.petName)} className='w-full text-sm hover:bg-[#ca4444] duration-200 bg-[#D25A5A] font-semibold text-white rounded-lg py-3'>REMOVE PET</button>
                        </div>
                    </div> 

                    <div onClick={() => navigate(`/dashboard/find-pet`)} className='w-40 hidden lg:flex cursor-pointer hover:bg-[#f0f0f0] duration-150 bg-secondary rounded-lg shadow-custom mt-3 py-2 justify-center items-center font-semibold'>
                        <img className='w-9 mr-3' src={back} alt="" />
                        <p>Go back</p>
                    </div>
                </div>
            </div>

            {/* READ FAQS */}
            <div className={ isFaqsOpen ? 'w-full relative mb-5 bg-secondary shadow-custom sm:rounded-lg h-full lg:py-10 mt-4' : 'hidden'}>
                <img onClick={handleFaqsClick} className='absolute border-2 border-secondary hover:border-text duration-150 cursor-pointer p-1 top-3 right-3' src={close} alt="" />
                <div className='flex flex-col lg:flex-row lg:items-center xl:w-[60rem] xl:mx-auto'>
                    <div className='w-[80%] overflow-hidden mx-auto rounded-lg sm:w-72 mt-14 lg:mt-0 h-80 lg:ml-8 shrink-0'>
                        <img className='w-full h-full object-cover' src={pet.petImages[0]} alt="" />
                    </div>
                    <div className='px-5 sm:px-7 xl:px-10 lg:pb-3 w-full'>
                        <p className='text-2xl lg:text-3xl font-medium py-5'>{pet.petName}'s FAQs</p>
                        <div className='pb-5'>
                            <p className='font-medium lg:text-lg'>How much the adoption fee for {pet.petName}?</p>
                            <p className='text-sm lg:text-base'>{pet.adoptionFee}</p>
                        </div>
                        <div className='pb-5'>
                            <p className='font-medium lg:text-lg'>Is {pet.petName} good with kids?</p>
                            <p className='text-sm lg:text-base'>{pet.goodWithKids}</p>
                        </div>
                        <div className='pb-5'>
                            <p className='font-medium lg:text-lg'>Is {pet.petName} good with other animals?</p>
                            <p className='text-sm lg:text-base'>{pet.goodWithAnimals}</p>
                        </div>
                        <div className='pb-10 lg:pb-0'>
                            <p className='font-medium lg:text-lg'>When and where can I adopt {pet.petName}?</p>
                            <p className='text-sm lg:text-base'>{pet.timeAndPlace}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT PET */}
            <div className={isEditOpen ? 'block' : 'hidden'}>
                <EditPet pet={pet} closeEdit={handleEditPetClick} />
            </div>
        </div>
        
    )
}

export default PetInfo