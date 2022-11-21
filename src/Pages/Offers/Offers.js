import React from 'react'
import { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { toast } from 'react-toastify';
import Spinner from '../../Components/Spinner';
import ListingsComponent from '../Categories/Components/ListingsComponent';

// ////////////////////  Firebase  ////////////////////
import { collection, getDocs, query, where,  orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase.config';

function Offer() {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = useParams()

    useEffect(()=>{

        // We make async functions within our useEffect because we cannot do it in the useEffect function itself:

        const fetchListings = async () => {

            try {

                // Fetch referance
                const listingsRef = collection(db, 'listings')

                // Create a query
                const q = query(

                    listingsRef,

                    where('offer', '==', true),

                    orderBy('timestamp', 'desc'),
                    
                    limit(10)
                )

                const listings = []

                // Execute query. QuerySnap is an array. 
                const querySnap = await getDocs(q)

                // the doc that comes back is a huge object type of data type of information so we need to be specicific on what we use from it. We have use .data() to get our data from it. 
                querySnap.forEach((doc)=> {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)
                
            } catch (error) {
                toast.error('Could not get listings')
            }
        }

        fetchListings()

    }, [])

  return (
    <div className='category'>
        <header>
            <p className='pageHeader'>
                Offers
            </p>
        </header>

        {loading ?  
        (<Spinner />) 
        
        : listings && listings.length > 0 
        ? (<>
                <main>
                    <ul className='categeryListings'>
                    {listings.map((listing) => (
                        <ListingsComponent
                        listing={listing.data}
                        id={listing.id}
                        key={listing.id}
                        />

                    ))}
                    </ul>
                </main>
        
        </>) 
        : (<p>There are no Current offers</p>)}

    </div>
  )
}
  
  export default Offer