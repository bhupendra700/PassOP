import { useContext, useState } from "react";
import useWindowSize from "../../Functions/useWindowSize";
import { CircularProgress } from '@mui/material';
import { SaveContext } from "./Save";
import { userAxios } from "../../config/axiosconfig";
import { ContextData } from "../../main";
import { MdEditSquare } from "react-icons/md";

const SaveEmail = () => {
    const { notify, data, setData, setSentDocs, socket } = useContext(ContextData);

    const { isEdit, setIsEdit, emailDocs, setEmailDocs, emailError, setEmailError, cat, setCat, newcat, newsetCat, catagory, setCatagory, loader, setLoader } = useContext(SaveContext);

    const size = useWindowSize();
    const [eye, setEye] = useState(false)

    const addEmail = async () => {
        try {
            setLoader(true)
            const docs = { ...emailDocs, Doctype: "email" }
            const res = await userAxios.post('/addemail', { docs, cat });

            if (res.data.success) {
                setData([...data, res.data.data]);

                if (cat !== "All") {
                    setCatagory(catagory.map((currCat) => {
                        if (currCat.name === cat) {
                            return { ...currCat, passwordID: [...currCat.passwordID, res.data.data._id] }
                        } else {
                            return { ...currCat }
                        }
                    }))

                    if (newcat.name === cat) {
                        newsetCat({ ...newcat, passwordID: [...newcat.passwordID, res.data.data._id] })
                    }
                }
            }

            setEmailDocs({ email: "", password: "", notes: "" })
            setEmailError({ email: "", password: "" })
            setLoader(false)
        } catch (catcherror) {
            setEmailDocs({ email: "", password: "" })
            setLoader(false)
            if (catcherror?.response?.data?.type === "zod") {
                catcherror?.response?.data?.message.forEach((err) => {
                    setEmailError((prev) => {
                        if (err.includes("password")) {
                            return { ...prev, password: err };
                        } else {
                            return { ...prev, email: err }
                        }
                    })
                })
            } else {
                notify("error", catcherror?.response?.data?.message)
            }
        }
    }

    const updateEmail = async () => {
        try {
            setLoader(true)

            const res = await userAxios.post('/editemail', { docs: emailDocs });

            if (res.data.success) {
                setData(data.map((pass) => {
                    if (pass._id === emailDocs._id) {
                        return { ...emailDocs };
                    } else {
                        return pass;
                    }
                }));
            }

            setSentDocs((prev) => prev.map((ele) => {
                if (ele._id === emailDocs._id) {
                    let data = { id: ele.userId, obj: emailDocs };
                    socket.emit("edit", data)
                    return { ...ele, ...emailDocs };
                } else {
                    return ele;
                }
            }))

            setEmailDocs({ email: "", password: "", notes: "" })
            setEmailError({ email: "", password: "" })
            setLoader(false)
            setIsEdit(false)
            notify("success", "Your changes have been saved.")
        } catch (catcherror) {
            setEmailError({ email: "", password: "" })
            setLoader(false)
            if (catcherror?.response?.data?.type === "zod") {
                catcherror?.response?.data?.message.forEach((err) => {
                    setEmailError((prev) => {
                        if (err.includes("password")) {
                            return { ...prev, password: err };
                        } else {
                            return { ...prev, email: err }
                        }
                    })
                })
            } else {
                notify("error", catcherror?.response?.data?.message)
            }
        }

    }

     const [strengthText, setStrengthText] = useState("Very Poor");
    const [color, setColor] = useState("gray");

    const checkPasswordStrength = (password) => {
        let score = 0;

        if (password.length >= 8) score++;        // length >= 8
        if (/[a-z]/.test(password)) score++;      // lowercase
        if (/[A-Z]/.test(password)) score++;      // uppercase
        if (/\d/.test(password)) score++;         // digit
        if (/[^a-zA-Z\d]/.test(password)) score++; // special character

        getColorAndText(score);
    };

    const getColorAndText = (score) => {
        switch (score) {
            case 0:
                setColor("gray");
                setStrengthText("Very Poor");
                break;
            case 1:
                setColor("#FF4000");
                setStrengthText("Poor");
                break;
            case 2:
                setColor("#FF4000");
                setStrengthText("Poor");
                break;
            case 3:
                setColor("#FFA700");
                setStrengthText("Moderate");
                break;
            case 4:
                setColor("#FFA700");
                setStrengthText("Moderate");
                break;
            case 5:
                setColor("green");
                setStrengthText("Strong");
                break;
            default:
                setColor("gray");
                setStrengthText("Very Poor");
        }
    };

    return <form className="save-container" onSubmit={(e) => {
        e.preventDefault();
        isEdit ? updateEmail() : addEmail();
    }}>
        <div className="save-inputs">
            <input type="email" placeholder='Enter email' name='email' value={emailDocs?.email} onChange={(e) => { setEmailDocs({ ...emailDocs, [e.target.name]: e.target.value }) }} />
            {emailError?.email && <div className="error">* {emailError.email}</div>}
        </div>
        <div className={size < 600 ? "wrap" : ""}>
            <div className="password-con">
                <div className="password">
                    <input type={eye ? "text" : "password"} placeholder='Enter password' name='password' value={emailDocs?.password} onChange={(e) => { 
                        setEmailDocs({ ...emailDocs, [e.target.name]: e.target.value })
                        checkPasswordStrength(e.target.value);
                        }} />
                    {eye ? <i className="ri-eye-line" onClick={() => { setEye(!eye) }}></i> : <i className="ri-eye-off-line" onClick={() => { setEye(!eye) }}></i>}
                </div>
                {emailError?.password && <div className="error">* {emailError.password}</div>}
                <div className="strength">Strength <span style={{ color: color }}>{strengthText}</span></div>
            </div>
            <details onClick={(e) => { if (isEdit) { e.preventDefault() } }}>
                <summary id='det2'>
                    {cat} <i className="ri-expand-up-down-line"></i>
                </summary>
                <div>
                    {catagory.map((val) => {
                        return <div onClick={() => { setCat(val.name) }} key={val.name}>{val.name}</div>
                    })}
                </div>
            </details>
        </div>
        <div className="save-inputs">
            <input type="text" placeholder="Enter notes" name='notes' value={emailDocs.notes} onChange={(e) => { setEmailDocs({ ...emailDocs, [e.target.name]: e.target.value }) }} />
        </div>
        {!isEdit ? !loader ? <button type='submit'><i className="ri-list-check-3"></i> Save</button> :
            <button type='button'><CircularProgress className='circularloader' size={19} /></button> :
            <div className="button">
                <button type='button' onClick={(e) => {
                    e.stopPropagation()
                    if (!loader) {
                        setEmailDocs({ email: "", password: "", notes: "" });
                        setEmailError({ email: "", password: "" })
                        setIsEdit(false)
                    }
                }}>Cancel</button>
                {!loader ? <button type='submit'><MdEditSquare className='edit-icon' /> Edit</button> :
                    <button type='button'><CircularProgress className='circularloader' size={19} /></button>}
            </div>}
    </form>
}

export default SaveEmail