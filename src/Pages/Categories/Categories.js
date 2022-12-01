import React from 'react'
import { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { toast } from 'react-toastify';
import Spinner from '../../Components/Spinner';
import ListingsComponent from '../../Components/ListingsComponent';

// ////////////////////  Firebase  ////////////////////
import { collection, getDocs, query, where,  orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase.config';

function Categories() {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const [lastFetchedListing, setLastFetchedListing] = useState(null)

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

                // this code will get the last visibale post that we got from the get docs because we limited to 10 per query
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]

                setLastFetchedListing(lastVisible)

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

    /////////////////////////////////////////////////////////////////////
    ////////////////  More Listing From FireBase (Pagination) ///////////
    /////////////////////////////////////////////////////////////////////

    const onFetchMoreListings = async () => {

        try {

            // Fetch referance
            const listingsRef = collection(db, 'listings')

            // Create a query
            const q = query(

                listingsRef,

                where('type', '==', params.categoryName),

                orderBy('timestamp', 'desc'),

                startAfter(lastFetchedListing),
                
                limit(10)
            )

            const listings = []

            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]

            setLastFetchedListing(lastVisible)

            querySnap.forEach((doc)=> {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)
            
        } catch (error) {
            toast.error('Could not get listings')
        }
    }





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
                        <ListingsComponent
                        listing={listing.data}
                        id={listing.id}
                        key={listing.id}
                        />

                    ))}
                    </ul>
                </main>

                {lastFetchedListing && (
                    <p className='loadMore' onClick={onFetchMoreListings}> Load More </p>
                )}
        
        </>) 
        : (<p>No listings for {params.categoryName}</p>)}

    </div>
  )
}

export default Categories