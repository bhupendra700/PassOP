import { CircularProgress } from '@mui/material'
import { useContext, useEffect, useRef, useState } from 'react'
import '../../CSS/Reusable/DeleteAcc.css'
import { ContextData } from '../../main'
import { useNavigate } from 'react-router-dom'
import { authAxios } from '../../config/axiosconfig'

const DeleteAccount = ({ setIsDeleteAcc }) => {
  const navigate = useNavigate()

  const Inputref = useRef([])
  const [loader, setLoader] = useState(false)

  const [error, setError] = useState("")

  const { notify, user, setUser, socket } = useContext(ContextData);

  const handleDelete = async () => {
    setError("")
    try {
      setLoader(true);

      if(user.is2FA){
        const otpValue = Inputref.current.map((ele) => ele.value).join("")

        await authAxios.post('/delete2FAVerify' , {otp : otpValue});
      }

      const res = await authAxios.delete(`/delUser/${user.email}`, { email: user?.email })

      const data = { userId: user._id, Ids: res.data.Ids }

      socket.emit("deleteUser", data)

      if (res.data.success) {
        setUser(null)
      }

      localStorage.removeItem("passKey");
      navigate('/')
      setLoader(false);
    } catch (error) {
      setLoader(false);
      if(error?.response?.data?.message && error?.response?.data?.message.toLowerCase().includes("otp")){
        setError(error?.response?.data?.message);
      }else{
        notify("error", error?.response?.data?.message || error?.message || "Something went wrong");
      }
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => document.body.style.overflow = "auto"
  }, [])

  const handleInput = (e, idx) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');

    if (e.target.value.length > 0 && idx < Inputref.current.length - 1) {
      Inputref.current[idx + 1].focus();
    }
  }

  const handleDel = (e, idx) => {
    if (e.key === "Backspace" && idx > 0) {
      e.preventDefault();
      Inputref.current[idx].value = "";
      Inputref.current[idx - 1].focus();
    }
  }

  const handlePaste = async () => {
    let numbers = (await navigator.clipboard.readText()).split("");

    let lastIndex = 0;

    for (let idx = 0; idx < numbers.length; idx++) {
      const number = numbers[idx];
      if (isNaN(number)) {
        break;  // loop yahi ruk jayega
      }
      if (idx < Inputref.current.length) {
        Inputref.current[idx].value = number;
        lastIndex = idx;
      }
    }

    lastIndex < 5 ? Inputref.current[lastIndex + 1].focus() : Inputref.current[lastIndex].focus();
  }

  return <div className="delete-container">
    <div className="delete-account">
      <div className="delete-header">
        <h3>Delete account</h3>
        <i className="ri-close-fill" onClick={() => {
          if (!loader) {
            setIsDeleteAcc(false)
          }
        }}></i>
      </div>
      <div className="delete-message">
        <p><i className="ri-information-2-fill"></i> Are you sure?</p>
        <p>Deleting your account will permanently remove your saved data.This action is irreversible and cannot be undone. Please proceed only if you're certain.
        </p>
      </div>
      <form autoComplete='off' onSubmit={(e) => {
        e.preventDefault();
        handleDelete();
      }}>
        {user.is2FA && <div className='twofaotp'>
          <div className="message">Enter the 6-digit OTP from your authenticator app.</div>
          <div className='input-div'>
            <div>
              {Array(6).fill(0).map((ele, idx) => {
                return <input type="text" key={idx} placeholder=' ' onInput={(e) => { handleInput(e, idx) }} ref={(e) => { Inputref.current[idx] = e }} maxLength={1} onKeyDown={(e) => { handleDel(e, idx) }} onPaste={()=>{handlePaste()}}/>
              })}
            </div>
            {error && <div>*{error}</div>}
          </div>
        </div>}
        <div className="buttons">
          <button className='cancel' type='button' onClick={() => {
            if (!loader) {
              setIsDeleteAcc(false)
            }
          }}>Cancel</button>
          {!loader ? <button className='delete' type='submit' >Delete Account</button> :
            <button className='delete' type='submit' ><CircularProgress size={20} color='white' /></button>}
        </div>
      </form>
    </div>
  </div>
}

export default DeleteAccount