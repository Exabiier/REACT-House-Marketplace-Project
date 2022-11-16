import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './Layout/Navbar';

import { ToastContainer } from 'react-toastify';

// /////////////// Private Route /////////////////

import PrivateRoute from './Layout/PrivateRoute';


// /////////////////// All our pages //////////////
import DefaultPage from './Pages/Default/Default';
import Explore from './Pages/Explore/Explore';
import Offers from './Pages/Offers/Offers';
import SignIn from './Pages/SignIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import Profile from './Pages/Profile/Profile';
import NoPage from './Pages/Nopage/NoPage';

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
