import protect from '../../Images/protect.png'
import { MdOutlineMedicalInformation, MdDevices } from "react-icons/md";
import { BiKey } from "react-icons/bi";
import { RiShieldCheckLine } from "react-icons/ri";
import { HiOutlineCollection } from "react-icons/hi";

const Empty = () => {
    return <div className="empty">
        <div className="image">
            <img src={protect} alt="protect_svg" />
        </div>
        <h1>Welcome to PassOp - Vault for Passwords</h1>
        <div>You can use your saved passwords on any device. They're securely stored in <span>PassOP</span>.</div>
        <div className="feature">
            <div><BiKey className='feature-icon'/> Keep track of your passwords</div>
            <div><HiOutlineCollection className='feature-icon'/> Manage them in one place</div>
            <div><MdDevices className='feature-icon'/> Sign in on any device</div>
            <div><MdOutlineMedicalInformation className='feature-icon' /> Securely store your card and email information for quick access</div>
            <div><RiShieldCheckLine className='feature-icon'/> Share passwords, cards, and emails safely with complete privacy</div>
        </div>
    </div>
}

export default Empty