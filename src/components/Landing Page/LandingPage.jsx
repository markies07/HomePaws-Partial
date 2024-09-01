import React, { useContext } from 'react'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
import Login from './Login'
import CreateAccount from './CreateAccount'
import AccountForm from './AccountForm'
import Cards from './Cards'
import LoginForm from './LoginForm'
import Dog from './Dogs'
import { useSelector, useDispatch } from 'react-redux';
import { 
  toggleLogin, closeLogin, 
  toggleCreate, closeCreate, 
  toggleIsLogin, closeIsLogin, 
  toggleDog, closeDog 
} from '../../store/uiSlice';
import { AuthContext } from '../General/AuthProvider'
import { Navigate } from 'react-router-dom'

function LandingPage() {

  const { user } = useContext(AuthContext);

  if (user) {
      return <Navigate to="/dashboard" />; // Redirect to the landing page if not logged in
  }

  const dispatch = useDispatch();
  const isLoginOpen = useSelector(state => state.ui.isLoginOpen);
  const isCreateOpen = useSelector(state => state.ui.isCreateOpen);
  const isLogin = useSelector(state => state.ui.isLogin);
  const isDogOpen = useSelector(state => state.ui.isDogOpen);

  return (
    <div className='relative min-h-screen flex flex-col select-none'>
      < AccountForm />
      < Cards />
      < Dog isOpen={isDogOpen} isClose={() => dispatch(closeDog())} onLoginClick={() => dispatch(toggleLogin())}/>
      < CreateAccount createOpen={isCreateOpen} createClose={() => dispatch(closeCreate())} />
      < LoginForm loginOpen={isLogin} loginClose={() => dispatch(closeIsLogin())} />
      < Login 
        isOpen={isLoginOpen} 
        onClose={() => dispatch(closeLogin())} 
        handleCreateClick={() => dispatch(toggleCreate())} 
        handleLogin={() => dispatch(toggleIsLogin())} 
      />
      <div className='bg-[#FAFAFA] relative'>
        {isLoginOpen && (<div onClick={() => dispatch(closeLogin())}  className='fixed inset-0 duration-150 bg-black opacity-50 z-20'></div>)}
        < Header onLoginClick={() => dispatch(toggleLogin())} />
        < Content onLoginClick={() => dispatch(toggleLogin())} openDog={() => dispatch(toggleDog())}/>
        < Footer />
      </div>
    </div>
  )
}

export default LandingPage
