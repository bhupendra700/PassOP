import { NavLink, useNavigate } from 'react-router-dom'
import '../../CSS/Reusable/userheader.css'
import icon from '../../Images/icon.png'
import useWindowSize from '../../Functions/useWindowSize'
import { useContext, useEffect, useState } from 'react'
import { ContextData } from '../../main'
import Footer from './Footer'
import DeleteAccount from '../Reusable/DeleteAccount'
import { authAxios } from '../../config/axiosconfig'


const Userheader = () => {
  const navigate = useNavigate();

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

  const { notify, setUser, user , passwordCount} = useContext(ContextData)

  const [slider, setSlider] = useState(false);

  const [isDeleteAcc, setIsDeleteAcc] = useState(false)

  useEffect(() => {
    if (slider) {
      document.body.style.overflow = "hidden"
    } else {
      if (!isDeleteAcc) {
        document.body.style.overflow = "auto"
      }
    }
  }, [slider])

  const Logout = async () => {
    try {
      const res = await authAxios.get("/logout" , {withCredentials : true});
      if (res.data.success) {
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    }
  }

  const closeSlider = () => {
    const bottom = document.getElementsByClassName("bottom")[0];
    bottom.classList.add("go");
    bottom.addEventListener("animationend", () => {
      setSlider(!slider)
    }, { once: true })
  }

  return <>
    <header className='user-header'>
      <div className="top">
        <div className="logo">
          <img src={icon} alt="" />
          <div>&lt;<span>Pass</span>OP/&gt;</div>
        </div>
        {size > 800 ? <div className="nav">
          <NavLink className="link" to={`/${user._id}`}><i className="ri-home-4-line"></i> Home</NavLink>
          <NavLink className="link" to={"/about"}><i className="ri-info-card-line"></i> About</NavLink>
          <NavLink className="link" to={"/contactus"}><i className="ri-contacts-line"></i>  Contact Us</NavLink>
          <NavLink className="link" to={"/people"}><i className="ri-p2p-fill"></i> People</NavLink>
          {size > 900 && <button onClick={() => { Logout() }}><i className="ri-logout-box-r-line"></i> Logout</button>}
          <details id='det1'>
            <summary style={{ backgroundColor: `${user.photoURL ? user.photoURL : "#299f29"}` }}>
              <div>{user.name.substring(0, 1).toUpperCase()}</div>
            </summary>
            <div>
              <div className="name"><i className="ri-pass-valid-line"></i> {user.name}</div>
              <div className="email"><i className="ri-mail-lock-line"></i> {user.email}</div>
              <div className="password"><i className="ri-lock-password-line"></i> Total Password : {passwordCount}</div>
              <button onClick={() => {
                document.getElementById("det1")?.removeAttribute("open");
                Logout();
              }}><i className="ri-logout-box-r-line"></i> Logout</button>
              <button onClick={() => {
                document.getElementById("det1")?.removeAttribute("open");
                setIsDeleteAcc(true)
              }}><i className="ri-delete-bin-2-line"></i> Delete Account</button>
            </div>
          </details>
        </div> :
          <div className="mob-nav">
            {size > 260 && <div style={{ backgroundColor: `${user.photoURL ? user.photoURL : "#299f29"}` }}>
              {user.name.substring(0, 1).toUpperCase()}
            </div>}
            <div className="hem" onClick={() => { setSlider(!slider) }}><i className="ri-menu-line"></i></div>
          </div>}
      </div>
      {(size <= 800 && slider) && <div className="bottom">
        <div className="bottom-content">
          <i className="ri-close-line" onClick={() => { closeSlider() }}></i>
          <div className="logo">
            <div className="letter" style={{backgroundColor : `${user.photoURL ? user.photoURL : "#299f29"}`}}>
              B
            </div>
          </div>
          <div className="header-details">
            <div className="name"><i className="ri-pass-valid-line"></i> {user.name}</div>
            <div className="email"><i className="ri-mail-lock-line"></i> {user.email}</div>
            <div className="password"><i className="ri-lock-password-line"></i> Total Password: {passwordCount}</div>
          </div>
          <div className="nav">
            <NavLink className="link" to={`/${user._id}`} onClick={() => { closeSlider() }}><i className="ri-home-4-line"></i> Home</NavLink>
            <NavLink className="link" to={"/about"} onClick={() => { closeSlider() }}><i className="ri-info-card-line"></i> About</NavLink>
            <NavLink className="link" to={"/contactus"} onClick={() => { closeSlider() }}><i className="ri-contacts-line"></i>  Contact Us</NavLink>
            <NavLink className="link" to={"/people"} onClick={() => { closeSlider() }}><i className="ri-p2p-fill"></i> People</NavLink>
            <button onClick={() => { closeSlider(); Logout() }}><i className="ri-logout-box-r-line"></i> Logout</button>
            <button onClick={() => {
              closeSlider()
              setTimeout(() => {
                setIsDeleteAcc(true)
              }, 200)
            }}><i className="ri-delete-bin-2-line"></i> Delete Acoount</button>
          </div>
          <Footer/>
        </div>
      </div>}
    </header>
    {isDeleteAcc && <DeleteAccount setIsDeleteAcc={setIsDeleteAcc} />}
  </>
}

export default Userheader