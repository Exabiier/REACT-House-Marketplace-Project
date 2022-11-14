import React, { useEffect, useState } from 'react'


// ///////  Getting user authorization information ////////
import {getAuth} from 'firebase/auth'

function Profile() {
  
    const [user, setUser] = useState(null)

    const auth = getAuth()

    useEffect(() => {
      setUser(auth.currentUser);
    })



  return (
    user ? <h1>{user.displayName}</h1> : 'Not Logged In'
  )
}

export default Profile