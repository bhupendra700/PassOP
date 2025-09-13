import { CircularProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import '../../CSS/Reusable/DeleteAcc.css'
import { ContextData } from '../../main'
import { useNavigate } from 'react-router-dom'
import { authAxios } from '../../config/axiosconfig'

const DeleteAccount = ({ setIsDeleteAcc }) => {
  const navigate = useNavigate()

  const [loader, setLoader] = useState(false)
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const { notify, user, setUser , socket} = useContext(ContextData);

  const handleDelete = async () => {
    try {
      setLoader(true);

      if (password.length < 8) {
        setError("Password must be 8 character long");
        setLoader(false);
        return;
      }

      const res = await authAxios.delete("/delUser", { data: { email: user?.email, password } })

      const data = { userId: user._id, Ids: res.data.Ids }
      
      socket.emit("deleteUser", data)

      if (res.data.success) {
        setUser(null)
      }

      navigate('/')
      setPassword("")
      setLoader(false);
    } catch (error) {
      setLoader(false);
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message)
      } else if (error?.message) {
        notify("error", error?.message);
      }
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => document.body.style.overflow = "auto"
  }, [])

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
        <p>Deleting your account will permanently remove your saved username/email and password.This action is irreversible and cannot be undone. Please proceed only if you're certain.
        </p>
      </div>
      <form autoComplete='off' onSubmit={(e) => {
        e.preventDefault();
        handleDelete();
      }}>
        <div className="password-con">
          Password
          <div className="password-box">
            <i className="ri-lock-2-line"></i>
            <input type="password" placeholder='Enter Password' required value={password} onChange={(e) => { setPassword(e.target.value) }} />
          </div>
          {error && <div className="error">
            * {error}
          </div>}
        </div>
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