import { useContext, useEffect, useState } from "react";
import useWindowSize from "../../Functions/useWindowSize";
import { CircularProgress } from '@mui/material';
import { SaveContext } from "./Save";
import { userAxios } from "../../config/axiosconfig";
import { ContextData } from "../../main";
import { MdEditSquare } from "react-icons/md";

const SavePassword = () => {
    const { notify, data, setData, setSentDocs, socket } = useContext(ContextData);

    const { isEdit, setIsEdit, passDocs, setPassDocs, passError, setPassError, cat, setCat, newcat, newsetCat, catagory, setCatagory, loader, setLoader } = useContext(SaveContext);

    const size = useWindowSize();
    const [eye, setEye] = useState(false);
    const [strengthText, setStrengthText] = useState("Very Poor");
    const [color, setColor] = useState("gray");

    const addPassword = async () => {
        try {
            setLoader(true)
            const docs = { ...passDocs, Doctype: "password" }
            const res = await userAxios.post('/addpass', { docs, cat });

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

            setPassDocs({ url: "", username: "", password: "", notes: "" })
            setPassError({ url: "", username: "", password: "" })
            setStrengthText("Very Poor")
            setColor("gray")
            setLoader(false);
            notify("success", "Password has been added successfully.")

        } catch (catcherror) {
            setPassError({ url: "", username: "", password: "" })
            setLoader(false)
            if (catcherror?.response?.data?.type === "zod") {
                catcherror?.response?.data?.message.forEach((err) => {
                    setPassError((prev) => {
                        if (err.includes("url")) {
                            return { ...prev, url: err };
                        } else if (err.includes("username")) {
                            return { ...prev, username: err }
                        } else {
                            return { ...prev, password: err }
                        }
                    })
                })
            } else {
                notify("error", catcherror?.response?.data?.message || catcherror?.message || "Something went wrong")
            }
        }
    }

    const updatePassword = async () => {
        try {
            setLoader(true)

            const res = await userAxios.post('/editpass', { docs: passDocs });

            if (res.data.success) {
                setData(data.map((pass) => {
                    if (pass._id === passDocs._id) {
                        return { ...passDocs };
                    } else {
                        return pass;
                    }
                }));
            }

            setPassDocs({ url: "", username: "", password: "", notes: "" })
            setPassError({ url: "", username: "", password: "" })
            setLoader(false);
            setIsEdit(false);
            setStrengthText("Very Poor");
            setColor("gray");

            setSentDocs((prev) => prev.map((ele) => {
                if (ele._id === passDocs._id) {
                    let data = { id: ele.userId, obj: passDocs };
                    socket.emit("edit", data)
                    return { ...ele, ...passDocs };
                } else {
                    return ele;
                }
            }))

            notify("success", "Your changes have been saved.")
        } catch (catcherror) {
            setPassError({ url: "", username: "", password: "" })
            setLoader(false)
            if (catcherror?.response?.data?.type === "zod") {
                catcherror?.response?.data?.message.forEach((err) => {
                    setPassError((prev) => {
                        if (err.includes("url")) {
                            return { ...prev, url: err };
                        } else if (err.includes("username")) {
                            return { ...prev, username: err }
                        } else {
                            return { ...prev, password: err }
                        }
                    })
                })
            } else {
                notify("error", catcherror?.response?.data?.message)
            }
        }
    }

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

    useEffect(() => {
        if (passDocs.password) {
            checkPasswordStrength(passDocs.password)
        }
    }, [passDocs])

    return <form className="save-container" onSubmit={(e) => {
        e.preventDefault();
        isEdit ? updatePassword() : addPassword();
    }}>
        <div className="save-inputs">
            <input type="text" placeholder='Enter url or app name' name='url' value={passDocs?.url} onChange={(e) => { setPassDocs({ ...passDocs, [e.target.name]: e.target.value }) }} />
            {passError?.url && <div className="error">* {passError.url}</div>}
        </div>
        <div className="save-inputs">
            <input type="text" placeholder='Enter username or email' name='username' value={passDocs?.username} onChange={(e) => { setPassDocs({ ...passDocs, [e.target.name]: e.target.value }) }} />
            {passError?.username && <div className="error">* {passError.username}</div>}
        </div>
        <div className={size < 600 ? "wrap" : ""}>
            <div className="password-con">
                <div className="password">
                    <input type={eye ? "text" : "password"} placeholder='Enter password' name='password' value={passDocs?.password} onChange={(e) => {
                        setPassDocs({ ...passDocs, [e.target.name]: e.target.value })
                        checkPasswordStrength(e.target.value);
                    }} />
                    {eye ? <i className="ri-eye-line" onClick={() => { setEye(!eye) }}></i> : <i className="ri-eye-off-line" onClick={() => { setEye(!eye) }}></i>}
                </div>
                {passError?.password && <div className="error">* {passError.password}</div>}
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
            <input type="text" placeholder="Enter notes" name='notes' value={passDocs.notes} onChange={(e) => { setPassDocs({ ...passDocs, [e.target.name]: e.target.value }) }} />
        </div>
        {!isEdit ? !loader ?
            <button type='submit'><i className="ri-list-check-3"></i> Save</button> :
            <button type='button'><CircularProgress className='circularloader' size={19} /></button> :
            <div className="button">
                <button type='button' onClick={(e) => {
                    e.stopPropagation()
                    if (!loader) {
                        setPassDocs({ url: "", username: "", password: "", notes: "" });
                        setPassError({ url: "", username: "", password: "" })
                        setIsEdit(false);
                        setStrengthText("Very Poor");
                        setColor("gray")
                    }
                }}>Cancel</button>
                {!loader ? <button type='submit'><MdEditSquare className='edit-icon' /> Edit</button> :
                    <button type='button'><CircularProgress className='circularloader' size={19} /></button>}
            </div>}
    </form>
}

export default SavePassword