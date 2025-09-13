import { useContext, useEffect, useState } from 'react'
import useWindowSize from '../../Functions/useWindowSize';
import { v4 as uuid } from 'uuid';
import { TbLockPlus } from "react-icons/tb";
import { BsCreditCard2Front } from "react-icons/bs";
import { MdOutlineMailLock, MdEditSquare } from "react-icons/md";
import { ContextData } from '../../main';


const Save = ({ setData, data, docs, setDocs, isEdit, setIsEdit }) => {
    const { setAlert } = useContext(ContextData)
    const DocTypeArr = ["password", "email", "card"]

    const [count, setCount] = useState(localStorage.getItem("count") ? parseInt(localStorage.getItem("count")) : 1);

    const size = useWindowSize();

    const [eye, setEye] = useState(false)

    useEffect(() => {
        const handleAnywhere = (e) => {
            const save_det = document.getElementById("save-det");
            if (!save_det?.contains(e.target)) {
                save_det.removeAttribute("open")
            }
        }

        window.addEventListener("click", handleAnywhere)

        return () => window.removeEventListener("click", handleAnywhere)

    }, [])

    const [error, setError] = useState({ url: "", email: "", password: "" })

    const addDocs = async () => {
        let newError = { url: "", email: "", password: "" };

        if (docs.url === "") {
            if (count !== 3) {
                newError.url = "Please enter url or app name";
            } else {
                newError.url = "Please enter card holder name";
            }
        }

        if (docs.email === "") {
            if (count === 1) {
                newError.email = "Please enter username or email";
            } else if (count === 2) {
                newError.email = "Please enter email";
            } else {
                newError.email = "Please enter card number";
            }
        }

        if (count === 2 && docs.email &&
            (!docs.email.endsWith("@gmail.com") || docs.email.length < 12)) {
            newError.email = "Please enter valid email";
        }

        if (count === 3 && docs.email) {
            if (docs.email.length < 16) {
                newError.email = "Card number must be 16 digits long";
            } else if (isNaN(docs.email)) {
                newError.email = "Card number must contain only digits";
            }
        }

        if (count !== 3 && docs.password.length < 8) {
            newError.password = "Password must be 8 characters long";
        }

        const regex = /^(0[0-9]|1[0-2])\s?\/\s?[0-9]{2}/;

        //validateExpiry
        if (count === 3 && !regex.test(docs.password)) {
            if (!docs.password) {
                newError.password = "Expiry date is required";
            } else if (!regex.test(docs.password)) {
                newError.password = "Please enter expiry date in MM/YY format";
            } else {
                const [month, year] = docs.password.replace(/\s+/g, "").split('/');
                const expDate = new Date(2000 + parseInt(year), month - 1);
                const currDate = new Date();
                if (expDate < currDate) {
                    newError.password = "Card has expired. Please enter a valid expiry date";
                }
            }
        }

        setError(newError);

        if ((count !== 2) && (newError.url !== "" || newError.email !== "" || newError.password !== "")) return;

        if ((count === 2) && (newError.email !== "" || newError.password !== "")) return;

        //password + url
        if (count === 1) {
            setData([...data, { ...docs, _id: uuid(), Doctype: DocTypeArr[count - 1] }])
        } else if (count === 2) {//email
            const obj = { email: docs.email, password: docs.password, notes: docs.notes, _id: uuid(), Doctype: DocTypeArr[count - 1] }

            setData([...data, obj])
        } else {//cards
            // try {
            //     const res = await axios.get(`https://lookup.binlist.net/${docs.email}`)
            //     console.log(res);
            // } catch (error) {
            //     console.log("Error: " , error);
            // }


            // // brandUrl : Extractfavicon(bankUrl);

            // const obj = { url: docs.url, email: docs.email, password: docs.password, notes: docs.notes, _id: uuid(), Doctype: DocTypeArr[count - 1]}

            // setData([...data, obj])

            setAlert(true);
        }

        setDocs({ url: "", email: "", password: "", notes: "" });
        setError({ url: "", email: "", password: "" })
    }

    const updateDoc = () => {
        let newError = { url: "", email: "", password: "" };

        if (docs.url === "") {
            if (count !== 3) {
                newError.url = "Please enter url or app name";
            } else {
                newError.url = "Please enter card holder name";
            }
        }

        if (docs.email === "") {
            if (count === 1) {
                newError.email = "Please enter username or email";
            } else if (count === 2) {
                newError.email = "Please enter email";
            } else {
                newError.email = "Please enter card number";
            }
        }

        if (count === 2 && docs.email &&
            (!docs.email.endsWith("@gmail.com") || docs.email.length < 12)) {
            newError.email = "Please enter valid email";
        }

        if (count === 3 && docs.email) {
            if (docs.email.length < 16) {
                newError.email = "Card number must be 16 digits long";
            } else if (isNaN(docs.email)) {
                newError.email = "Card number must contain only digits";
            }
        }

        if (count !== 3 && docs.password.length < 8) {
            newError.password = "Password must be 8 characters long";
        }

        const regex = /^(0[0-9]|1[0-2])\s?\/\s?[0-9]{2}/;

        //validateExpiry
        if (count === 3 && !regex.test(docs.password)) {
            if (!docs.password) {
                newError.password = "Expiry date is required";
            } else if (!regex.test(docs.password)) {
                newError.password = "Please enter expiry date in MM/YY format";
            } else {
                const [month, year] = docs.password.replace(/\s+/g, "").split('/');
                const expDate = new Date(2000 + parseInt(year), month - 1);
                const currDate = new Date();
                if (expDate < currDate) {
                    newError.password = "Card has expired. Please enter a valid expiry date";
                }
            }
        }

        setError(newError);

        if ((count !== 2) && (newError.url !== "" || newError.email !== "" || newError.password !== "")) return;

        if ((count === 2) && (newError.email !== "" || newError.password !== "")) return;


        if (count === 1) {
            setData([...data, { ...docs, _id: uuid(), Doctype: DocTypeArr[count - 1] }])
        } else if (count === 2) {//email
            const obj = { email: docs.email, password: docs.password, notes: docs.notes, _id: uuid(), Doctype: DocTypeArr[count - 1] }

            setData([...data, obj])
        } else {//cards
            const obj = { url: docs.url, email: docs.email, password: docs.password, notes: docs.notes, _id: uuid(), Doctype: DocTypeArr[count - 1] }

            setData([...data, obj])
        }


        setData(data.map((ele) => {
            if (ele._id === docs._id) {
                return docs
            }
            return ele
        }))

        setDocs({ url: "", email: "", password: "", notes: "" });
        setError({ url: "", email: "", password: "" })
        setIsEdit(false)
    }

    useEffect(() => {
        localStorage.setItem("count", count)
        if (!isEdit) {
            setDocs({ url: "", email: "", password: "", notes: "" })
            setError({ url: "", email: "", password: "" })
        }
    }, [count])

    useEffect(() => {
        if (isEdit) {
            if (docs.Doctype === "password") {
                setCount(1);
            } else if (docs.Doctype === "email") {
                setCount(2);
            } else {
                setCount(3);
            }
        }
    }, [docs])

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

    return <details id="save-det" className={count === 1 ? "passimg-theme" : count === 2 ? "email-theme" : "credit-card-theme"}>
        <summary>
            <div>{count === 1 ? "Add Password" : count === 2 ? "Add Email" : "Add Card"}</div>

            <div className="toggle-switch-main" onClick={(e) => {
                e.stopPropagation(); e.preventDefault();
                if (!isEdit) {
                    setCount((prev) => (((prev % 3) + 1)))
                }
            }}>

                <div className={`toggle-switch-button ${count === 1 ? "passimg" : count === 2 ? "email" : "credit-card"}`}>{count === 1 ? <TbLockPlus className='react-font-lock' /> : count === 2 ? <MdOutlineMailLock className='react-font-email' /> : <BsCreditCard2Front className='react-font-card' />}
                </div>

            </div>

            <div><i className="ri-add-line add"></i><i className="ri-subtract-line sub"></i></div>
        </summary>
        <form className="save-container" onSubmit={(e) => { e.preventDefault(); isEdit ? updateDoc() : addDocs() }}>
            {count !== 2 && <div className="save-inputs">
                <input type="text" placeholder={count === 1 ? 'Enter url or app name' : 'Enter card holder name'} name='url' value={docs.url} onChange={(e) => { setDocs({ ...docs, [e.target.name]: e.target.value }) }} />
                {error.url && <div className="error">* {error.url}</div>}
            </div>}
            <div className="save-inputs">
                <input type="text" placeholder={count === 1 ? 'Enter username or email' : count === 2 ? 'Enter email' : 'Enter card number'} name='email' value={docs.email} onChange={(e) => { setDocs({ ...docs, [e.target.name]: e.target.value }) }} />
                {error.email && <div className="error">* {error.email}</div>}
            </div>
            <div className={size < 600 ? "wrap" : ""}>
                <div className="password-con">
                    <div className="password">
                        <input title={count === 3 ? "e.g:- 02/25" : ""} type={count === 3 ? "text" : eye ? "text" : "password"} placeholder={count === 3 ? 'MM / YY (Expiry date)' : 'Enter password'} name='password' value={docs.password} onChange={(e) => {
                            const password = e.target.value
                            setDocs({ ...docs, [e.target.name]: e.target.value })
                            if (count !== 3) {
                                checkPasswordStrength(password);
                            }
                        }} />
                        {count !== 3 && (eye ? <i className="ri-eye-line" onClick={() => { setEye(!eye) }}></i> : <i className="ri-eye-off-line" onClick={() => { setEye(!eye) }}></i>)}
                    </div>
                    {error.password && <div className="error">* {error.password}</div>}
                    {count !== 3 && <div className="strength">Strength <span style={{ color: color }}>{strengthText}</span></div>}
                </div>
                <details >
                    <summary>
                        All
                    </summary>
                </details>
            </div>
            {count !== 3 && <div className="save-inputs">
                <input type="text" placeholder="Enter notes" name='notes' value={docs.notes} onChange={(e) => { setDocs({ ...docs, [e.target.name]: e.target.value }) }} />
            </div>}
            {!isEdit ? <button type='submit'><i className="ri-list-check-3"></i> Save</button> :
                <div className="button">
                    <button type='button' onClick={() => {
                        setDocs({ url: "", email: "", password: "", notes: "" });
                        setError({ url: "", email: "", password: "" })
                        setIsEdit(false)
                    }}>Cancel</button>
                    <button type='submit'><MdEditSquare className='edit-icon' /> Edit</button>
                </div>}
        </form>
    </details>
}

export default Save