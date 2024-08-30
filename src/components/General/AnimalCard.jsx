import React from 'react'
import rudolf from '../../assets/images/pets/rudolf.jpg'
import cheeto from '../../assets/images/pets/cheeto.jpg'
import tigress from '../../assets/images/pets/tigress.jpg'
import unfavorite from '../../assets/icons/unfavorite.svg'

function AnimalCard({ onLoginClick }) {
  return (
    <>
      <div onClick={onLoginClick} className='w-full duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959] max-w-48 relative h-64 flex flex-col drop-shadow-lg rounded-xl overflow-hidden'>
        <img draggable='false' className='h-full w-full object-cover' src={rudolf} alt="" />
        <img className='absolute bottom-12 right-2 hover:opacity-100 opacity-85 duration-150 bg-[#FAFAFA] z-10 w-12 h-12 rounded-full p-2' src={unfavorite} alt="" />
        <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>Rudolf</p>
      </div>
      <div onClick={onLoginClick} className='w-full duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959] max-w-48 relative h-64 flex flex-col drop-shadow-lg rounded-xl overflow-hidden'>
        <img draggable='false' className='h-full w-full object-cover' src={cheeto} alt="" />
        <img className='absolute bottom-12 right-2 hover:opacity-100 opacity-85 duration-150 bg-[#FAFAFA] z-10 w-12 h-12 rounded-full p-2' src={unfavorite} alt="" />
        <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>Cheeto</p>
      </div>
      <div onClick={onLoginClick} className='w-full duration-150 cursor-pointer border-2 border-transparent hover:border-[#F75959] max-w-48 relative h-64 flex flex-col drop-shadow-lg rounded-xl overflow-hidden'>
        <img draggable='false' className='h-full w-full object-cover' src={tigress} alt="" />
        <img className='absolute bottom-12 right-2 hover:opacity-100 opacity-85 duration-150 bg-[#FAFAFA] z-10 w-12 h-12 rounded-full p-2' src={unfavorite} alt="" />
        <p className='absolute font-medium flex justify-center items-center text-[#5D5D5D] bottom-0 bg-[#FAFAFA] w-full h-10'>Tigress</p>
      </div>
    </>
  )
}

export default AnimalCard