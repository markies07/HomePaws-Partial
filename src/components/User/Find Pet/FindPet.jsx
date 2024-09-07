import React, { useState } from 'react'
import Options from './Options'
import Pets from './Pets'
import PostPet from './PostPet'

function FindPet() {
  const [postPetOpen, setPostPetOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const handleClickPetOpen = () => {
    setPostPetOpen(!postPetOpen);
  }

  const handleFilterChange = (select) => {
    setFilter(select);
}

  return (
    <div className='flex-grow flex flex-col gap-1 items-center lg:items-start lg:flex-row'>
      <div style={{display: postPetOpen ? 'none' : 'flex'}} className='flex-col w-full lg:flex-row mx-auto'>
        <div className='order-1 lg:order-2'>
          <Options openPostPet={handleClickPetOpen} changeFilter={handleFilterChange} selected={filter}  />
        </div>
        <div className='order-2 lg:order-1 justify-center flex mx-auto flex-grow sm:rounded-lg lg:rounded-lg bg-secondary shadow-custom mt-3 lg:mt-4 w-full sm:w-[90%] lg:w-full lg:mr-[11.5rem] xl:mr-[12.6rem] 2xl:mr-[13.6rem]'>
          <Pets selected={filter} />    
        </div>
      </div>
      <div style={{display: postPetOpen ? 'block' : 'none'}} className='w-full hidden'>
        <PostPet closePostPet={handleClickPetOpen} />
      </div>
    </div>
  )
}

export default FindPet