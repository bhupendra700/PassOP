import './App.css'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import User from './Component/User/User'
import Home from './Component/Home/Home'
import { useContext, useEffect } from 'react'
import { ContextData } from './main'
import Contactus from './Component/ContactUs/Contactus'
import Error from './Component/Error/Error'
import About from './Component/About/About'
import People from './Component/People/People'

const App = () => {
  const {user , loginLoader} = useContext(ContextData);
  const loc = useLocation();
  const navigate = useNavigate();

  useEffect(()=>{
    if(user && loc.pathname === '/'){
      navigate(`/${user?._id}` , { replace: true });
    }
  }, [user , loc.pathname , navigate]);

  return <Routes>
    <Route path='/' element={<Home />} />
    {user && <Route path={`/${user?._id}`} element={<User />} />}
    <Route path='/about' element={<About />} />
    <Route path='/contactus' element={<Contactus />} />
    <Route path='/people' element={loginLoader ? <></> : <People />} />
    <Route path='/*' element={loginLoader ? <Home /> : <Error />} />
  </Routes>
}

export default App