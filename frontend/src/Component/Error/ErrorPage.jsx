import { Link } from 'react-router-dom'
import '../../CSS/Error/error.css'
import { useContext } from 'react'
import { ContextData } from '../../main'

const ErrorPage = () => {
    const { user } = useContext(ContextData)

    return <div className='errorpage-con'>
        <div>Error</div>
        <div>404</div>
        <div>Something went wrong</div>
        <div>Sorry, we couldn't find the page you were looking for.</div>
        <div><Link to={user ? `/${user._id}` : '/'} className='button'><i className="ri-home-4-line"></i> Home</Link></div>
    </div>
}

export default ErrorPage