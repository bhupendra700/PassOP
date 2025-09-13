import { CircularProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ContextData } from '../../main'
import { userAxios } from '../../config/axiosconfig';
import logo from '../../Images/icon.png'
import smartchip from '../../Images/EMV.png'

const DeletePassword = ({ setDeletePass, deletePass, data, setData, deleteObj, setDeleteObj, isSites, isEmail, setCatagory, setCat, cat }) => {
    const { notify, setSentDocs, socket , sentDocs} = useContext(ContextData);
    const [eye, setEye] = useState(false)

    const deleteFun = async () => {
        try {
            setIsDeleting(true);

            const res = await userAxios.post('/deletepass', { _id: deleteObj._id , deleteObj , sentDocs});

            if (res.data.success) {
                setData(data.filter((pass) => {
                    return pass._id !== deleteObj._id;
                }))
            }

            setCatagory(res.data.collections)

            const newcat = res.data.collections.find((currCat) => {
                return currCat._id === cat._id;
            })

            setCat({ ...newcat })

            setSentDocs((prev) => prev.filter((ele) => {
                if (ele._id === deleteObj._id) {
                    let data = { id: ele.userId, passwordId: deleteObj._id }
                    socket.emit("delete", data);
                }
                return ele._id !== deleteObj._id
            }))

            setIsDeleting(false)
            setDeletePass(false)

        } catch (error) {
            setIsDeleting(false)
            notify("error", error.message);
        }
    }

    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (deletePass) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [deletePass]);

    return <div className="delete-pass-container">
        <div className="del-con">
            <div className="del-header">
                Delete Password
            </div>
            {deleteObj && <div className="message">
                <div className="alert">
                    <i className="ri-error-warning-line"></i> Are you sure?
                </div>
                {deleteObj.Doctype !== "card" ? <div className="pass-con">
                    {deleteObj.Doctype === "password" && <div className="site common">
                        <div className="name">
                            {isSites(deleteObj.url) ? "Sites" : "App"}
                        </div>
                        <div className="value">
                            {deleteObj.url}
                        </div>
                    </div>}
                    <div className="username common">
                        <div className="name">
                            {deleteObj.Doctype === "email" ? "Email" : isEmail(deleteObj.username) ? "Email" : "Username"}
                        </div>
                        <div className="value">
                            {deleteObj.Doctype === "email" ? deleteObj.email : deleteObj.username}
                        </div>
                    </div>
                    <div className="password common">
                        <div className="name">
                            Password
                        </div>
                        <div className="value">
                            <div className="val-pass">
                                {eye ? deleteObj.password : "*".repeat(deleteObj.password.length)}
                            </div>
                            <div className="eye">
                                {eye ? <i className="ri-eye-line" onClick={() => { setEye(false) }}></i> : <i className="ri-eye-off-line" onClick={() => { setEye(true) }}></i>}
                            </div>
                        </div>
                    </div>
                    {deleteObj.notes && <div className="notes common">
                        <div className="name">
                            Notes
                        </div>
                        <div className="value">
                            {deleteObj.notes}
                        </div>
                    </div>}
                </div> : <section className="debit-card">
                    <div className="card-details">
                        <div className="brand-div">
                            <div className="image">
                                <img src={!deleteObj.brandUrl || logo} alt="image" />
                            </div>
                            {<div className="brand-name">
                                {deleteObj.brandName || "PassOP"}
                            </div>}
                        </div>
                        {<div className="card-type">
                            {deleteObj.cardType || ""} Card
                        </div>}
                    </div>
                    <div className="smart-chip">
                        <div className="image">
                            <img src={smartchip} alt="EMV" />
                        </div>
                    </div>
                    <div className="card-holder-details">
                        <div className="card-number">
                            {deleteObj.card_number.match(/.{4}/g).map((cardnumber, cardidx) => {
                                return <div key={cardidx}>{cardnumber}</div>
                            })}
                        </div>
                        <div className="exp-div">
                            <div>VALID THRU</div>
                            <div>{deleteObj.expiry_date}</div>
                        </div>
                        <div className="account-holder-name">
                            {deleteObj.card_holder_name}
                        </div>
                    </div>
                </section>}
            </div>}
            <div className="button">
                <button type='button' onClick={() => {
                    if (!isDeleting) {
                        setDeletePass(false)
                    }
                }}>Cancel</button>
                {isDeleting ? <button type='button'><CircularProgress size={21} className='circularloader' /></button> : <button type='button' onClick={() => { deleteFun() }}>Delete Password</button>}
            </div>
        </div>
    </div>
}

export default DeletePassword