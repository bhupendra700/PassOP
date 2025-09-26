import { useContext } from "react"
import Userheader from "../Reusable/Userheader"
import { ContextData } from "../../main"
import MainPricing from "./MainPricing";
import Footer from "../Reusable/Footer";
import Header from '../../Component/Reusable/Header'
import HomePricing from "./HomePricing";

function Pricing() {
    const { user } = useContext(ContextData);

    return <>
        {user ? <Userheader /> : <Header />}
        {user ? <MainPricing /> : <HomePricing />}
        <Footer />
    </>
}

export default Pricing