import logo from '../../Images/icon.png'
import '../../CSS/CustomeToast/custometoast.css'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


function CustomeToast({title , body}) {
    const navigate = useNavigate();

    return <div className='box'>
        <div>
            <div>
                <img src={logo} alt="logo" height={10} />
            </div>
            <div>
                <div className="title">{title}</div>
                <div className="body">{body}</div>
            </div>
        </div>
        <div>
            <button onClick={()=>{navigate('/people')}}>View</button>
            <button onClick={()=>{toast.dismiss()}}>Cancel</button>
        </div>
    </div>
}

export default CustomeToast