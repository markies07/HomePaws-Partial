import React from 'react'
import close from './assets/close.svg'
import check from './assets/check.svg'
import complete from './assets/complete.svg'
import comment from './assets/white-comment.svg'
import schedule from './assets/schedule.svg'
import whiteApplication from './assets/white-application.svg'
import paw from './assets/white-paw.svg'
import cancel from './assets/cancel.svg'

function AcceptedApplication() {
    return (
        <div className='pt-[9.75rem] relative lg:pt-[5.75rem] lg:pl-48 xl:pl-[13.8rem] lg:pr-[13px] sm:px-3 lg:ml-4 min-h-screen flex flex-col font-poppins text-text'>
          <div className='bg-secondary flex flex-col mb-3 pt-3 overflow-hidden flex-grow sm:pt-5 relative w-full shadow-custom h-full sm:rounded-md lg:rounded-lg'>
                <img className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
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
                            {/* <img className='w-5 h-5' src={check} alt="" /> */}
                        </div>
                        <p className='text-xs md:text-base leading-3 md:leading-tight font-semibold text-center py-2 order-1 sm:order-2'>Meet Up<br />Scheduled</p>
                    </div>
                    {/* 3RD PROGRESS */}
                    <div className='flex z-10 items-center flex-col self-end sm:self-auto sm:pt-5 justify-center'>
                        <div className='w-8 h-8 sm:w-10 sm:h-10 bg-primary flex justify-center items-center rounded-full'>
                            {/* <img className='w-5 h-5' src={check} alt="" /> */}
                        </div>
                        <p className='text-xs md:text-base leading-3 md:leading-tight font-semibold text-center py-2'>Day of<br />Meet Up</p>
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
                        <div className='w-full h-3 bg-[#D9D9D9] border-r-2'></div>
                        <div className='w-full h-3 bg-[#D9D9D9] border-r-2'></div>
                        <div className='w-full h-3 bg-[#D9D9D9] border-r-2'></div>
                    </div>
                </div>

                {/* STATUS */}
                <div className='w-full mt-7 sm:px-5 2xl:w-[90%] 2xl:mx-auto'>
                    <div className='w-full py-3 px-3 gap-2 md:gap-0 flex-col md:flex-row sm:px-5 flex justify-between items-center rounded-md lg:rounded-lg bg-[#E9E9E9]'>
                        <div className='flex md:flex-col sm:text-lg md:gap-0 lg:flex-row lg:gap-2 gap-2'>
                            <p className='font-semibold'>Status:</p>
                            <p>11 more days until meet up</p>
                        </div>
                        <div className='flex gap-2'>
                            <button className='flex bg-[#80A933] text-xs md:text-base cursor-pointer duration-150 hover:bg-[#769c2f] items-center font-medium gap-2 text-white p-2 rounded-md'><img className='w-5 h-5' src={paw} alt="" />Rehome Complete</button>
                            <button className='flex bg-[#D25A5A] text-xs md:text-base cursor-pointer duration-150 hover:bg-[#c25454] items-center font-medium gap-2 text-white p-2 rounded-md'><img className='w-4 h-4' src={cancel} alt="" />Cancel Rehome</button>
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
                                    <img className='w-32 shrink-0 h-auto rounded-lg bg-text' src="" alt="" />
                                    <div className='w-full flex flex-col gap-2'>
                                        <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                            <p className='font-semibold'>Pet Name:</p>
                                            <p>Luffy</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className='bg-secondary w-[50%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Pet Type:</p>
                                                <p>Dog</p>
                                            </div>
                                            <div className='bg-secondary w-[50%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Age:</p>
                                                <p>Young</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Pet Owner:</p>
                                    <p>Mark Christian M. Naval</p>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Full Address:</p>
                                    <p>Pasong Kawayan 2 General Trias, Cavite </p>
                                </div>
                            </div>
                            <div className='pt-5 pb-2 flex justify-center gap-2'>
                                <button className='flex bg-[#6AAAAA] cursor-pointer duration-150 hover:bg-[#D3D3D3] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md'><img className='w-4 h-4' src={comment} alt="" />Message Owner</button>
                                <button className='flex bg-[#6AAAAA] cursor-pointer duration-150 hover:bg-[#D3D3D3] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md'><img className='w-4 h-4' src={schedule} alt="" />Meet up Schedule</button>
                            </div>
                        </div>
                    </div>

                    {/* ADOPTER DETAILS */}
                    <div className='w-full sm:px-5 lg:px-0 lg:w-1/2 pb-5 lg:order-1'>
                        <div className='w-full p-3 sm:px-5 rounded-md lg:rounded-lg bg-[#E9E9E9]'>
                            <p className='text-center text-xl font-semibold'>Adopter Details</p>

                            <div className='flex flex-col gap-2 mt-4 text-sm sm:text-base'>
                                <div className='flex w-full gap-2'>
                                    <img className='w-32 shrink-0 h-auto rounded-lg bg-text' src="" alt="" />
                                    <div className='w-full flex flex-col gap-2'>
                                        <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                            <p className='font-semibold'>Full Name:</p>
                                            <p>Lorena Flores</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <div className='bg-secondary w-[30%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Age:</p>
                                                <p>24</p>
                                            </div>
                                            <div className='bg-secondary w-[70%] shadow-custom p-2 sm:p-3 rounded-md'>
                                                <p className='font-semibold'>Contact No:</p>
                                                <p>29834797824</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Full Address:</p>
                                    <p>Pasong Camacille General Trias, Cavite</p>
                                </div>
                                <div className='bg-secondary w-full shadow-custom p-2 sm:p-3 rounded-md'>
                                    <p className='font-semibold'>Commitment:</p>
                                    <p>Pangako na aalagaan ko ng maayos at mabuti ang pet na ipapa adopt nyo sakin, salamat po</p>
                                </div>
                            </div>
                            <div className='pt-5 pb-2 flex justify-center gap-2'>
                                <button className='flex bg-[#6AAAAA] cursor-pointer duration-150 hover:bg-[#6b6b6b] items-center text-xs md:text-base font-medium gap-2 text-white p-2 rounded-md'><img className='w-4 h-4' src={whiteApplication} alt="" />View Application</button>
                            </div>
                        </div>
                    </div>
                </div>


          </div>
      </div>
    )
}

export default AcceptedApplication