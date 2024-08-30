import React, { useState } from 'react'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
import Login from './Login'
import CreateAccount from './CreateAccount'
import AccountForm from './AccountForm'
import Cards from './Cards'
import LoginForm from './LoginForm'
import Pick from './Pick'

function LandingPage() {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isPick, setIsPick] = useState(false);

  const handleLoginClick = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const handleClose = () => {
    setIsLoginOpen(false);
  };

  const handleCreateClick = () => {
    setIsCreateOpen(!isCreateOpen);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

  const handleLogin = () => {
    setIsLogin(!isCreateOpen);
  };

  const handleCloseLogin = () => {
    setIsLogin(false);
  };

  const handlePick = () => {
    setIsPick(!isPick);
  };

  const handleClosePick = () => {
    setIsPick(false);
  };



  return (
    <div className='relative min-h-screen flex flex-col select-none'>
      < AccountForm />
      < Cards />
      < Pick pickOpen={isPick} pickClose={handleClosePick} />
      < CreateAccount createOpen={isCreateOpen} createClose={handleCloseCreate} />
      < LoginForm loginOpen={isLogin} loginClose={handleCloseLogin} />
      < Login isOpen={isLoginOpen} onClose={handleClose} handleCreateClick={handleCreateClick} handleLogin={handleLogin}/>
      <div className='bg-[#FAFAFA] relative'>
        {isLoginOpen && (<div className='fixed inset-0 duration-150 bg-black opacity-50 z-20'></div>)}
        < Header onLoginClick={handleLoginClick} />
        < Content onLoginClick={handleLoginClick} onPickClick={handlePick}/>
        < Footer />
      </div>
    </div>
  )
}

export default LandingPage