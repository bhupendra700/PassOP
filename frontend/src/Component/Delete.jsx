import React from 'react'
import '../CSS/delete.css'
import { checkisLink } from '../Function/Link'
import { isEmail } from '../Function/emailvalidation'
import CircularProgress from '@mui/material/CircularProgress';

const Delete = () => {
  return (
    <section className='del'>
        <div className="card">
          <div>{checkisLink("google.com") ? <span><b>Site Name</b></span> : <span><b>App Name</b></span>} : ghdfjkgh</div>
          <div>{isEmail("abc@g.info") ? <span><b>Email</b></span> : <span><b>Username</b></span>} : bhupendra@gmail.com</div>
          <div><span><b>Password</b></span>: retyjktu</div>
          <div>
          <button>Cancel</button>
          <button>Confirm</button>
          {/* <button><CircularProgress size={"2.1rem"} color='white'/></button> */}
          </div>
        </div>
    </section>
  )
}

export default Delete
