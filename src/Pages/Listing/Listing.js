import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {getDoc, doc} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../../firebase.config'
import Spinner from '../../Components/Spinner'
import shareIcon from '../../assets/svg/shareIcon.svg'
import React from 'react'
import { async } from '@firebase/util'

function Listing() {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(()=>{

        const fetchListing = async () =>{

            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                console.log(docSnap.data());
                setListing(docSnap.data())
                setLoading(false)
            }
        }

        fetchListing()

    }, [navigate, params.listingId])

    if(loading) {
        return <Spinner />
    }

  return (

    <main>
        {/* slide show */}

        <div className="shareIconDiv" onClick={() => {

            // this is where you can copy to users clipboard
            navigator.clipboard.writeText(window.location.href)
            setShareLinkCopied(true)
            setTimeout(() => {
                setShareLinkCopied(false)
            }, 2000)
        }}>
            <img src={shareIcon} alt="share" />
        </div>

        {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

        <div className="listingDetails">

            {/* The name and Prce of listing */}
            <p className="listingName">{listing.name} - ${listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>

            <p className='listingLocation'>{listing.location}</p>

            <p className="listingType">
               For {listing.type === 'rent' ? 'Rent' : 'sale'}
            </p>

            {listing.offer && (
                <p className="discountPrice">
                    ${listing.regularPrice - listing.discountedPrice} discount
                </p>
            )}

            <ul className="listingDetailsList">
                <li>
                    {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'} 
                </li>
                <li>
                    {listing.bathrooms > 1 ? `${listing.bedrooms} Bathrooms` : '1 Bathroom'} 
                </li>
                <li>
                    {listing.parking && 'Parking Spot Available'} 
                </li>
                <li>
                    {listing.furnished && 'Furnished'} 
                </li>
            </ul>

            <p className="listingLocationTitle">Location</p>
            {/* Map */}

            {auth.currentUser?.uid !== listing.userRef && (
                <Link
                to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
                className='primaryButton'> Contact Landlord</Link>

            )}
        </div>

    </main>

  )
}

export default Listing