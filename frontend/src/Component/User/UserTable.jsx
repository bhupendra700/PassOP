import { useContext, useEffect, useState } from "react";
import safe from "../../Images/safe.png"
import useWindowSize from '../../Functions/useWindowSize';
import { CircularProgress } from "@mui/material";
import AddCollection from "./AddCollection";
import RenameCollection from "./RenameCollection";
import DeleteCollections from "./DeleteCollections";
import DeletePassword from "./DeletePassword";
import AddPassword from "./AddPassword";
import NoRessult from "./NoRessult";
import { ContextData } from "../../main";
import NoPassword from '../User/NoPassword'
import { userAxios } from "../../config/axiosconfig";
import { BsCreditCard2Front } from "react-icons/bs";
import { MdOutlineMailLock } from "react-icons/md";
import { IoLink } from "react-icons/io5";
import { RiAppsFill } from "react-icons/ri";
import smartchip from '../../Images/EMV.png'
import email from "../../Images/Email.png"
import logo from '../../Images/icon.png'
import SharePage from "./SharePage";
import card from '../../Images/card.png'
import link from '../../Images/link.png'

const UserTable = ({ catagory, setCatagory, data, setData, setIsEdit, setEditId, setCat, cat }) => {
    const setFilterCatFun = (filterCatPara) => {
        localStorage.setItem("filterCat", filterCatPara);
        return filterCatPara;
    }

    const [filterCat, setFilterCat] = useState(localStorage.getItem("filterCat") || setFilterCatFun("My Vault"))

    const size = useWindowSize();

    const isSites = (url) => {
        const pattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/;
        return pattern.test(url?.trim());
    }

    const isEmail = (email) => {
        return email?.endsWith("@gmail.com");
    }

    useEffect(() => {
        const handleAnywhere = (e) => {
            const add = document.getElementById("add");
            const card_det = document.getElementsByClassName("card-det");
            const show_catagory = document.getElementById("show-catagory");


            if (!add?.contains(e.target)) {
                add?.parentElement.removeAttribute("open")
            }

            for (let i = 0; i < card_det.length; i++) {
                if (!card_det[i]?.contains(e.target)) {
                    card_det[i]?.removeAttribute("open")
                }
            }

            if (!show_catagory?.contains(e.target)) {
                show_catagory?.parentElement?.removeAttribute("open")
            }
        }

        window.addEventListener("click", handleAnywhere)

        return () => window.removeEventListener("click", handleAnywhere)

    }, [])

    const [search, setSearch] = useState("")

    // const Extractfavicon = (url) => {
    //     try {
    //         const regex = /^(?:https?:\/\/)?([^\/]+)/i;
    //         const result = url.match(regex);
    //         if (!result[0].startsWith("https://") && !result[0].startsWith("http://")) {
    //             return `https://www.google.com/s2/favicons?sz=256&domain=https://${result[0]}`
    //         } else {
    //             return `https://www.google.com/s2/favicons?sz=256&domain=${result[0]}`
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return null
    //     }
    // }

    const Extractfavicon = (url) => {
        try {
            const regex = /^(?:https?:\/\/)?([^\/]+)/i;
            const result = url.match(regex);
            return `https://img.logo.dev/${result[0].replace(/^https?:\/{0,2}/, "")}?token=pk_NSQByiwlTFebs6ODOSjSeA`
        } catch (error) {
            return null
        }
    }

    const { notify, user } = useContext(ContextData);

    const [eye, setEye] = useState(false);

    const [select, setSelect] = useState(false)

    const [deletePass, setDeletePass] = useState(false)

    const [showAddCollection, setShowAddCollection] = useState(false)

    const [showRenameCollection, setShowRenameCollection] = useState(false)

    const [showDelCollection, setShowDelCollection] = useState(false)

    const setCatFun = (val) => {
        localStorage.setItem("cat", val.name);
        return val
    }

    const [renderPassword, setRenderPassword] = useState([])

    const map = new Map()

    useEffect(() => {
        if (data && data.length > 0) {
            data.map((ele) => {
                map.set(ele._id, ele);
            })
        }

        let filteredArray = [...data]; // cat === All

        //cat filter
        if (cat.name !== "All") {
            if (cat.passwordID.length > 0) {
                filteredArray = cat.passwordID.map((id) => {
                    return map.get(id);
                })
            } else {
                filteredArray = [];
            }
        }

        //filterCat
        if (filterCat !== "My Vault") {
            if (filterCat === "Passwords") {
                filteredArray = filteredArray.filter((ele) => {
                    return ele.Doctype === "password";
                })
            } else if (filterCat === "Emails") {
                filteredArray = filteredArray.filter((ele) => {
                    return ele.Doctype === "email";
                })
            } else {
                filteredArray = filteredArray.filter((ele) => {
                    return ele.Doctype === "card";
                })
            }
        }


        //search functinallity
        if (search !== "" && filteredArray.length > 0) {

            filteredArray = filteredArray.filter((ele) => {
                if (ele.Doctype === "password") {
                    return ele.url.toLowerCase().includes(search.toLowerCase());
                } else if (ele.Doctype === "email") {
                    return ele.email.toLowerCase().includes(search.toLowerCase());
                } else if (ele.Doctype === "card") {
                    return ele.card_holder_name.toLowerCase().includes(search.toLowerCase()) || ele.card_number.substring(ele.card_number.length - 4).toLowerCase().includes(search.toLowerCase());
                }
            })

            filteredArray.sort((a, b) => {
                let aVal = a.Doctype === "card" ? a.card_holder_name.toLowerCase().includes(search.toLowerCase()) ? a.card_holder_name.toLowerCase().indexOf(search.toLowerCase()) : a.card_number.toLowerCase().indexOf(search.toLowerCase()) : a.Doctype === "email" ? a.email.toLowerCase().indexOf(search.toLowerCase()) : a.url.toLowerCase().indexOf(search.toLowerCase());

                let bVal = b.Doctype === "card" ? b.card_holder_name.toLowerCase().includes(search.toLowerCase()) ? b.card_holder_name.toLowerCase().indexOf(search.toLowerCase()) : b.card_number.toLowerCase().indexOf(search.toLowerCase()) : b.Doctype === "email" ? b.email.toLowerCase().indexOf(search.toLowerCase()) : b.url.toLowerCase().indexOf(search.toLowerCase());

                return aVal - bVal;
            })

            setRenderPassword(filteredArray);
        } else {
            setRenderPassword(filteredArray.reverse());
        }

    }, [data, search, cat, filterCat])

    const [deleteObj, setDeleteObj] = useState(null)

    const makeUrl = (url) => {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        } else {
            return `https://${url}`
        }
    }

    const [deleteCollectionPasswordIdLoader, setDeleteCollectionPasswordIdLoader] = useState(false)

    const [deleteCollectionPasswordId, setDeleteCollectionPasswordId] = useState(null)

    const deletePasswordId = async (passwordId) => {
        try {
            setDeleteCollectionPasswordIdLoader(true)
            await userAxios.post('/deletepasswordfromcollection', { colid: cat._id, passwordId })

            const passwordID = cat.passwordID.filter((passid) => {
                return passid !== deleteCollectionPasswordId
            })

            setCatagory(catagory.map((currCat) => {
                if (currCat.name === cat.name) {
                    return { ...currCat, passwordID }
                } else {
                    return { ...currCat }
                }
            }))

            setCat({ ...cat, passwordID })

            setDeleteCollectionPasswordId(null)
            setDeleteCollectionPasswordIdLoader(false);
        } catch (error) {
            setDeleteCollectionPasswordId(null)
            setDeleteCollectionPasswordIdLoader(false);
            if (error?.response?.data?.message) {
                notify("error", error?.response?.data?.message)
            } else {
                notify("error", error?.message);
            }
        }
    }

    useEffect(() => {
        if (deleteCollectionPasswordId) {
            deletePasswordId(deleteCollectionPasswordId)
        }
    }, [deleteCollectionPasswordId])

    const [count, setCount] = useState({ sites: 0, apps: 0, emails: 0, cards: 0 });

    useEffect(() => {
        let countVar = { "sites": 0, "apps": 0, "emails": 0, "cards": 0 };
        renderPassword.length && renderPassword.forEach(ele => {
            if (ele.Doctype === "card") {
                countVar["cards"]++;
            } else if (ele.Doctype === "email") {
                countVar["emails"]++;
            } else {
                if (isSites(ele.url)) {
                    countVar["sites"]++;
                } else {
                    countVar["apps"]++;
                }
            }
        });
        setCount(countVar);
    }, [renderPassword]);

    const printNonZeroCounts = () => {
        return Object.entries(count).filter(([key, value]) => value !== 0).map(([key, value]) => `${value} ${key}`).join("|");
    }

    const [showShare, setShowShare] = useState(false);

    const [shareDocs, setShareDocs] = useState(null);

    return <>
        <div className='user-table'>
            <div className="user-table-content">
                <div className="user-table-header">
                    <div className="slider">
                        {catagory.map((ele, idx) => {
                            return <div className={cat.name === ele.name ? "green" : ""} onClick={() => { setCat(setCatFun(ele)) }} key={idx}>{ele.name}</div>
                        })}
                    </div>
                    <details id="adddet">
                        <summary id="add">
                            <i className="ri-more-2-fill"></i>
                        </summary>
                        <div>
                            <div onClick={() => { setShowAddCollection(true) }}>Add</div>
                            <div onClick={() => { if (cat.name !== "All") { setShowRenameCollection(true) } }}>Rename</div>
                            <div onClick={() => {
                                if (cat.name !== "All") { setShowDelCollection(true) }
                            }}>Delete</div>
                        </div>
                    </details>
                </div>
                <div className="user-table-main">
                    {(cat.passwordID.length === 0 && cat.name !== "All") ? <NoPassword setSelect={setSelect} /> : <>
                        <div className={`user-table-main-header ${size < 500 ? "wrap" : ""}`}>
                            <div className="wrapper-con">
                                <details>
                                    <summary id="show-catagory">{filterCat} <i className="ri-arrow-down-s-line"></i></summary>
                                    <section className="catagory">
                                        <div onClick={() => { setFilterCat(setFilterCatFun("My Vault")) }}>My Vault</div>
                                        <div onClick={() => { setFilterCat(setFilterCatFun("Passwords")) }}>Passwords</div>
                                        <div onClick={() => { setFilterCat(setFilterCatFun("Emails")) }}>Emails</div>
                                        <div onClick={() => { setFilterCat(setFilterCatFun("Cards")) }}>Cards</div>
                                    </section>
                                </details>
                                {cat.name !== "All" && <div className="add" onClick={() => {
                                    setSelect(true)
                                }}><i className="ri-add-fill"></i></div>}
                            </div>
                            <div className="search-password">
                                <i className="ri-search-line"></i>
                                <input type="text" placeholder={`Search ${filterCat === "My Vault" ? "passwords or cards" : filterCat === "Cards" ? "cards by name or last 4 digits" : "passwords"}`} value={search} onChange={(e) => { setSearch(e.target.value) }} />
                                {search && <i className="ri-close-line" onClick={() => { setSearch("") }}></i>}
                            </div>
                            {cat.name !== "All" && <div className="add" onClick={() => {
                                setSelect(true)
                            }}><i className="ri-add-fill"></i></div>}
                        </div>
                        <div className="app-site-email-card">
                            {filterCat === "My Vault" ? renderPassword.length === 0 ? "0 Sites | 0 Apps | 0 Emails | 0 Cards" : printNonZeroCounts() : filterCat === "Emails" ? renderPassword.length === 0 ? "0 Emails" : `${count.emails} Emails` : filterCat === "Cards" ? renderPassword.length === 0 ? "0 Cards" : `${count.cards} Cards` : renderPassword.length === 0 ? "0 Sites || 0 Apps" : printNonZeroCounts()}
                        </div>
                        {renderPassword.length !== 0 ? <div className="user-table-main-body">
                            {renderPassword.map((ele, idx) => {
                                return <div className="card" key={idx}>
                                    <details className="card-det">
                                        <summary onClick={(e) => { if (eye) { setEye(false) } }}>
                                            <div className={size <= 750 ? "image big-img" : "image"}>
                                                {ele.Doctype === "card" ? <a href={ele.brandUrl || `/${user._id}`} target="_blank">
                                                    <img src={Extractfavicon(ele.brandUrl) || card} alt="link_image" />
                                                </a> : ele.Doctype === "email" ? <a href={`mailto:${ele.email}`} target="_blank">
                                                    <img src={email} alt="link_image" height={20} />
                                                </a> : isSites(ele?.url) ?
                                                    <a href={makeUrl(ele?.url)} target="_blank">
                                                        <img src={Extractfavicon(ele?.url) || link} alt="link_image" height={20} />
                                                    </a>
                                                    :
                                                    <span>{ele?.url?.trim().charAt(0).toUpperCase()}</span>}
                                            </div>
                                            <div className="link-or-site">
                                                {ele.Doctype === "card" ? ele.card_holder_name.toUpperCase() : ele.Doctype === "email" ? ele.email : ele?.url}
                                            </div>
                                            <div className="all-icon">
                                                {filterCat === "My Vault" && (ele.Doctype === "card" ? <BsCreditCard2Front /> : ele.Doctype === "email" ? <MdOutlineMailLock /> : isSites(ele.url) ? <IoLink /> : <RiAppsFill />)}
                                            </div>
                                            <div className="arrow">
                                                <i className="ri-arrow-down-s-line"></i>
                                            </div>
                                            {cat.name !== "All" && <div className="del" onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementsByClassName("card-det")[idx].removeAttribute("open")
                                                if (!deleteCollectionPasswordIdLoader) {
                                                    setDeleteCollectionPasswordId(ele._id)
                                                }
                                            }}>
                                                {deleteCollectionPasswordIdLoader && deleteCollectionPasswordId === ele._id ? <CircularProgress size={20} className='circularloader' /> : <i className="ri-close-circle-line"></i>}
                                            </div>}
                                        </summary>
                                        <div className={size <= 750 ? "padding" : ""}>
                                            {ele.Doctype === "card" ? <section className="debit-card">
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
                                                <div className="bank-details">
                                                    <div className="smart-chip">
                                                        <img src={smartchip} alt="" height={10} />
                                                    </div>
                                                    <div className="bank-con">
                                                        <a href={ele?.bankUrl || `/${user._id}`} target="_blank" className="logo">
                                                            <img src={ele?.bankUrl ? Extractfavicon(ele.bankUrl) : logo} alt="bank_logo" height={5} />
                                                        </a>
                                                        <div className="details">
                                                            {ele.bankName || "PassOP"}
                                                        </div>
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
                                            </section> :
                                                <>
                                                    {ele.Doctype !== "email" && <div className="common site">
                                                        <div className="heading">
                                                            {isSites(ele?.url) ? "Site" : "App"}
                                                        </div>
                                                        <div className="body">
                                                            <div className="content">
                                                                {ele?.url}
                                                            </div>
                                                            <div className="icon" onClick={async () => { await navigator.clipboard.writeText(ele?.url); notify("success", "Copied to clipboard") }}>
                                                                <i className="ri-file-copy-line"></i>
                                                            </div>
                                                        </div>
                                                    </div>}
                                                    <div className="common username">
                                                        <div className="heading">
                                                            {ele.Doctype === "email" ? "Email" : isEmail(ele?.username) ? "Email" : "Username"}
                                                        </div>
                                                        <div className="body">
                                                            <div className="content">
                                                                {ele.Doctype === "email" ? ele.email : ele?.username}
                                                            </div>
                                                            <div className="icon" onClick={async () => {
                                                                await navigator.clipboard.writeText(ele.Doctype === "email" ? ele?.email : ele?.username); notify("success", "Copied to clipboard")
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
                                                                {eye ? ele?.password : "*".repeat(ele?.password.length)}
                                                                {eye ? <i className="ri-eye-line" onClick={() => { setEye(false) }}></i> :
                                                                    <i className="ri-eye-off-line" onClick={() => { setEye(true) }}></i>}
                                                            </div>
                                                            <div className="icon" onClick={async () => {
                                                                await navigator.clipboard.writeText(ele?.password); notify("success", "Copied to clipboard")
                                                            }}>
                                                                <i className="ri-file-copy-line"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>}
                                            {ele?.notes && <div className="common notes">
                                                <div className="heading">
                                                    Notes
                                                </div>
                                                <div className="body">
                                                    <div className="content">
                                                        {ele?.notes}
                                                    </div>
                                                </div>
                                            </div>}
                                            <div className={size <= 500 ? "button wrap" : "button"} >
                                                <button className="share" onClick={() => { setShareDocs(ele); setShowShare(true) }}><i className="ri-share-line"></i> Share</button>
                                                <button onClick={(e) => { e.stopPropagation(); setEditId(ele._id); setIsEdit(true) }}><i className="ri-edit-box-line"></i> Edit</button>
                                                <button onClick={() => { setDeletePass(true); setDeleteObj(ele) }}><i className="ri-delete-bin-2-line"></i> Delete</button>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            })}
                        </div> : <NoRessult />} </>}
                </div>
            </div>
            <div className="user-table-footer">
                <div className="image">
                    <img src={safe} alt="safe_guard" />
                </div>
                <div>Safer with PassOP</div>
            </div>
        </div>
        {showAddCollection && <AddCollection setShowAddCollection={setShowAddCollection} showAddCollection={showAddCollection} setCatagory={setCatagory} catagory={catagory} setCat={setCat} />}
        {showRenameCollection && <RenameCollection setShowRenameCollection={setShowRenameCollection} showRenameCollection={showRenameCollection} setCatagory={setCatagory} catagory={catagory} cat={cat} setCat={setCat} />}
        {showDelCollection && <DeleteCollections setShowDelCollection={setShowDelCollection} showDelCollection={showDelCollection} cat={cat} setCat={setCat} setCatagory={setCatagory} catagory={catagory} />}
        {select && <AddPassword setSelect={setSelect} select={select} data={data} cat={cat} setCat={setCat} makeUrl={makeUrl} isSites={isSites} isEmail={isEmail} Extractfavicon={Extractfavicon} catagory={catagory} setCatagory={setCatagory} />}
        {deletePass && <DeletePassword setDeletePass={setDeletePass} deletePass={deletePass} data={data} setData={setData} deleteObj={deleteObj} setDeleteObj={setDeleteObj} isSites={isSites} isEmail={isEmail} setCatagory={setCatagory} setCat={setCat} cat={cat} />}
        {showShare && <SharePage setShowShare={setShowShare} shareDocs={shareDocs} setShareDocs={setShareDocs} />}
    </>
}

export default UserTable