import { NavLink } from 'react-router-dom'
import '../../CSS/Reusable/header.css'
import icon from '../../Images/icon.png'
import useWindowSize from '../../Functions/useWindowSize'
import { useContext, useEffect, useState } from 'react'
import { Alert } from '@mui/material'
import logo from '../../Images/icon.png'
import Footer from './Footer'
import { ContextData } from '../../main'
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import Signup from './Signup'

const Userheader = () => {
  const size = useWindowSize();

  useEffect(() => {
    const handleAnyWhere = (e) => {
      const det1 = document.getElementById("det1");

      if (!det1?.contains(e.target)) {
        det1?.removeAttribute("open")
      }
    }

    window.addEventListener("click", handleAnyWhere);

    return () => window.removeEventListener("click", handleAnyWhere)
  }, [])

  const [slider, setSlider] = useState(false);

  const { user, alert , setAlert} = useContext(ContextData);

  const [isLogin, setIsLogin] = useState(false)
  const [isForgot, setIsForgot] = useState(false)
  const [isSigUp, setIsSignUp] = useState(false)

  useEffect(() => {
    if (slider) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [slider])

  const closeSlider = () => {
    const bottom = document.getElementsByClassName("bottom")[0];
    bottom.classList.add("go");
    bottom.addEventListener("animationend", () => {
      setSlider(!slider)
    }, { once: true })
  }

  return <>
    <header className='header'>
      {(!user && alert) && <Alert style={{ width: "100%" }} severity="warning">Please log in to use this feature.</Alert>}
      <div className="top">
        <div className="logo">
          <img src={icon} alt="" />
          <div>&lt;<span>Pass</span>OP/&gt;</div>
        </div>
        {size > 950 ? <div className="nav">
          <NavLink className="link" to={`/`}><i className="ri-home-4-line"></i> Home</NavLink>
          <NavLink className="link" to={"/about"}><i className="ri-info-card-line"></i> About</NavLink>
          <NavLink className="link" to={"/contactus"}><i className="ri-contacts-line"></i>  Contact Us</NavLink>
          <NavLink className="link" onClick={(e)=>{e.preventDefault() ; setAlert(true)}} to={"/people"}><i className="ri-p2p-fill" ></i> People</NavLink>
          <NavLink className="link" to={"/pricing"}><i className="ri-price-tag-3-line"></i>Pricing</NavLink>
          <button onClick={() => { setIsLogin(true) }}><i className="ri-login-box-line"></i> Login</button>
        </div> :
          <div className="mob-nav">
            <div className="hem" onClick={() => { setSlider(!slider) }}><i className="ri-menu-line"></i></div>
          </div>}
      </div>
      {(size <= 950 && slider) && <div className="bottom">
        <div className="bottom-content">
          <i className="ri-close-line" onClick={() => { closeSlider() }}></i>
          <div className="logo">
            <div className="image">
              <img src={logo} alt="logo" />
            </div>
          </div>
          <div className="header-details">
            <div>&lt;<span>Pass</span>OP/&gt;</div>
          </div>
          <div className="nav">
            <NavLink className="link" to={`/`} onClick={() => { closeSlider() }}><i className="ri-home-4-line"></i> Home</NavLink>
            <NavLink className="link" to={"/about"} onClick={() => { closeSlider() }}><i className="ri-info-card-line"></i> About</NavLink>
            <NavLink className="link" to={"/contactus"} onClick={() => { closeSlider() }}><i className="ri-contacts-line"></i>  Contact Us</NavLink>
            <NavLink className="link" onClick={(e) => {e.preventDefault() ; setAlert(true) ; closeSlider() }} to={"/people"}><i className="ri-p2p-fill"></i> People</NavLink>
            <NavLink className="link" to={"/pricing"}><i className="ri-price-tag-3-line"></i> Pricing</NavLink>
            <button onClick={() => {
              closeSlider()
              setTimeout(() => {
                setIsLogin(true)
              }, 200)
            }}><i className="ri-login-box-line"></i> Login</button>
          </div>
          <Footer />
        </div>
      </div>}
    </header>
    {isLogin && <Login setIsLogin={setIsLogin} setIsForgot={setIsForgot} setIsSignUp={setIsSignUp} />}
    {isForgot && <ForgotPassword setIsForgot={setIsForgot} />}
    {isSigUp && <Signup setIsSignUp={setIsSignUp} setIsLogin={setIsLogin} />}
  </>
}

export default Userheader