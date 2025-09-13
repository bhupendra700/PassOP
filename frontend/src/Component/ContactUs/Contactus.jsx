import { useContext } from "react"
import Userheader from "../Reusable/Userheader"
import Header from "../Reusable/Header"
import { ContextData } from "../../main"
import ContactPage from "./ContactPage"

const Contactus = () => {
  const { user } = useContext(ContextData)

  return <>
    {user ? <Userheader /> : <Header />}
      <ContactPage />
  </>
}

export default Contactus