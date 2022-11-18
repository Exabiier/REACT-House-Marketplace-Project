import React from 'react'
import { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { toast } from 'react-toastify';
import Spinner from '../../Components/Spinner';

// ////////////////////  Firebase  ////////////////////
import { collection, getDocs, query, where,  orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase.config';

function Categories() {

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
                    where('type', '==', params.categoryName),
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

    }, [params.categoryName])

  return (
    <div className='category'>
        <header>
            <p className='pageHeader'>
                {params.categoryName === 'rent' 
                ? 'Places for rent'
                : 'Places for sale'
                }
            </p>
        </header>

        {loading ?  
        (<Spinner />) 
        : listings && listings.length > 0 
        ? (<>
                <main>
                    <ul className='categeryListings'>
                    {listings.map((listing) => (
                        <h3 key={listing.id}>{listing.data.name}</h3>
                    ))}
                    </ul>
                </main>
        
        </>) 
        : (<p>No listings for {params.categoryName}</p>)}

    </div>
  )
}

export default Categories