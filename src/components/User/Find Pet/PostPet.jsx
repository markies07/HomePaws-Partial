import React, { useContext, useState } from 'react'
import close from '../../../assets/icons/close-dark.svg'
import images from './assets/images.svg'
import { addDoc, collection, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../../firebase/firebase'
import { notifySuccessOrange, notifyErrorOrange } from '../../General/CustomToast'
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage'
import { AuthContext } from '../../General/AuthProvider'

function PostPet({closePostPet}) {

    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        petType: 'Cat',
        petName: '',
        age: 'Kitty/Puppy',
        gender: 'Male',
        size: 'Small',
        color: 'Black',
        aboutPet: '',
        ownerName: '',
        ownerAge: '',
        ownerGender: 'Male',
        contactNumber: '',
        fullAddress: '',
    });

    const [petImages, setPetImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setPetImages(files.slice(0, 3));

        if (errors.petImages) {
          setErrors({ ...errors, petImages: '' });
        }
    }

    const validateForm = () => {
        const newErrors = {};
        if (!formData.petName.trim()) newErrors.petName = 'Pet name is required';
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
        if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
        if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Full address is required';
        if (petImages.length === 0) newErrors.petImages = 'At least one image is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submission started');
        if (!validateForm() || isSubmitting) {
            console.log('Form validation failed or is already submitting')
            return;
        }

        setIsSubmitting(true);
        try{
            console.log('Uploading images...');
            const imageUrls = await Promise.all(
                petImages.map(async (image, index) => {
                    console.log(`Uploading image ${index + 1}...`);
                    const imageRef = ref(storage, `pet-images/${Date.now()}-${image.name}`);
                    await uploadBytes(imageRef, image);
                    const url = await getDownloadURL(imageRef);
                    console.log(`Image ${index + 1} uploaded successfully`);
                    return url;
                })
            );
            console.log('All images uploaded successfully');

            console.log('Adding document to Firestore...');
            const docRef = await addDoc(collection(db, 'petsForAdoption'), {
                ...formData,
                petImages: imageUrls,
                petID: '',
                timePosted: serverTimestamp(),
                userID: user.uid,
                status: 'For Adoption',
            });

            await updateDoc(docRef, {
                petID: docRef.id
            });

            console.log('Document written with ID: ', docRef.id);
            notifySuccessOrange('Pet posted successfully!');

            setFormData({
                petType: 'Cat',
                petName: '',
                age: 'Kitty/Puppy',
                gender: 'Male',
                size: 'Small',
                color: 'Black',
                aboutPet: '',
                ownerName: '',
                ownerAge: '',
                ownerGender: 'Male',
                contactNumber: '',
                fullAddress: '',
            });
            setPetImages([]);
        }
        catch (error) {
            console.error("Error adding document: ", error);
            notifyErrorOrange('An error occured. Please try again.');
        }
        finally {
            setIsSubmitting(false);
            console.log('Form submission completed');
        }
    };


    return (
        <div className='w-full h-full lg:pb-4 mt-4'>
            <div className='relative px-4 pb-5 bg-secondary lg:rounded-lg shadow-custom w-full h-full'>
                <img onClick={closePostPet} className='absolute border-2 border-secondary hover:border-text duration-150 cursor-pointer p-1 top-3 right-3' src={close} alt="" />
                <p className='text-center font-medium text-3xl pt-12'>Post Pet for Adoption</p>
                <div className='max-w-[35rem] pb-5 mx-auto flex pt-5 gap-3 sm:gap-5 xl:gap-7'>
                    {/* Display uploaded images */}
                    {/* Code added starts here */}
                    {petImages.length > 0 ? petImages.map((image, index) => (
                        <div key={index} className='bg-[#BCBCBC] rounded-md h-44 sm:h-48 w-full flex justify-center'>
                            <img src={URL.createObjectURL(image)} alt={`Uploaded ${index + 1}`} className='object-cover w-full h-full rounded-md' />
                        </div>
                    )) : (
                        <>
                            <div className='bg-[#BCBCBC] rounded-md h-44 sm:h-48 w-full flex justify-center'>
                                <img className='w-12 lg:w-14' src={images} alt="" />
                            </div>
                            <div className='bg-[#BCBCBC] rounded-md h-44 sm:h-48 w-full flex justify-center'>
                                <img className='w-12 lg:w-14' src={images} alt="" />
                            </div>
                            <div className='bg-[#BCBCBC] rounded-md h-44 sm:h-48 w-full flex justify-center'>
                                <img className='w-12 lg:w-14' src={images} alt="" />
                            </div>
                        </>
                    )}
                    {/* Code added ends here */}
                </div>
                {/* FORM */}
                <form onSubmit={handleSubmit} className='max-w-[40rem] flex flex-col xl:max-w-[45rem] mx-auto'>
                    {/* PET IMAGES INPUT */}
                    <button type='button' onClick={() => document.getElementById('images').click()} className='bg-[#BCBCBC] hover:bg-[#cccccc] px-5 py-2 font-medium mx-auto text-sm rounded-md duration-150'>Upload Images</button>
                    <input id="images" type="file" accept="image/*" multiple onChange={handleImageChange} style={{display: 'none'}}/>
                    {/* PET INFO */}
                    <div className='flex flex-col my-5'>
                        <p className='font-semibold'>Pet Type</p>
                        <select name="petType" value={formData.petType} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-32 py-1 px-1 outline-none font-medium text-text border-2">
                            <option className="text-text py-2" value="Cat">Cat</option>
                            <option className="text-text py-2" value="Dog">Dog</option>
                        </select>
                    </div>
                    <div className='flex flex-col xl:flex-row xl:gap-3'>
                        <div className='flex w-full items-center mb-5 gap-3'>
                            <div className='w-[60%]'>
                                <p className='font-semibold'>Pet Name</p>
                                <input required name="petName" value={formData.petName} onChange={handleInputChange} className='py-1 w-full px-2 border-2 border-text rounded-md' type="text" id="" />
                                {errors.petName && <p className="text-red-500 text-sm mt-1">{errors.petName}</p>}
                            </div>
                            <div className='flex flex-col w-[40%]'>
                                <p className='font-semibold'>Age</p>
                                <select name="age" value={formData.age} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                    <option className="text-text py-2" value="Kitty/Puppy">Kitty/Puppy</option>
                                    <option className="text-text py-2" value="Young">Young</option>
                                    <option className="text-text py-2" value="Adult">Adult</option>
                                    <option className="text-text py-2" value="Senior">Senior</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex w-full items-center mb-5 gap-3'>
                            <div className='flex flex-col w-full'>
                                <p className='font-semibold'>Gender</p>
                                <select name="gender" value={formData.gender} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                    <option className="text-text py-2" value="Male">Male</option>
                                    <option className="text-text py-2" value="Female">Female</option>
                                </select>
                            </div>
                            <div className='flex flex-col w-full'>
                                <p className='font-semibold'>Size</p>
                                <select name="size" value={formData.size} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                    <option className="text-text py-2" value="Small">Small</option>
                                    <option className="text-text py-2" value="Medium">Medium</option>
                                    <option className="text-text py-2" value="Large">Large</option>
                                </select>
                            </div>
                            <div className='flex flex-col w-full'>
                                <p className='font-semibold'>Color</p>
                                <select name="color" value={formData.color} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                    <option className="text-text py-2" value="Black">Black</option>
                                    <option className="text-text py-2" value="White">White</option>
                                    <option className="text-text py-2" value="Brown">Brown</option>
                                    <option className="text-text py-2" value="Gray">Gray</option>
                                    <option className="text-text py-2" value="Orange">Orange</option>
                                    <option className="text-text py-2" value="Multi-Color">Multi-Color</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center mb-5 gap-3'>
                        <div className='w-full'>
                            <p className='font-semibold'>About the pet</p>
                            <textarea required name="aboutPet" value={formData.aboutPet} onChange={handleInputChange} className='py-1 w-full h-40 px-2 border-2 border-text rounded-md' placeholder='(e.g., pet health condition, pet behavior)'></textarea>
                        </div>
                    </div>
                    <div className='w-full my-5'>
                        <div className='h-[2px] w-full relative bg-text'></div>
                    </div>

                    {/* OWNER INFO */}
                    <div className='flex flex-col mb-5 gap-3'>
                        <p className='text-2xl font-semibold pb-3'>Owner's Information</p>
                        <div className='flex flex-col xl:flex-row xl:gap-3'>
                            <div className='flex w-full gap-3 pb-5 xl:pb-3'>
                                <div className='w-[75%]'>
                                    <p className='font-semibold'>Full Name</p>
                                    <input name="ownerName" value={formData.ownerName} onChange={handleInputChange} required className='py-1 w-full px-2 border-2 border-text rounded-md' type="text" />
                                </div>
                                <div className='flex flex-col w-[25%]'>
                                    <p className='font-semibold'>Age</p>
                                    <input name="ownerAge" value={formData.ownerAge} onChange={handleInputChange} required className='py-1 w-full px-2 border-2 border-text rounded-md' type="number" />
                                </div>
                            </div>
                            <div className='flex w-full gap-3 pb-2'>
                                <div className='w-[40%]'>
                                    <p className='font-semibold'>Gender</p>
                                    <select name="ownerGender" value={formData.ownerGender} onChange={handleInputChange} className="border-text rounded-md sm:text-base w-full py-1 px-1 outline-none font-medium text-text border-2">
                                        <option className="text-text py-2" value="Male">Male</option>
                                        <option className="text-text py-2" value="Female">Female</option>
                                    </select>
                                </div>
                                <div className='flex flex-col w-[60%]'>
                                    <p className='font-semibold'>Contact No.</p>
                                    <input required name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className='py-1 w-full px-2 border-2 border-text rounded-md' type="number" />
                                </div>
                            </div>
                        </div>
                        <div className='w-full gap-3 pb-2'>
                            <p className='font-semibold'>Full Address</p>
                            <input name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} required className='py-1 w-full px-2 border-2 border-text rounded-md' type="text" />
                        </div>
                    </div>
                    <div className='w-full flex pb-5 justify-center'>
                        <button type='submit' disabled={isSubmitting} className='text-center bg-primary hover:bg-primaryHover px-5 py-2 rounded-md font-medium text-white'>{isSubmitting ? 'POSTING...' : 'POST'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostPet