import React from 'react'
import {useState} from 'react';
import{Link, useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from '../../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../../../src/assets/svg/visibilityIcon.svg';


// ////////////////  firebase imports  /////////////////////////////

import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {db} from '../../firebase.config';
import { setDoc, doc, serverTimesStamp} from 'firebase/firestore'

// /////////////////////////////////////////////////



function SignUp() {
  const[showPassword,setShowPassword] = useState(false)

  const [formData,setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const {name, email, password} = formData;

const navigate = useNavigate();

// ///////////////////////////////////////////////////

const onChange = (e) => {
  
  setFormData((prevState) => ({
    ...prevState,
    [e.target.id]: e.target.value,
  }))
}

// /////////////////  User Auothinification -- Firebase ///////////////////////

const onSubmit = async (e) => {
  e.preventDefault()

  try{

    const auth = getAuth()

    const userCredential = await createUserWithEmailAndPassword(
      auth, email, password)

    const user = userCredential.user 
    
    updateProfile(auth.currentUser, {displayName: name})

    // ///////////////  Data Send to Firebase ///////////////////////////
    
    
    // ////// We make make a copy of an object by 

    navigate('/')

  } catch(error){
    console.log(error)
  }

}

// ///////////////////////////////////////////////////////

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
          </header>

          <main>

            <form form onSubmit={onSubmit}>

              <input type="text" className="nameInput" placeholder="Enter Name" id="name" value={name} onChange={onChange} />

              <input type="email" className="emailInput" placeholder="Enter Email" id="email" value={email} onChange={onChange} />

              <div className="passwordInputDiv">

                <input type={showPassword ? "text" : "password"} className="passwordInput" placeholder="Password" id="password" value={password} onChange={onChange}/>

                <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword((prevState) => !prevState)}/>
              </div>

              <Link to="/forgot-password" className="forgotPasswordLink">
                Forget Password 
              </Link>

              <div className="signUpBar">
                <p className="signUpText">
                  Sign Up
                </p>
                <button className="signUpButton">
                  <ArrowRightIcon fill="#ffffffff" width="34px" height="34px" />

                </button>
              </div>
            </form>

            {/* Google OAuth */}

            <Link to="/sign-in" className="registerLink">Sign In Instead</Link>

          </main>
      </div>
    </>
    
  )
}

export default SignUp