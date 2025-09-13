import { useContext, useEffect, useState } from "react";
import safe from "../../Images/safe.png"
import useWindowSize from '../../Functions/useWindowSize';
import NoResult from "./NoResult";
import { ContextData } from "../../main";
import DeletePassword from "./DeletePassword";
import Email from '../../Images/Email.png'
import { IoLink } from "react-icons/io5";
import { RiAppsFill } from "react-icons/ri";
import { MdOutlineMailLock } from "react-icons/md";
import { BsCreditCard2Front } from "react-icons/bs";
import logo from '../../Images/icon.png'
import smartchip from '../../Images/EMV.png'

const HomeTable = ({ data, setData, setIsEdit, setEditId }) => {
    const size = useWindowSize();

    const setFilterCatFun = (filterCatPara) => {
        localStorage.setItem("filterCat", filterCatPara);
        return filterCatPara;
    }

    useEffect(() => {
        const handleAnywhere = (e) => {
            const add_collection = document.getElementsByClassName("add-collection")[0];
            const card_det = document.getElementsByClassName("card-det");

            const show_catagory = document.getElementById("show-catagory");

            if (!add_collection?.contains(e.target)) {
                add_collection?.removeAttribute("open")
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

    const [filterCat, setFilterCat] = useState(localStorage.getItem("filterCat") || setFilterCatFun("My Vault"))


    const [search, setSearch] = useState("")

    // const Extractfavicon = (url) => {
    //     try {
    //         const regex = /^(?:https?:\/\/)?([^\/]+)/i;
    //         const result = url.match(regex);
    //         if (!result[0].startsWith("https://") && !result[0].startsWith("http://")) {
    //             return `https://www.google.com/s2/favicons?sz=128&domain=https://${result[0]}`
    //         } else {
    //             return `https://www.google.com/s2/favicons?sz=64&domain=${result[0]}`
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
            return `https://img.logo.dev/${result[0].replace(/^https?:\/{0,2}/, "")}?token=pk_Slm3zZ2dQJGp1U_6Wof0sQ`
        } catch (error) {
            return null
        }
    }

    const isSites = (url) => {
        const pattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/;
        return pattern.test(url.trim());
    }

    const isEmail = (email) => {
        return email.endsWith("@gmail.com");
    }

    const { notify, setAlert } = useContext(ContextData);

    const [eye, setEye] = useState(false);

    const [deletePass, setDeletePass] = useState(false)

    const [deleteData, setDeleteData] = useState(null)

    const [count, setCount] = useState({ sites: 0, apps: 0, emails: 0, cards: 0 });

    const [result, setResult] = useState(data);

    useEffect(() => {
        if (search !== "") {
            const filtered = data.filter(ele => {
                if (filterCat === "My Vault") {
                    if (ele.Doctype === "card") {
                        return ele.url.toLowerCase().includes(search.toLowerCase()) || ele.email.substring(ele.email.length - 4).includes(search);
                    } else if (ele.Doctype === "email") {
                        return ele.email.toLowerCase().includes(search.toLowerCase())
                    } else if (filterCat === "password") {
                        return ele.url.toLowerCase().includes(search.toLowerCase())
                    }
                } else if (filterCat === "Passwords" && ele.Doctype === "password") {
                    return ele.url.toLowerCase().includes(search.toLowerCase());
                } else if (filterCat === "Emails" && ele.Doctype === "email") {
                    return ele.email.toLowerCase().includes(search.toLowerCase())
                } else if (filterCat === "Cards" && ele.Doctype === "card") {//cards
                    return ele.url.toLowerCase().includes(search.toLowerCase()) || ele.email.substring(ele.email.length - 4).includes(search);
                }
            }).sort((a, b) => {
                const searchTerm = search.toLowerCase();

                const aVal = (a.Doctype === "card"
                    ? (a.url.toLowerCase().includes(searchTerm) ? a.url.toLowerCase() : a.email.toLowerCase())
                    : (a.url ? a.url.toLowerCase() : a.email.toLowerCase()));

                const bVal = (b.Doctype === "card"
                    ? (b.url.toLowerCase().includes(searchTerm) ? b.url.toLowerCase() : b.email.toLowerCase())
                    : (b.url ? b.url.toLowerCase() : b.email.toLowerCase()));

                const aIndex = aVal.indexOf(searchTerm);
                const bIndex = bVal.indexOf(searchTerm);

                return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
            });

            console.log("Filtered: ", filtered);
            setResult(filtered);
        } else {
            if (filterCat === "My Vault") {
                setResult(data);
            } else {
                setResult(data.filter((ele) => {
                    return ele.Doctype === filterCat.substring(0, filterCat.length - 1).toLowerCase();
                }))
            }
        }
    }, [search, data, filterCat]);

    useEffect(() => {
        let countVar = { "sites": 0, "apps": 0, "emails": 0, "cards": 0 };
        result.length && result.forEach(ele => {
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
    }, [result]);

    const makeUrl = (url) => {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        } else {
            return `https://${url}`
        }
    }

    const printNonZeroCounts = () => {
        return Object.entries(count).filter(([key, value]) => value !== 0).map(([key, value]) => `${value} ${key}`).join("|");
    }

    return <>
        <div className='user-table'>
            <div className="user-table-content">
                <div className="user-table-header">
                    <div className="slider">
                        <div className="green" >All</div>
                    </div>
                    <details id="adddet" className="add-collection">
                        <summary>
                            <i className="ri-more-2-fill"></i>
                        </summary>
                        <div>
                            <div onClick={() => { setAlert(true) }}>Add</div>
                            <div onClick={() => { setAlert(true) }}>Rename</div>
                            <div onClick={() => { setAlert(true) }}>Delete</div>
                        </div>
                    </details>
                </div>
                <div className="user-table-main">
                    <div className={`user-table-main-header ${size < 500 ? "wrap" : ""}`}>
                        <details>
                            <summary id="show-catagory">{filterCat} <i className="ri-arrow-down-s-line"></i></summary>
                            <section className="catagory">
                                <div onClick={() => { setFilterCat(setFilterCatFun("My Vault")) }}>My Vault</div>
                                <div onClick={() => { setFilterCat(setFilterCatFun("Passwords")) }}>Passwords</div>
                                <div onClick={() => { setFilterCat(setFilterCatFun("Emails")) }}>Emails</div>
                                <div onClick={() => { setFilterCat(setFilterCatFun("Cards")) }}>Cards</div>
                            </section>
                        </details>
                        <div className="search-password">
                            <i className="ri-search-line"></i>
                            <input type="text" placeholder={`${filterCat === "My Vault" ? "Search passwords and cards" : filterCat === "Cards" ? "Search cards by name or last 4 digits" : "Search passwords"}`} value={search} onChange={(e) => { setSearch(e.target.value) }} />
                            {search && <i className="ri-close-line" onClick={() => { setSearch("") }}></i>}
                        </div>
                    </div>
                    <div className="app-site-email-card">
                        {filterCat === "My Vault" ? result.length === 0 ? "0 Sites | 0 Apps | 0 Emails | 0 Cards" : printNonZeroCounts() : filterCat === "Emails" ? `${count.emails} Emails` : filterCat === "Cards" ? `${count.cards} Cards` : printNonZeroCounts()}
                    </div>
                    {result.length !== 0 ? <div className="user-table-main-body">
                        {result.length > 0 && result.map((ele, idx) => {
                            return <div className="card" key={idx}>
                                <details className="card-det">
                                    <summary onClick={(e) => { if (eye) { setEye(false) } }}>
                                        <div className={size <= 750 ? "image big-img" : "image"}>
                                            {ele.Doctype === "password" ? <>
                                                {isSites(ele.url) ?
                                                    <a href={makeUrl(ele?.url)} target="_blank">
                                                        <img src={Extractfavicon(ele.url)} alt="link_image" />
                                                    </a>
                                                    :
                                                    <span>{ele.url.trim().charAt(0).toUpperCase()}</span>}
                                            </> : ele.Doctype === "email" ? <a href={`mailTo:${ele.email}`} target="_blank">
                                                <img src={Email} alt="link_image" />
                                            </a> : <a href={ele.brandUrl} target="_blank">
                                                <img src={ele.brandUrl ? Extractfavicon(ele.brandUrl) : logo} alt="link_image" />
                                            </a>}
                                        </div>
                                        <div className="link-or-site">
                                            {ele.Doctype === "email" ? ele.email : ele.url}
                                        </div>
                                        <div className="all-icon">
                                            {filterCat === "My Vault" && (ele.Doctype === "card" ? <BsCreditCard2Front /> : ele.Doctype === "email" ? <MdOutlineMailLock /> : isSites(ele.url) ? <IoLink /> : <RiAppsFill />)}
                                        </div>
                                        <div className="arrow">
                                            <i className="ri-arrow-down-s-line"></i>
                                        </div>
                                    </summary>
                                    <div className={size <= 750 ? "padding" : ""}>
                                        {ele.Doctype === "card" ? <section className="debit-card">
                                            <div className="card-details">
                                                <div className="brand-div">
                                                    {true && <div className="image">
                                                        <img src={ele.brandUrl ? Extractfavicon(ele.brandUrl) : logo} alt="" height={10} />
                                                    </div>}
                                                    {true && <div className="brand-name">
                                                        {ele.brandName}
                                                    </div>}
                                                </div>
                                                <div className="card-type">
                                                    {ele.cardType} Card
                                                </div>
                                            </div>
                                            <div className="smart-chip">
                                                <div className="image">
                                                    <img src={smartchip} alt="" height={10} />
                                                </div>
                                            </div>
                                            <div className="card-holder-details">
                                                <div className="card-number">
                                                    {ele.email.match(/.{4}/g).map((cardnumber, cardidx) => {
                                                        return <div key={cardidx}>{cardnumber}</div>
                                                    })}
                                                </div>
                                                <div className="exp-div">
                                                    <div>VALID THRU</div>
                                                    <div>{ele.password}</div>
                                                </div>
                                                <div className="account-holder-name">
                                                    {ele.url}
                                                </div>
                                            </div>
                                        </section> : <>{ele.Doctype !== "email" && <div className="common site">
                                            <div className="heading">
                                                {isSites(ele.url) ? "Site" : "App"}
                                            </div>
                                            <div className="body">
                                                <div className="content">
                                                    {ele.url}
                                                </div>
                                                <div className="icon" onClick={async () => { await navigator.clipboard.writeText(ele.url); notify("success", "Copied to clipboard") }}>
                                                    <i className="ri-file-copy-line"></i>
                                                </div>
                                            </div>
                                        </div>}
                                            <div className="common username">
                                                <div className="heading">
                                                    {!isEmail(ele.email) ? "Username" : "Email"}
                                                </div>
                                                <div className="body">
                                                    <div className="content">
                                                        {ele.email}
                                                    </div>
                                                    <div className="icon" onClick={async () => {
                                                        await navigator.clipboard.writeText(ele.email);
                                                        notify("success", "Copied to clipboard")
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
                                                    <div className="icon" onClick={async () => {
                                                        await navigator.clipboard.writeText(ele.email);
                                                        notify("success", "Copied to clipboard")
                                                    }}>
                                                        <i className="ri-file-copy-line"></i>
                                                    </div>
                                                </div>
                                            </div>}</>}
                                        <div className={size <= 500 ? "button wrap" : "button"} >
                                            {true && <button className="share" onClick={() => { setAlert(true) }}><i className="ri-share-line"></i> Share</button>}
                                            <button onClick={(e) => { e.stopPropagation(); setEditId(ele._id); setIsEdit(true) }}><i className="ri-edit-box-line"></i> Edit</button>
                                            <button onClick={() => { setDeleteData(ele); setDeletePass(true) }}><i className="ri-delete-bin-2-line"></i> Delete</button>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        })}
                    </div> : <NoResult />}
                </div>
            </div>
            <div className="user-table-footer">
                <div className="image">
                    <img src={safe} alt="safe_guard" />
                </div>
                <div>Safer with PassOP</div>
            </div>
        </div>
        {deletePass && <DeletePassword setDeletePass={setDeletePass} deletePass={deletePass} deleteData={deleteData} isSites={isSites} isEmail={isEmail} data={data} setData={setData} />}
    </>
}

export default HomeTable