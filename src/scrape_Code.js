// why did use state failed in this code would set the state as null before updating the code form api call. 

const auth = getAuth()

    const [changeDetails, setChangeDetails] = useState(false)
    const [loading, setLoading] = useState(true)
    
    const[listing, setListing] = useState(null)

    const [formData, setFormData] = useState({
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
    })

    const { name, email} = formData;

    // if we are bringing in something out side of the useEffect then it becomes a dependencies
    console.log(loading)
    useEffect(() =>{

        const fetchUserListings = async () => {
          const listingsRef = collection(db, 'listings')
    
          const q = query(
            listingsRef,
            where('userRef', '==', auth.currentUser.uid),
            orderBy('timestamp', 'desc')
          )
    
          const querySnap = await getDocs(q)
    
          let listings = []
    
          querySnap.forEach((doc) => {
            return listings.push({
              id: doc.id,
              data: doc.data()
            })

            
          })
          console.log(listings)
          setListing(listings)
          setLoading(false)
        }
        
    fetchUserListings()

    }, [auth.currentUser.uid])

   
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

    const onDelete = async (listingId) => {
        if(window.confirm('Are you sure you want to delete?')) {
          await deleteDoc(doc(db, "listings", listingId))
          const updatedListings = listing.filter((listing)=> listing.id !== listingId)
          setListing(updatedListings)
          toast.success('Successfully deleted listing')
        }
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

          {!loading && listing?.length > 0 &&  (
            <>
              <p className="listingText">Your Listings</p>
              <ul className="listingsList">
                {listing.map((listing) => {
                  <ListingsComponent
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  />

                })}
              </ul>
            </>
          )}
        </main>
    </div>
  )