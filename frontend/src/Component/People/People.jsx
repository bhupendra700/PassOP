import { useContext, useEffect } from "react";
import Footer from "../Reusable/Footer"
import Userheader from "../Reusable/Userheader"
import PeoplePage from "./PeoplePage"
import { useLocation, useNavigate } from "react-router-dom";
import { ContextData } from "../../main";
import Header from '../../Component/Reusable/Header'

const People = () => {
    const loc = useLocation();
    const navigate = useNavigate();

    const { user } = useContext(ContextData);

    useEffect(() => {
       if(!user && loc.pathname === '/people') {
            navigate(`/` , {replace : true});
        }
    }, [user, loc.pathname, navigate]);

    return <>
        {!user ? <Header /> : <Userheader />}
            <PeoplePage />
            <Footer />
        </>
}

export default People;