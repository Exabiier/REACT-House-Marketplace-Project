import React from 'react'
import {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../Components/Spinner'
import { toast } from 'react-toastify'

// ////////////////// Firebase //////////////////
import {getAuth, onAuthStateChanged} from 'firebase/auth'

// ////////////////// For File upload ///////////
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {db} from '../../firebase.config'

// ////////////// uuid v4 //////////////

import {v4 as uuidv4} from 'uuid'

function Createlistings() {

    const[geolocationEnabled, setGeolocationEnabled] = useState(true)

    const[loading, setLoading] = useState(false)

    const[formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })

    const {type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude} = formData

const auth = getAuth()
const navigate = useNavigate()
const isMounted = useRef(true)

useEffect(() => {

    if(isMounted){

        onAuthStateChanged(auth, (user) =>{

            if(user){

                setFormData({...formData, userRef: user.uid})

            } else{ 

                navigate("/sign-in")

            }
        })

    }

    return () =>{
        isMounted.current =false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[isMounted])

const onSubmit = async (e) =>{
    e.preventDefault();

    setLoading(true)

    if(discountedPrice >= regularPrice ){
        setLoading(false)
        toast.error('Discounted price needs to be less than regular price')
        return;
    }

    if(images.length > 6){
        setLoading(false)
        toast.error('Max 6 images')
    }

    // geo-code
    let geolocation ={};
    let location;

    if(geolocationEnabled){
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_API}`)

        const data = await response.json()

        // getting the geo-location from 
        // the Geolocation will not work if the ? are not put in place why. i dont know
        geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;

        geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

        // If the status is Zero result. 
        location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address

        

        // Message for if the adress does not exists
    if (location === undefined || location.includes('undefined')){
        setLoading(false);
        toast.error('Please enter a correct address');
        return;
    }

    } else {
       geolocation.lat = latitude
       geolocation.lat = longitude
       location = address
    }

// /////////////  Store images in fire base  //////////////////
  const storeImage = async (image) => {

    // When we complete a promise its a resolve, and if there is an error its rejected ////
    return new Promise((resolve, reject) => {

        // What storage we are using.
        const storage = getStorage()

        // for the the file name we get the users id, image name, then we make a uniique id number for it. 
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

        // this is th path where we get the images. This is the refereance to were the imagaes are really stored
        const storageRef = ref(storage, 'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                
                switch (snapshot.state) {
                case 'paused':
                   
                    break;
                case 'running':
                    
                    break;
                }
            }, 
            (error) => {
                // we put the reject varaible in here
               reject(error)
            }, 
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // we put the resolve() Method here. 
                    resolve(downloadURL)
                
                });
            }
            );

    })
  }

  const imgUrls = await Promise.all([...images].map((image)=> storeImage(image))).catch(() => {
    setLoading(false);
    toast.error('Images could not be uploaded')
    return
  })

    
    setLoading(false)
}

const onMutate = (e) =>{

    let boolean = null

    if(e.target.value === 'true'){
        boolean = true
    }
    if(e.target.value === 'false'){
        boolean =false
    }

// Files
    if(e.target.files) {
        setFormData((prevState) => ({
            ...prevState,
            images: e.target.files
        }))
    }

        //  Text/Booleans/Numbers
        // We do this because if it is not a file or if it is nul still after the other if statement then
        //  We will set the value of what-ever is used to the object that we have: 
        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
    }
}


if(loading){
    return <Spinner />
}


  return (
    <div className='profile'>
        <header>
            <p className="pageHeader">
              Create a Listing  
            </p>
        </header>

        <main>
                <form onSubmit={onSubmit}>

                    {/* the button for sale or rent */}
                    <label className="formLabel">Sell / Rent</label>

                    <div className="formButtons">
                        {/* Buttons or on click because we click them */}
                        <button
                            type='button'
                            className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='sale'
                            onClick={onMutate}
                            >
                            Sell
                            </button>
                            <button
                            type='button'
                            className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='rent'
                            onClick={onMutate}
                            >
                            Rent
                        </button>
                    </div>

                {/* inputs will be on the onChange because we type in inputs */}
                    <label className='formLabel'>Name</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='name'
                        value={name}
                        onChange={onMutate}
                        maxLength='32'
                        minLength='10'
                        required
                    />


                    {/* Room listings Section Bathrooms, and Bedrooms */}
                    <div className='formRooms flex'>
                        <div>
                        <label className='formLabel'>Bedrooms</label>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='bedrooms'
                            value={bedrooms}
                            onChange={onMutate}
                            min='1'
                            max='50'
                            required
                        />
                        </div>
                        <div>
                        <label className='formLabel'>Bathrooms</label>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='bathrooms'
                            value={bathrooms}
                            onChange={onMutate}
                            min='1'
                            max='50'
                            required
                        />
                        </div>
                    </div>



                        {/* This is for the Parking Section */}

                        <label className='formLabel'>Parking spot</label>
                        <div className='formButtons'>
                            <button
                            className={parking ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='parking'
                            value={true}
                            onClick={onMutate}
                            min='1'
                            max='50'
                            >
                            Yes
                            </button>
                            <button
                            className={
                                !parking && parking !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='parking'
                            value={false}
                            onClick={onMutate}
                            >
                            No
                            </button>
                        </div>




                        {/* This is for the furnishing Section */}

                        <label className='formLabel'>Furnished</label>
                        <div className='formButtons'>
                            <button
                            className={furnished ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='furnished'
                            value={true}
                            onClick={onMutate}
                            >
                            Yes
                            </button>
                            <button
                            className={
                                !furnished && furnished !== null
                                ? 'formButtonActive'
                                : 'formButton'
                            }
                            type='button'
                            id='furnished'
                            value={false}
                            onClick={onMutate}
                            >
                            No
                            </button>
                        </div>




                        {/* The adress Section for the form   */}
                        <label className='formLabel'>Address</label>
                        <textarea
                            className='formInputAddress'
                            type='text'
                            id='address'
                            value={address}
                            onChange={onMutate}
                            required
                        />

                        {!geolocationEnabled && (
                            <div className='formLatLng flex'>
                            <div>
                                <label className='formLabel'>Latitude</label>
                                <input
                                className='formInputSmall'
                                type='number'
                                id='latitude'
                                value={latitude}
                                onChange={onMutate}
                                required
                                />
                            </div>
                            <div>
                                <label className='formLabel'>Longitude</label>
                                <input
                                className='formInputSmall'
                                type='number'
                                id='longitude'
                                value={longitude}
                                onChange={onMutate}
                                required
                                />
                            </div>
                            </div>
                        )}


                    {/* This is the offer Section */}
                    <label className='formLabel'>Offer</label>
                        <div className='formButtons'>
                    {/* Buttons or on click because we click them */}
                    {/* When it comes to yes or no questions we can use true or false questions */}
                    {/* We have to set the value as true or false so we can pick which button we want to glow */}
                    {/* Buttons can have the same id */}
                            <button
                                    className={offer ? 'formButtonActive' : 'formButton'}
                                    type='button'
                                    id='offer'
                                    value={true}
                                    onClick={onMutate}
                                    >
                                    Yes
                            </button>
                            <button
                                className={
                                    !offer && offer !== null ? 'formButtonActive' : 'formButton'
                                }
                                type='button'
                                id='offer'
                                value={false}
                                onClick={onMutate}
                                >
                                No
                            </button>
                        </div>


                    {/*  Regular Price  Section */}
                    <label className='formLabel'>Regular Price</label>
                        <div className='formPriceDiv'>
                            <input
                            className='formInputSmall'
                            type='number'
                            id='regularPrice'
                            value={regularPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required
                            />
                            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
                        </div>

                        {offer && (
                            <>
                            <label className='formLabel'>Discounted Price</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required={offer}
                            />
                            </>
                        )}




                    {/* You can can make an input accept different photo types with the accept attribute. then we can limit how many of them we can upload with the max attribute. We also put the multiple and required attribute */}
                    <label className='formLabel'>Images</label>
                        <p className='imagesInfo'>
                            The first image will be the cover (max 6).
                        </p>
                        <input
                            className='formInputFile'
                            type='file'
                            id='images'
                            onChange={onMutate}
                            max='6'
                            accept='.jpg,.png,.jpeg'
                            multiple
                            required
                        />
                        <button type='submit' className='primaryButton createListingButton'>
                            Create Listing
                        </button>


            </form>
        </main>
    </div>
  )
}

export default Createlistings