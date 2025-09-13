import { useContext } from 'react'
import { ContextData } from '../../main';
import Userheader from '../Reusable/Userheader';
import Header from '../Reusable/Header'
import Footer from '../Reusable/Footer';
import ErrorPage from './ErrorPage';

const Error = () => {
  const { user } = useContext(ContextData);

  return <section className='error-con'>
   {user ? <Userheader/> : <Header/>}
   <ErrorPage />
    <Footer />
  </section>
}

export default Error