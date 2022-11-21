import React, { useState } from 'react'
import { useNavigate, Link} from 'react-router-dom'


// ///////  Getting user authorization information ////////
import {getAuth, updateProfile} from 'firebase/auth'

import {updateDoc, doc} from 'firebase/firestore'
import {db} from '../../firebase.config'

import { toast } from 'react-toastify'

// /////////////////  SVG import //////////////
import arrowRight from '../../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../../assets/icons8-house-24.png'


function Profile() {

    const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)

    const [formData, setFormData] = useState({
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
    })

    const { name, email} = formData;


    const onLogout = async (e) => {
      auth.signOut();
      navigate('/')
    }

    const navigate = useNavigate()

    // useEffect(() => {
    //   setUser(auth.currentUser);
    // })

    const onSubmit = async () => {
      
      try{
          if(auth.currentUser.displayName !== name){
            // We want to update displayname in fb
            await updateProfile(auth.currentUser, {
              displayName: name
            })

            // update in firestore
            const userRef = doc(db, 'users', auth.currentUser.uid)
            await updateDoc(userRef, {
              name
            })
          }
      } catch(error){
        toast.error('Could not update profile details')
      }
    }


    const onChange = (e) => {
      setFormData((prevState)=>({
        ...prevState,
        [e.target.id]: e.target.value,

      }))
    }

  return (
    <div className='profile'>
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button type="button" className="logOut" onClick={onLogout}>LOGOUT</button>
        </header>

        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>

            {/* the paragraph changes b between done and based on changeDetails since changeDetail */}
            <p className="changePersonalDetails" onClick={ () => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState)
            }}>
              {changeDetails ? 'done' : 'change'}
            </p>

          </div>
          <div className="profileCard">
            <form>

              {/* input for changing the name  */}
              <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange} />

              {/* input for changing the email */}
              <input type="text" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange} />

            </form>
          </div>

          <Link to='/create-listing' className='createListing'>
           <img src={homeIcon} alt='home' />
           <p>Sell or rent your home</p> 
           <img src={arrowRight} alt='arrow right'/>
          </Link>
        </main>
    </div>
  )
}

export default Profile