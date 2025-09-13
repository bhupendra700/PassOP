import { createContext, useContext, useEffect, useState } from 'react'
import { TbLockPlus } from 'react-icons/tb';
import { MdOutlineMailLock } from 'react-icons/md';
import { BsCreditCard2Front } from 'react-icons/bs';
import SavePassword from './SavePassword.jsx';
import { ContextData } from '../../main.jsx';
import SaveEmail from './SaveEmail.jsx';
import SaveCard from './SaveCard.jsx';

const SaveContext = createContext();

const Save = ({ catagory, passDocs, setPassDocs, emailDocs, setEmailDocs, cardDocs, setCardDocs, isEdit, setIsEdit, setCatagory, newcat, newsetCat, editId, setEditId }) => {

    const { data } = useContext(ContextData);

    const [cat, setCat] = useState("All");

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        const handleAnywhere = (e) => {
            const det2 = document.getElementById("det2");
            const save_det = document.getElementById("save-det");

            if (!det2?.contains(e.target)) {
                det2?.parentElement.removeAttribute("open")
            }

            if (!save_det?.contains(e.target)) {
                save_det.removeAttribute("open")
            }
        }

        window.addEventListener("click", handleAnywhere)

        return () => window.removeEventListener("click", handleAnywhere)

    }, [])

    const [passError, setPassError] = useState({ url: "", username: "", password: "" })
    const [emailError, setEmailError] = useState({ email: "", password: "" })
    const [cardError, setCardError] = useState({ card_holder_name: "", card_number: "", expiry_date: "" })

    const range = [1, 2, 3];

    const initialCount = (countPara) => {
        if (!isNaN(countPara)) {
            const validNumber = range.includes(parseInt(countPara)) ? parseInt(countPara) : 1;
            localStorage.setItem("count", validNumber);
            return validNumber
        } else {
            localStorage.setItem("count", 1);
            return 1;
        }
    }

    const [count, setCount] = useState(initialCount(localStorage.getItem("count")));

    const setCountFun = (countpara) => {
        localStorage.setItem("count", countpara)
        setCount(countpara)
    }

    useEffect(() => {
        if (editId) {
            setCat(newcat.name)

            let editData = data.find((ele) => {
                return ele._id === editId;
            })

            if (editData.Doctype === "password") {
                setPassDocs(editData);
                setPassError({ url: "", username: "", password: "" })
                setCountFun(1)
            } else if (editData.Doctype === "email") {
                setEmailDocs(editData);
                setEmailError({ email: "", password: "" })
                setCountFun(2)
            } else {
                setCardDocs({...editData , card_number:editData.card_number.match(/.{4}/g).join(" ")})
                setCardError({ card_holder_name: "", card_number: "", expiry_date: "" })
                setCountFun(3)
            }

            document.getElementById("save-det").open = true;
            setEditId(null);
            window.scroll({
                top: 0,
                behavior: "smooth"
            })
        }
    }, [editId])

    return <SaveContext.Provider value={{ isEdit, setIsEdit, passDocs, setPassDocs, emailDocs, setEmailDocs, cardDocs, setCardDocs, passError, setPassError, emailError, setEmailError, cardError, setCardError, cat, setCat, newcat, newsetCat, catagory, setCatagory, loader, setLoader }}>
        <details id="save-det">
            <summary>
                <div>{count === 1 ? "Add Password" : count === 2 ? "Add Email" : "Add Card"}</div>

                <div className="toggle-switch-main" onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (!isEdit) { setCountFun((count % 3) + 1) } }}>

                    <div className={`toggle-switch-button ${count === 1 ? "passimg" : count === 2 ? "email" : "credit-card"}`}>{count === 1 ? <TbLockPlus className='react-font-lock' /> : count === 2 ? <MdOutlineMailLock className='react-font-email' /> : <BsCreditCard2Front className='react-font-card' />}
                    </div>

                </div>

                <div><i className="ri-add-line add"></i><i className="ri-subtract-line sub"></i>
                </div>
            </summary>
            {count === 1 ? <SavePassword /> : count === 2 ? <SaveEmail /> : <SaveCard />}
        </details>
    </SaveContext.Provider>
}

export default Save
export { SaveContext };