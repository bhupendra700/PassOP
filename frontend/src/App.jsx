import './App.css'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import User from './Component/User/User'
import Home from './Component/Home/Home'
import { createContext, useContext, useEffect, useState } from 'react'
import { ContextData } from './main'
import Contactus from './Component/ContactUs/Contactus'
import Error from './Component/Error/Error'
import About from './Component/About/About'
import People from './Component/People/People'
import TwoFAAlert from './Component/TwoFA/TwoFAAlert'
import Show2FAPopUp from './Component/TwoFA/Show2FAPopUp'
import ShowDisable2FA from './Component/TwoFA/ShowDisable2FA'
import Insights from './Component/Analytics/Insights'
import Pricing from './Component/Pricing/Pricing'

const AppContext = createContext();
const App = () => {
  const { user, loginLoader } = useContext(ContextData);
  const loc = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && loc.pathname === '/') {
      navigate(`/${user?._id}`, { replace: true });
    }
  }, [user, loc.pathname, navigate]);

  const [alert2FA, setAlert2FA] = useState(false);

  const [show2FAPopUp, setShow2FAPopUp] = useState(false);

  const [showDisable2FA, setShowDisable2FA] = useState(false);

  useEffect(() => {
    if (user) {
      const timer = Number(localStorage.getItem("timer"));
      if (!user?.is2FA && (!timer || (Date.now() > (timer + (1000 * 60 * 60 * 24 * 7))))) {
        setTimeout(() => {
          setAlert2FA(true);
        }, 1000 * 5);
      }
    } else {
      setAlert2FA(false);
    }
  }, [user])

  return <AppContext.Provider value={{ show2FAPopUp, setShow2FAPopUp, setAlert2FA, alert2FA, showDisable2FA, setShowDisable2FA }}>
    {(alert2FA && user) && <TwoFAAlert />}
    <Routes>
      <Route path='/' element={<Home />} />
      {user && <Route path={`/${user?._id}`} element={<User />} />}
      <Route path='/about' element={<About />} />
      <Route path='/contactus' element={<Contactus />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/people' element={loginLoader ? <></> : <People />} />
      {user && <Route path='/analytics' element={<Insights />} />}
      <Route path='/*' element={loginLoader ? <Home /> : <Error />} />
    </Routes>
    {(show2FAPopUp && user) && <Show2FAPopUp />}
    {(user && showDisable2FA) && <ShowDisable2FA />}
  </AppContext.Provider>
}

export default App
export { AppContext }