import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {ReactComponent as googleIcon} from '../assets/svg/googleIcon.svg'

// ////////////////////////  All Firebase ///////////////////
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {db} from '../firebase.config'



function OAuth() {
    const navigate = useNavigate();
    const location = useLocation();

  return <div className='socialLogin'>
    <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with:</p>

    <button className='socialIconDiv'></button>
  </div>
  
}

export default OAuth