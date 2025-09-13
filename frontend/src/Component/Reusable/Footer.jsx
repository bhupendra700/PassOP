import { Link } from 'react-router-dom'
import '../../CSS/Reusable/footer.css'
const Footer = () => {
  return <footer className='footer'>
    <div>Only you can see your passwords</div>
    <Link className='link' to={'/about'}>Learn more <i className="ri-question-line"></i></Link>
  </footer>
}

export default Footer