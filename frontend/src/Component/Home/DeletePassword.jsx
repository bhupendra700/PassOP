import { CircularProgress } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ContextData } from '../../main';
import logo from '../../Images/icon.png'
import smartchip from '../../Images/EMV.png'

const DeletePassword = ({ setDeletePass, deletePass, deleteData, isSites, isEmail, data, setData }) => {
    const { notify } = useContext(ContextData);
    const [eye, setEye] = useState(false)

    const deleteFun = async () => {
        try {
            setIsDeleting(true);

            setData(data.filter((ele) => {
                return ele._id !== deleteData._id;
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

    return deleteData && <div className="delete-pass-container">
        <div className="del-con">
            <div className="del-header">
                Delete Password
            </div>
            <div className="message">
                <div className="alert">
                    <i className="ri-error-warning-line"></i> Are you sure?
                </div>
                {deleteData.Doctype !== "card" ? <div className="pass-con">
                    {deleteData.Doctype === "password" && <div className="site common">
                        <div className="name">
                            {isSites(deleteData.url) ? "Sites" : "App"}
                        </div>
                        <div className="value">
                            {deleteData.url}
                        </div>
                    </div>}
                    <div className="username common">
                        <div className="name">
                            {deleteData.Doctype === "email" ? "Email" : isEmail(deleteData.email) ? "Email" : "Username"}
                        </div>
                        <div className="value">
                            {deleteData.email}
                        </div>
                    </div>
                    <div className="password common">
                        <div className="name">
                            Password
                        </div>
                        <div className="value">
                            <div className="val-pass">
                                {eye ? deleteData.password : "*".repeat(deleteData.password.length)}
                            </div>
                            <div className="eye">
                                {eye ? <i className="ri-eye-line" onClick={() => { setEye(false) }}></i> : <i className="ri-eye-off-line" onClick={() => { setEye(true) }}></i>}
                            </div>
                        </div>
                    </div>
                    {deleteData.notes && <div className="notes common">
                        <div className="name">
                            Notes
                        </div>
                        <div className="value">
                            {deleteData.notes}
                        </div>
                    </div>}
                </div> :
                    <section className="debit-card">
                        <div className="card-details">
                            <div className="brand-div">
                                <div className="image">
                                    <img src={!deleteData.brandUrl || logo} alt="" height={10} />
                                </div>
                                {deleteData.brandName && <div className="brand-name">
                                    {deleteData.brandName}
                                </div>}
                            </div>
                            {<div className="card-type">
                                {deleteData.cardType || ""} Card
                            </div>}
                        </div>
                        <div className="smart-chip">
                            <div className="image">
                                <img src={smartchip} alt="EMV" />
                            </div>
                        </div>
                        <div className="card-holder-details">
                            <div className="card-number">
                                {deleteData.email.match(/.{4}/g).map((cardnumber, cardidx) => {
                                    return <div key={cardidx}>{cardnumber}</div>
                                })}
                            </div>
                            <div className="exp-div">
                                <div>VALID THRU</div>
                                <div>{deleteData.password}</div>
                            </div>
                            <div className="account-holder-name">
                                {deleteData.url}
                            </div>
                        </div>
                    </section>}
            </div>
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