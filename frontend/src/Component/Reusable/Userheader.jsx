import { NavLink, useNavigate } from 'react-router-dom'
import '../../CSS/Reusable/userheader.css'
import icon from '../../Images/icon.png'
import icon2 from "../../Images/icon1.png"
import useWindowSize from '../../Functions/useWindowSize'
import { useContext, useEffect, useState } from 'react'
import { ContextData } from '../../main'
import Footer from './Footer'
import DeleteAccount from '../Reusable/DeleteAccount'
import { authAxios } from '../../config/axiosconfig'
import { AppContext } from '../../App'
import { CircularProgress } from '@mui/material'
import { startRegistration } from '@simplewebauthn/browser';


const Userheader = () => {
  const { setShow2FAPopUp, setShowDisable2FA } = useContext(AppContext);

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

  const { notify, setUser, user, passwordCount } = useContext(ContextData)

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
      const res = await authAxios.get("/logout");
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

  const [layer, setLayer] = useState(false);

  const registerPasskey = async () => {
    try {
      setLayer(true);

      // await new Promise((r , re)=>{
      //   setTimeout(()=>{r(true)},1000*60*5);
      // })

      const option = await authAxios.get('/createOption');

      const browserRes = await startRegistration(option.data.option);

      const verifiedRes = await authAxios.post('/verifyRegisterChallenge', { browserRes })

      if (verifiedRes.data.success) {
        setUser({ ...user, isPassKey: true });
        notify("success", "Passkey Successfully Registered!")
      }

      setLayer(false);
    } catch (error) {
      setLayer(false);
      console.log("Error: ", error);
      notify("error", error?.response?.data?.message || error?.message || "Passkey Registration Failed")
    }
  }

  const deletePassKey = async () => {
    try {
      setLayer(true)
      const res = await authAxios.patch('/deletePasskey');
      if (res.data.success) {
        setUser({ ...user, isPassKey: false });
        notify("success", "Passkey Successfully Removed")
      }
      setLayer(false)
    } catch (error) {
      setLayer(false);
      console.log("Error: ", error);
      notify("error", error?.response?.data?.message || error?.message || "Passkey Removal Failed")
    }
  }

  return <>
    <header className='user-header'>
      <div className="top">
        <div className="logo">
          <img src={((user?.plan_type === "Ultimate") || ((user?.plan_type === "Pro") && (new Date() < new Date(user?.plan_expiry)))) ? icon2 : icon} alt="" />
          <div>&lt;<span>Pass</span>OP/&gt;</div>
        </div>
        {size > 900 ? <div className="nav">
          <NavLink className="link" to={`/${user._id}`}><i className="ri-home-4-line"></i> Home</NavLink>
          <NavLink className="link" to={"/about"}><i className="ri-info-card-line"></i> About</NavLink>
          <NavLink className="link" to={"/contactus"}><i className="ri-contacts-line"></i>  Contact Us</NavLink>
          <NavLink className="link" to={"/people"}><i className="ri-p2p-fill"></i> People</NavLink>
          {size > 1050 && <NavLink className="link" to={"/pricing"}><i className="ri-price-tag-3-line"></i> Pricing</NavLink>}
          <NavLink className="link" to={"/analytics"}><i className="ri-bar-chart-2-line"></i> Analytics</NavLink>
          <details id='det1'>
            <summary>
              {!user.photoURL.startsWith("https://") ? <div style={{ backgroundColor: `${user.photoURL}` }}>{user.name.substring(0, 1).toUpperCase()}</div> :
                <img src={user.photoURL} alt="userImage" />}
            </summary>
            <div>
              <div className="name"><i className="ri-pass-valid-line"></i> {user.name}</div>
              <div className="email"><i className="ri-mail-lock-line"></i> {user.email}</div>
              <div className="password"><i className="ri-lock-password-line"></i> Total Vaults : {passwordCount}</div>
              <div className='passKey_2FA'>

                {layer ? <button><CircularProgress className='loader' size={20} /></button> : user.isPassKey ? <button onClick={() => { deletePassKey() }}><i className="ri-delete-bin-6-line"></i> Remove PassKey</button> :
                  <button onClick={() => { registerPasskey() }}><i className="ri-key-2-line"></i> Create PassKey</button>}

              {!user.is2FA ? <button onClick={() => {
                document.getElementById("det1")?.removeAttribute("open");
                setShow2FAPopUp(true)
              }}><i className="ri-shield-keyhole-line"></i> Enable 2FA</button> : <button onClick={() => {
                document.getElementById("det1")?.removeAttribute("open");
                setShowDisable2FA(true)
              }}><i className="ri-lock-unlock-line"></i> Disable 2FA</button>}

              </div>
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
            {size > 260 && (!user.photoURL.startsWith("https://") ? <div style={{ backgroundColor: `${user.photoURL}` }}>
              {user.name.substring(0, 1).toUpperCase()}
            </div> :
              <div>
                <img src={user.photoURL} alt="user_image" />
              </div>
            )
            }
            <div className="hem" onClick={() => { setSlider(!slider) }}><i className="ri-menu-line"></i></div>
          </div>}
      </div>
      {(size <= 900 && slider) && <div className="bottom">
        <div className="bottom-content">
          <i className="ri-close-line" onClick={() => { closeSlider() }}></i>
          <div className="logo">
            {user.photoURL.startsWith("https://") ? <div className="letter" style={{ backgroundColor: `${user.photoURL ? user.photoURL : "#299f29"}` }}>
              <img src={user.photoURL} alt="user image" />
            </div> :
              <div className="letter" style={{ backgroundColor: `${user.photoURL ? user.photoURL : "#299f29"}` }}>
                {user.name[0].toUpperCase()}
              </div>}
          </div>
          <div className="header-details">
            <div className="name"><i className="ri-pass-valid-line"></i> {user.name}</div>
            <div className="email"><i className="ri-mail-lock-line"></i> {user.email}</div>
            <div className="password"><i className="ri-lock-password-line"></i> Total Vaults: {passwordCount}</div>
          </div>
          <div className="nav">
            <NavLink className="link" to={`/${user._id}`} onClick={() => { closeSlider() }}><i className="ri-home-4-line"></i> Home</NavLink>
            <NavLink className="link" to={"/about"} onClick={() => { closeSlider() }}><i className="ri-info-card-line"></i> About</NavLink>
            <NavLink className="link" to={"/contactus"} onClick={() => { closeSlider() }}><i className="ri-contacts-line"></i>  Contact Us</NavLink>
            <NavLink className="link" to={"/people"} onClick={() => { closeSlider() }}><i className="ri-p2p-fill"></i> People</NavLink>
            <NavLink className="link" to={"/pricing"} onClick={() => { closeSlider() }}><i className="ri-price-tag-3-line"></i> Pricing</NavLink>
            <NavLink className="link" to={"/analytics"} onClick={() => { closeSlider() }}><i className="ri-bar-chart-2-line"></i> Analytics</NavLink>
            {!user.is2FA ? <button onClick={() => {
              closeSlider()
              setTimeout(() => {
                setShow2FAPopUp(true)
              }, 200)
            }}><i className="ri-shield-keyhole-line"></i> Enable 2FA</button> :
              <button onClick={() => {
                closeSlider()
                setTimeout(() => {
                  setShowDisable2FA(true)
                }, 200)
              }}><i className="ri-lock-unlock-line"></i> Disable 2FA</button>}
            {layer ? <button><CircularProgress className='loader' size={22} /></button> : user.isPassKey ? <button onClick={() => { deletePassKey() }}><i className="ri-delete-bin-6-line"></i> Remove PassKey</button> :
              <button onClick={() => { registerPasskey() }}><i className="ri-key-2-line"></i> Create PassKey</button>}
            <button onClick={() => { closeSlider(); Logout() }}><i className="ri-logout-box-r-line"></i> Logout</button>
            <button onClick={() => {
              closeSlider()
              setTimeout(() => {
                setIsDeleteAcc(true)
              }, 200)
            }}><i className="ri-delete-bin-2-line"></i> Delete Acoount</button>
          </div>
          <Footer />
        </div>
      </div>}
    </header>
    {isDeleteAcc && <DeleteAccount setIsDeleteAcc={setIsDeleteAcc} />}
    {layer && <div className='layer'></div>}
  </>
}

export default Userheader