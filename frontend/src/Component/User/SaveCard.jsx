import { useContext, useEffect } from "react";
import useWindowSize from "../../Functions/useWindowSize";
import { CircularProgress } from '@mui/material';
import { SaveContext } from "./Save";
import { userAxios } from "../../config/axiosconfig";
import { ContextData } from "../../main";
import { MdEditSquare } from "react-icons/md";

const SaveCard = () => {
    const { notify, data, setData } = useContext(ContextData);

    const { isEdit, setIsEdit, cardDocs, setCardDocs, cardError, setCardError, cat, setCat, newcat, newsetCat, catagory, setCatagory, loader, setLoader } = useContext(SaveContext);

    const size = useWindowSize();

    const addCard = async () => {
        try {
            setLoader(true)
            const docs = { ...cardDocs, Doctype: "card" }
            const res = await userAxios.post('/addcard', { docs, cat });

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

            setCardDocs({ card_holder_name: "", card_number: "", expiry_date: "" })
            setCardError({ card_holder_name: "", card_number: "", expiry_date: "" })
            setLoader(false)
        } catch (catcherror) {
            setCardError({ card_holder_name: "", card_number: "", expiry_date: "" })
            setLoader(false)
            if (catcherror?.response?.data?.type === "zod") {
                catcherror?.response?.data?.message.forEach((err) => {
                    setCardError((prev) => {
                        if (err.toLowerCase().includes("card holder name")) {
                            return { ...prev, card_holder_name: err };
                        } else if (err.toLowerCase().includes("card number")) {
                            return { ...prev, card_number: err }
                        } else {
                            return { ...prev, expiry_date: err }
                        }
                    })
                })
            } else {
                notify("error", catcherror?.response?.data?.message)
            }
        }
    }

    const updateCard = async () => {
        try {
            setLoader(true)

            const res = await userAxios.post('/editcard', { docs: cardDocs });

            if (res.data.success) {
                setData(data.map((pass) => {
                    if (pass._id === cardDocs._id) {
                        return { ...res.data.data };
                    } else {
                        return pass;
                    }
                }));
            }

            setSentDocs((prev) => prev.map((ele) => {
                if (ele._id === cardDocs._id) {
                    let data = { id: ele.userId, obj: res.data.data };
                    socket.emit("edit", data)
                    return { ...ele, ...res.data.data };
                } else {
                    return ele;
                }
            }))

            setCardDocs({ card_holder_name: "", card_number: "", expiry_date: "" })
            setCardError({ card_holder_name: "", card_number: "", expiry_date: "" })
            setLoader(false)
            setIsEdit(false)
            notify("success", "Your changes have been saved.")
        } catch (catcherror) {
            setCardError({ card_holder_name: "", card_number: "", expiry_date: "" })
            setLoader(false)
            if (catcherror?.response?.data?.type === "zod") {
                catcherror?.response?.data?.message.forEach((err) => {
                    setCardError((prev) => {
                        if (err.toLowerCase().includes("card holder name")) {
                            return { ...prev, card_holder_name: err };
                        } else if (err.toLowerCase().includes("card number")) {
                            return { ...prev, card_number: err }
                        } else {
                            return { ...prev, expiry_date: err }
                        }
                    })
                })
            } else {
                notify("error", catcherror?.response?.data?.message)
            }
        }
    }

    return <form className="save-container" onSubmit={(e) => {
        e.preventDefault();
        isEdit ? updateCard() : addCard();
    }}>
        <div className="save-inputs cards-mode">
            <input type="text" placeholder='Enter acoount holder name' name='card_holder_name' value={cardDocs?.card_holder_name} onChange={(e) => {
                let value = e.target.value.replace(/[^a-zA-Z\s'-]/g, "")
                value = value.replace(/\s+/g, " ");
                setCardDocs({ ...cardDocs, [e.target.name]: value })
            }} />
            {cardError?.card_holder_name && <div className="error">* {cardError.card_holder_name}</div>}
        </div>
        <div className="save-inputs">
            <input type="text" placeholder='Enter card number' name='card_number' value={cardDocs?.card_number} onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 16) return;
                value = value.replace(/(.{4})/g, "$1 ").trim();
                setCardDocs({ ...cardDocs, [e.target.name]: value });
            }} />
            {cardError?.card_number && <div className="error">* {cardError.card_number}</div>}
        </div>
        <div className={size < 600 ? "wrap" : ""}>
            <div className="password-con">
                <div className="password">
                    <input type="text" title="e.g:- 05/25" placeholder='MM / YY (Expiry date)' name='expiry_date' value={cardDocs?.expiry_date} onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9\/\s]/g, "")
                        setCardDocs({ ...cardDocs, [e.target.name]: value })
                    }} />
                </div>
                {cardError?.expiry_date && <div className="error">* {cardError.expiry_date}</div>}
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
        {!isEdit ? !loader ? <button type='submit'><i className="ri-list-check-3"></i> Save</button> :
            <button type='button'><CircularProgress className='circularloader' size={19} /></button> :
            <div className="button">
                <button type='button' onClick={(e) => {
                    e.stopPropagation()
                    if (!loader) {
                        setCardDocs({ card_holder_name: "", card_number: "", expiry_date: "" });
                        setCardError({ card_holder_name: "", card_number: "", expiry_date: "" })
                        setIsEdit(false)
                    }
                }}>Cancel</button>
                {!loader ? <button type='submit'><MdEditSquare className='edit-icon' /> Edit</button> :
                    <button type='button'><CircularProgress className='circularloader' size={19} /></button>}
            </div>}
    </form>
}

export default SaveCard