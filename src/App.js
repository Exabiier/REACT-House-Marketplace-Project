import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Layout/Navbar';

import { ToastContainer } from 'react-toastify';

// /////////////// Private Route /////////////////

import PrivateRoute from './Layout/PrivateRoute';


// /////////////////// All our pages //////////////
import Categories from './Pages/Categories/Categories';
import DefaultPage from './Pages/Default/Default';
import Explore from './Pages/Explore/Explore';
import Offers from './Pages/Offers/Offers';
import SignIn from './Pages/SignIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import Profile from './Pages/Profile/Profile';
import NoPage from './Pages/Nopage/NoPage';
import Createlistings from './Pages/Createlistings/Createlistings';
import Listing from './Pages/Listing/Listing';
import Contact from './Pages/Contact/Contact';
import EditListing from './Pages/EditListing/EditListing';

function App() {
  return (
    <>
      <Router>
            <Routes>
                  <Route path='/' element={<Explore />} />
                  <Route path='/forgot-password' element={<ForgotPassword />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="*" element={<NoPage />} />
                  <Route path="/create-listing" element={<Createlistings />} />
                  
                  <Route path='/category/:categoryName' element={<Categories />} />
                  
                  <Route path='/category/:categoryName/:listingId' element={<Listing />} />

                  <Route path='/contact/:landlordId' element={<Contact />} />

                  <Route path='/edit-listing/:listingId' element={<EditListing />} />

                  {/* Private Route */}
                  <Route path='profile' element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                

            </Routes>
          <Navbar /> 
        </Router>

        <ToastContainer />
    </>
  );
}

export default App;
