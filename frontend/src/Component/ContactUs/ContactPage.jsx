import { useContext, useEffect, useState } from 'react'
import '../../CSS/ContactUs/ContactUsPage.css'
import { CircularProgress } from '@mui/material'
import gaurd from '../../Images/safe.png'
import { Link } from 'react-router-dom'
import { ContextData } from '../../main'
import { userAxios } from '../../config/axiosconfig'


const ContactPage = () => {
    const [loader, setLoader] = useState(false)

    const { user , notify} = useContext(ContextData);

    const [mail, setMail] = useState({ name: "", email: "", message: "" });

    useEffect(() => {
        if (user) {
            setMail({ name: user.name, email: user.email, message: "" });
        }
    }, [user])

    const [error, setError] = useState({ name: "", email: "", message: "" })

    const handleContact = async (e) => {
        e.preventDefault()
        try {
            setLoader(true)

            const res = await userAxios.post('/contactus' , {name : mail.name , email : mail.email , message : mail.message});

            setLoader(false)
            setError({ name: "", email: "", message: "" })
            setMail({ name: user ? user.name : "", email: user ? user.email : "", message: "" })
            notify("success" , res.data.message)
        } catch (catcherror) {
            setLoader(false)
            console.log(catcherror);
            setError({ name: "", email: "", message: "" })
            if (catcherror?.response?.data?.type === "zod") {
                catcherror?.response?.data?.message.forEach((err) => {
                    setError((prev) => {
                        if (err.includes("name")) {
                            return { ...prev, name: err };
                        } else if (err.includes("email")) {
                            return { ...prev, email: err };
                        } else {
                            return { ...prev, message: err }
                        }
                    })
                })
            } else if (catcherror?.response?.data?.type === "server") {
                notify("error", catcherror?.response?.data?.message)
            } else {
                notify("error", catcherror.message)
            }
        }
    }

    const handleChange = (e) => {
        setMail({ ...mail, [e.target.name]: e.target.value });
    }

    return <section className="contact-main-con">
        <div className="contact-page">
            <div className="contact-heading">
                <i className="ri-mail-send-fill"></i> Get in <span>Touch</span>
            </div>
            <form action="" onSubmit={(e) => { handleContact(e) }}>
                <div className="common-contact name">
                    <div className="name-text">Name</div>
                    <div className="input">
                        <i className="ri-user-3-fill"></i>
                        <input type="text" placeholder='Enter Your Name' name="name" value={mail.name} onChange={(e) => { if (!user) { handleChange(e) } }} />
                    </div>
                    {error.name && <div className="error">* {error.name}</div>}
                </div>
                <div className="common-contact email">
                    <div className="email-text">Email</div>
                    <div className="input">
                        <i className="ri-mail-fill"></i>
                        <input type="email" placeholder='Enter Your Email' name="email" value={mail.email} onChange={(e) => { if (!user) { handleChange(e) } }} />
                    </div>
                    {error.email && <div className="error">* {error.email}</div>}
                </div>
                <div className="message">
                    <div className="message-text">Message</div>
                    <textarea name="message" className='contact-message' placeholder='Enter Message Here' value={mail.message} onChange={(e) => { handleChange(e) }}></textarea>
                    {error.message && <div className="error">* {error.message}</div>}
                </div>
                {!loader ? <button type='submit'>Submit</button> :
                    <button type='button'><CircularProgress className='circularbar' size={22} /></button>}
            </form>
        </div>
        <div className="footer">
            <div className="image">
                <img src={gaurd} alt="logo" />
            </div>
            <div className="footer-text">
                Safer with PassOP
            </div>
            <div className="bottom">
                <p>Only You can see your passwords</p>
                <Link className='link' to={"/about"}>Learn more <i className="ri-question-line"></i></Link>
            </div>
        </div>
    </section>
}

export default ContactPage