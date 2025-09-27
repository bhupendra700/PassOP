import { CircularProgress } from "@mui/material";
import useWindowSize from "../../Functions/useWindowSize";
import { useContext, useEffect, useState } from "react";
import { ContextData } from "../../main";
import NoPasswordToSelect from "../User/NoPasswordToSelect"
import { userAxios } from "../../config/axiosconfig";
import logo from '../../Images/icon.png'
import email from '../../Images/Email.png'
import smartchip from '../../Images/EMV.png'

const AddPassword = ({ setSelect, select, data, cat, setCat, makeUrl, isSites, isEmail, catagory, setCatagory }) => {
    const size = useWindowSize();

    useEffect(() => {
        const handleAnywhere = (e) => {
            const select_card_det = document.getElementsByClassName("select-card-det");

            for (let i = 0; i < select_card_det.length; i++) {
                if (!select_card_det[i]?.contains(e.target)) {
                    select_card_det[i]?.removeAttribute("open")
                }
            }
        }

        window.addEventListener("click", handleAnywhere)

        return () => window.removeEventListener("click", handleAnywhere)

    }, [])

    const Extractfavicon = (url) => {
        try {
            const regex = /^(?:https?:\/\/)?([^\/]+)/i;
            const result = url.match(regex);
            return `https://img.logo.dev/${result[0].replace(/^https?:\/{0,2}/, "")}?token=pk_Slm3zZ2dQJGp1U_6Wof0sQ`
        } catch (error) {
            return null
        }
    }

    const { notify, user } = useContext(ContextData);

    const [filteredPassword, setFileteredPassword] = useState([]);

    const [index, setIndex] = useState([])

    const [showError, setShowError] = useState(true)

    useEffect(() => {
        if (data && data.length > 0) {
            if (cat?.passwordID?.length > 0) {
                setFileteredPassword(data.filter((ele) => {
                    return !cat.passwordID.includes(ele._id)
                }))
            } else {
                setFileteredPassword([...data])
            }
        }
        setShowError(false)
    }, [data])

    useEffect(() => {
        if (filteredPassword.length > 0) {
            setIndex(new Array(filteredPassword.length).fill(false))
        }
    }, [filteredPassword])

    const [eye, setEye] = useState(false);

    useEffect(() => {
        if (select) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [select]);

    const [adding, setAdding] = useState(false)

    const addToCollection = async () => {
        try {
            setAdding(true)

            const passwordIds = filteredPassword.filter((ele, idx) => index[idx]).map((ele) => ele._id)

            if (passwordIds.length === 0) {
                setAdding(false)
                setSelect(false)
                return;
            }

            await userAxios.post('/addpasswordincollection', { colid: cat._id, passwordIds })

            const AllPasswordIDS = [...cat.passwordID, ...passwordIds];

            setCat({ ...cat, passwordID: AllPasswordIDS })
            setCatagory(catagory.map((ele) => {
                if (ele._id === cat._id) {
                    return { ...ele, passwordID: AllPasswordIDS }
                } else {
                    return { ...ele };
                }
            }))

            setAdding(false)
            setSelect(false)
        } catch (error) {
            setAdding(false)
            if (error?.response?.data?.message) {
                notify("error", error?.response?.data?.message)
            } else {
                notify("error", error?.message)
            }
        }
    }

    return <div className="add-password-popup">
        <div className="popup">
            <div className="add-pass-header">
                <div className="head">Add To Collections</div>
                <i className="ri-close-line" onClick={() => { if (!adding) { setSelect(false) } }}></i>
            </div>
            <div className="option">
                {filteredPassword.length !== 0 ? filteredPassword.map((ele, idx) => {
                    return <div className="card" key={idx}>
                        <details className="select-card-det">
                            <summary onClick={(e) => { if (eye) { setEye(false) } }}>
                                <div className={size <= 750 ? "image big-img" : "image"}>
                                    {ele.Doctype === "email" ? <a href={`mailto:${ele.email}`} target="_blank">
                                        <img src={email} alt="link_image" />
                                    </a> : ele.Doctype === "card" ? <a href={ele.brandUrl || `/${user._id}`} target="_blank">
                                        <img src={ele.brandUrl ? Extractfavicon(ele.brandUrl) : logo} alt="link_image" />
                                    </a> : isSites(ele.url) ?
                                        <a href={makeUrl(ele.url)} target="_blank">
                                            <img src={Extractfavicon(ele.url)} alt="link_image" height={20} />
                                        </a>
                                        :
                                        <span>{ele.url.trim().charAt(0).toUpperCase()}</span>}
                                </div>
                                <div className="link-or-site">
                                    {ele.Doctype === "card" ? ele.card_holder_name.toUpperCase() : ele.Doctype === "email" ? ele.email : ele?.url}
                                </div>
                                <div className="arrow">
                                    <i className="ri-arrow-down-s-line"></i>
                                </div>
                                <div className="check" onClick={(e) => {
                                    document.getElementsByClassName("select-card-det")[idx].removeAttribute("open")
                                    setIndex(index.map((ele, Index_idx) => {
                                        if (Index_idx === idx) {
                                            return !ele;
                                        } else {
                                            return ele
                                        }
                                    }))
                                }}>
                                    <input type="checkbox" checked={!!index[idx]} onChange={() => { }} />
                                </div>
                            </summary>
                            <div className={size <= 750 ? "padding" : ""}>
                                {ele.Doctype !== "card" ? <>
                                    {ele.Doctype === "password" && <div className="common site">
                                        <div className="heading">
                                            {isSites(ele.url) ? "Site" : "App"}
                                        </div>
                                        <div className="body">
                                            <div className="content">
                                                {ele.url}
                                            </div>
                                            <div className="icon" onClick={async () => { await navigator.clipboard.writeText(ele.url); notify("success", "Copied to clipboadr") }}>
                                                <i className="ri-file-copy-line"></i>
                                            </div>
                                        </div>
                                    </div>}
                                    <div className="common username">
                                        <div className="heading">
                                            {!isEmail(ele.username) ? "Username" : "Email"}
                                        </div>
                                        <div className="body">
                                            <div className="content">
                                                {ele.username}
                                            </div>
                                            <div className="icon" onClick={async () => {
                                                await navigator.clipboard.writeText(ele.username); notify("success", "Copied to clipboadr")
                                            }}>
                                                <i className="ri-file-copy-line"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="common password">
                                        <div className="heading">
                                            Password
                                        </div>
                                        <div className="body">
                                            <div className="content">
                                                {eye ? ele.password : "*".repeat(ele.password.length)}
                                                {eye ? <i className="ri-eye-line" onClick={() => { setEye(false) }}></i> :
                                                    <i className="ri-eye-off-line" onClick={() => { setEye(true) }}></i>}
                                            </div>
                                            <div className="icon" onClick={async () => {
                                                await navigator.clipboard.writeText(ele.password); notify("success", "Copied to clipboard")
                                            }}>
                                                <i className="ri-file-copy-line"></i>
                                            </div>
                                        </div>
                                    </div>
                                    {ele.notes && <div className="common notes">
                                        <div className="heading">
                                            Notes
                                        </div>
                                        <div className="body">
                                            <div className="content">
                                                {ele.notes}
                                            </div>
                                        </div>
                                    </div>}
                                </> : <section className="debit-card">
                                    <div className="card-details">
                                        <div className="brand-div">
                                            {<div className="image">
                                                <img src={ele.brandUrl ? Extractfavicon(ele.brandUrl) : logo} alt="brand_image" />
                                            </div>}
                                            {<div className="brand-name">
                                                {ele.brandName || "PassOP"}
                                            </div>}
                                        </div>
                                        <div className="card-type">
                                            {ele.card_type || ""} Card
                                        </div>
                                    </div>
                                    <div className="smart-chip">
                                        <div className="image">
                                            <img src={smartchip} alt="EMV" />
                                        </div>
                                    </div>
                                    <div className="card-holder-details">
                                        <div className="card-number">
                                            {ele.card_number.match(/.{4}/g).map((cardnumber, cardidx) => {
                                                return <div key={cardidx}>{cardnumber}</div>
                                            })}
                                        </div>
                                        <div className="exp-div">
                                            <div>VALID THRU</div>
                                            <div>{ele.expiry_date}</div>
                                        </div>
                                        <div className="account-holder-name">
                                            {ele.card_holder_name}
                                        </div>
                                    </div>
                                </section>}
                            </div>
                        </details>
                    </div>
                }) : showError ? null : <NoPasswordToSelect />}
            </div>
            {filteredPassword.length !== 0 && <div className="button-con">
                {adding ? <button type="button"><CircularProgress size={20} className='circularloader' /></button> : <button type="button" onClick={() => { addToCollection() }}>Done</button>}
            </div>}
        </div>
    </div>
}

export default AddPassword