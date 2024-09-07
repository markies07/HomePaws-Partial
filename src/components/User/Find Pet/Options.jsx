import React, { useState } from 'react'
import post from '../assets/post.svg'
import filter from '../assets/filter.svg'
import close from '../../../assets/icons/close-dark.svg'

function Options({openPostPet, changeFilter, selected}) {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
  }
  const closeFilter = () => {
    setFilterOpen(!filterOpen);
  }


  return (
    <div className='relative px-2 pt-3 lg:pt-4 mr-1'>
      {/* MOBILE VIEW */}
      <div className='flex gap-1 sm:gap-3 justify-center lg:hidden'>
        <div className='bg-secondary pl-3 pr-4 py-2 gap-2 flex justify-center items-center rounded-lg shadow-custom'>
          <img onClick={openPostPet} src={post} className='p-1 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
          <p className='font-medium leading-4'>Post Pet</p>
        </div>
        <div className='bg-secondary px-2 sm:px-3 py-2 gap-2 sm:gap-3 flex justify-center items-center rounded-lg shadow-custom'>
          <button onClick={() => changeFilter('All')} className={`font-medium px-1 ${selected === 'All' ? 'text-white bg-primary rounded-md' : ''} `}>All</button>
          <button onClick={() => changeFilter('Dogs')} className={`font-medium px-1 ${selected === 'Dogs' ? 'text-white bg-primary rounded-md' : ''} `}>Dogs</button>
          <button onClick={() => changeFilter('Cats')} className={`font-medium px-1 ${selected === 'Cats' ? 'text-white bg-primary rounded-md' : ''} `}>Cats</button>
        </div>
        <div className='bg-secondary px-3 sm:pr-4 py-2 gap-3 flex justify-center items-center rounded-lg shadow-custom'>
          <img onClick={handleFilterClick} src={filter} className='w-11 p-2 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
          <p className='font-medium hidden sm:block'>Filter</p>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className='gap-3 justify-center hidden fixed lg:flex right-0 mr-3 flex-col w-48 xl:w-52 2xl:w-56'>
        <div className='bg-secondary px-2 py-3 xl:gap-2 gap-1 flex justify-center items-center rounded-lg shadow-custom'>
          <button className='font-medium bg-primary text-white px-2 rounded-md'>All</button>
          <button className='font-medium px-2 rounded-md'>Dogs</button>
          <button className='font-medium px-2 rounded-md'>Cats</button>
        </div>
        <div className='bg-secondary pl-3 pr-4 py-2 gap-4 flex justify-start items-center rounded-lg shadow-custom'>
          <img onClick={handleFilterClick} src={filter} className='w-11 p-2 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
          <p className='font-medium whitespace-nowrap '>Filter</p>
        </div>
        <div className='bg-secondary pl-3 pr-4 py-2 gap-4 flex justify-start items-center rounded-lg shadow-custom'>
          <img onClick={openPostPet} src={post} className='p-1 bg-[#E9E9E9] rounded-lg cursor-pointer hover:bg-[#dbdbdb] duration-150' alt="" />
          <p className='font-medium whitespace-nowrap '>Post Pet</p>
        </div>
      </div>

      {/* FILTER */}
      <div 
      style={{
        right: filterOpen ? '0' : '-20rem',
        transition: 'right 0.5s ease-in-out',
      }}
      className='fixed px-5 lg:px-4 py-5 z-10 top-36 lg:top-20 bg-secondary shadow-custom h-full lg:w-60 xl:w-72'>
        <div className='w-full flex justify-end'>
          <img onClick={closeFilter} className='w-8 p-1 border-2 border-secondary hover:border-text cursor-pointer duration-150' src={close} alt="" />
        </div>
        <p className='font-semibold text-2xl'>Filter:</p>
        <div className='mt-3'>
          <div className='flex flex-col mb-4'>
            <p className='text-center font-medium'>AGE</p>
            <select name="age" id="" className="border-text rounded-md sm:text-base w-52 lg:w-full py-2 px-1 outline-none font-medium text-text border-2">
                <option className="text-text py-5" value="Any">Any</option>
                <option className="text-text py-5" value="Puppy">Puppy/Kitty</option>
                <option className="text-text py-5" value="Young">Young</option>
                <option className="text-text py-5" value="Adult">Adult</option>
                <option className="text-text py-5" value="Senior">Senior</option>
            </select>
          </div>
          <div className='flex flex-col mb-4'>
            <p className='text-center font-medium'>GENDER</p>
            <select name="gender" id="" className="border-text rounded-md sm:text-base w-52 lg:w-full py-2 px-1 outline-none font-medium text-text border-2">
                <option className="text-text py-5" value="Any">Any</option>
                <option className="text-text py-5" value="Male">Male</option>
                <option className="text-text py-5" value="Female">Female</option>
            </select>
          </div>
          <div className='flex flex-col mb-4'>
            <p className='text-center font-medium'>SIZE</p>
            <select name="size" id="" className="border-text rounded-md sm:text-base w-52 lg:w-full py-2 px-1 outline-none font-medium text-text border-2">
                <option className="text-text py-5" value="Any">Any</option>
                <option className="text-text py-5" value="Small">Small</option>
                <option className="text-text py-5" value="Medium">Medium</option>
                <option className="text-text py-5" value="Large">Large</option>
                <option className="text-text py-5" value="Extra Large">Extra Large</option>
            </select>
          </div>
          <div className='flex flex-col mb-4'>
            <p className='text-center font-medium'>Color</p>
            <select name="carebehavior" id="" className="border-text rounded-md sm:text-base w-52 lg:w-full py-2 px-1 outline-none font-medium text-text border-2">
                <option className="text-text py-5" value="Any">Any</option>
                <option className="text-text py-5" value="Black">Black</option>
                <option className="text-text py-5" value="White">White</option>
                <option className="text-text py-5" value="Brown">Brown</option>
                <option className="text-text py-5" value="Gray">Gray</option>
                <option className="text-text py-5" value="Orange">Orange</option>
                <option className="text-text py-5" value="Multi-Color">Multi-Color</option>
            </select>
          </div>
        </div>
        <div className='flex justify-center mt-7'>
          <button className='font-medium text-white bg-text py-2 px-4 rounded-md hover:opacity-90 duration-150'>FILTER</button>
        </div>
      </div>
    </div>
  )
}

export default Options