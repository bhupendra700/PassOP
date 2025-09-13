import { useContext } from "react"
import Footer from "../Reusable/Footer"
import Userheader from "../Reusable/Userheader"
import Header from "../Reusable/Header"
import { ContextData } from "../../main"
import AboutPage from "./AboutPage"

const About = () => {
  const { user } = useContext(ContextData)

  return <>
    {user ? <Userheader /> : <Header />}
      <AboutPage />
    <Footer />
  </>
}

export default About