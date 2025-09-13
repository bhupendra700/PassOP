import { CircularProgress } from "@mui/material";
import { BsCreditCard2Front } from "react-icons/bs";
import { IoLink } from "react-icons/io5";
import { MdOutlineMailLock } from "react-icons/md";
import { RiAppsFill } from "react-icons/ri";
import logo from '../../Images/icon.png'
import { useContext, useEffect, useState } from "react";
import { ContextData } from "../../main";
import email from '../../Images/Email.png'
import smartchip from '../../Images/EMV.png'
import useWindowSize from "../../Functions/useWindowSize";
import link from '../../Images/link.png'
import card from '../../Images/card.png'
import { shareAxios } from "../../config/axiosconfig";

const RecievedVault = ({ activeCategory, currentUser }) => {

  useEffect(() => {
    const handleAnywhere = (e) => {
      const card_det = document.getElementsByClassName("card-det");

      for (let i = 0; i < card_det.length; i++) {
        if (!card_det[i]?.contains(e.target)) {
          card_det[i]?.removeAttribute("open")
        }
      }
    }

    window.addEventListener("click", handleAnywhere)

    return () => window.removeEventListener("click", handleAnywhere)

  }, [])

  const { user, notify, receivedDocs, setReceivedDocs , socket} = useContext(ContextData);

  // const Extractfavicon = (url) => {
  //   try {
  //     const regex = /^(?:https?:\/\/)?([^\/]+)/i;
  //     const result = url.match(regex);
  //     if (!result[0].startsWith("https://") && !result[0].startsWith("http://")) {
  //       return `https://www.google.com/s2/favicons?sz=64&domain=https://${result[0]}`
  //     } else {
  //       return `https://www.google.com/s2/favicons?sz=64&domain=${result[0]}`
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return null
  //   }
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

  const isSites = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/;
    return pattern.test(url?.trim());
  }

  const makeUrl = (url) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    } else {
      return `https://${url}`
    }
  }

  const isEmail = (email) => {
    return email?.endsWith("@gmail.com");
  }

  const size = useWindowSize();

  const [eye, setEye] = useState(false)

  const arr = [
    {
      _id: "2bc0a73b-efa5-493f-90e8-c75283980d1c",
      Doctype: "password",
      url: "google.com",
      username: "bhupendra7021@gmail.com",
      password: "12345678",
      notes: "hi",
      createdAt: "2025-08-27T14:42:02.698Z",
    },
    {
      _id: "4c401182-7757-4b83-92d8-a108b1f5e844",
      Doctype: "password",
      url: "Bhupendra Yadav",
      username: "bhupendra7021",
      password: "87654321",
      notes: "",
      createdAt: "2025-08-27T14:43:32.290Z",
    },
    {
      _id: "08d57d32-91bb-4e90-80f2-adc73be3eb70",
      Doctype: "email",
      email: "bhupendra7021@gmail.com",
      password: "12345679",
      notes: "hi",
      createdAt: "2025-08-27T15:34:38.480Z",
    },
    {
      _id: "8c0098ea-e191-4321-a26b-37f49ea89a99",
      Doctype: "password",
      url: "youtube.com",
      username: "bhupendra7021@gmail.com",
      password: "12345678",
      notes: "hi",
      createdAt: "2025-08-27T18:18:39.823Z",
    },
    {
      _id: "689a4d66-7066-40db-978a-614bcc94b70d",
      Doctype: "email",
      email: "bhupendra7021@gmail.com",
      password: "12345678",
      notes: "test",
      createdAt: "2025-08-27T18:28:17.838Z",
    },
    {
      _id: "271c564b-6c94-4439-a8c9-cc38071e88fc",
      Doctype: "email",
      email: "bhupendra7021@gmail.com",
      password: "srteytjrukieytjsrha",
      notes: "sfhytdjurkil",
      createdAt: "2025-08-27T18:47:54.747Z",
    },
    {
      _id: "13b36910-7920-44c0-a6bf-5c45e96e638f",
      Doctype: "card",
      card_holder_name: "Bhupendra Yadav",
      card_number: "1111 1111 4571 7360",
      expiry_date: "12/30",
      brandUrl: "https://www.global.jcb/en/products/cards/index.html",
      brandName: "visa",
      card_type: "debit",
      bankName: "Jyske Bank A/S",
      createdAt: "2025-08-28T10:55:07.919Z",
    },
    {
      _id: "353c2f63-e053-4f6b-a4de-7d1e3d0694f1",
      Doctype: "card",
      card_holder_name: "Renu yadav",
      card_number: "6073 8583 2235 2709",
      expiry_date: "02/30",
      brandUrl: "https://www.global.jcb/en/products/cards/index.html",
      brandName: "mastercard",
      card_type: "prepaid",
      bankName: "Pag.A Instituio De Pagamento S.A",
      createdAt: "2025-08-28T10:58:32.799Z",
    },
    {
      _id: "3f9986f1-39ad-49e2-bb62-749bb2562410",
      Doctype: "card",
      card_holder_name: "Renu yadav",
      card_number: "6073 8583 2235 2709",
      expiry_date: "02/30",
      brandUrl: "https://www.global.jcb/en/products/cards/index.html",
      brandName: "mastercard",
      card_type: "prepaid",
      bankName: "Pag.A Instituio De Pagamento S.A",
      createdAt: "2025-08-28T10:59:38.092Z",
    },
    {
      _id: "99298a53-f2d1-4f98-b049-a12d2c53b521",
      Doctype: "card",
      card_holder_name: "Renu yadav",
      card_number: "6073 8583 2235 2709",
      expiry_date: "12/30",
      brandUrl: "https://www.rupay.co.in/our-cards/rupay-credit/explore-the-credit-card-range",
      brandName: "rupay",
      card_type: "debit",
      bankName: "Bank Of Maharashtra",
      createdAt: "2025-08-28T11:03:29.090Z",
    },
    {
      _id: "b66f1508-35bb-4141-b0da-80bd9ff407ff",
      Doctype: "card",
      card_holder_name: "Renu yadav",
      card_number: "6073858322352709",
      expiry_date: "02/30",
      brandUrl: "https://www.rupay.co.in/our-cards/rupay-credit/explore-the-credit-card-range",
      brandName: "rupay",
      card_type: "debit",
      bankName: "Bank Of Maharashtra",
      createdAt: "2025-08-28T14:42:53.692Z",
    },
    {
      _id: "fdff0c54-f56c-4756-aa5d-2d153c0cb223",
      Doctype: "password",
      url: "instagram.com",
      username: "bhupendra7021",
      password: "12345678",
      notes: "insta notes",
      createdAt: "2025-08-28T16:38:27.499Z",
    },
    {
      _id: "4681f4b3-0a8c-4853-96ef-f0c450d1b041",
      Doctype: "password",
      url: "Bhupendra Yadav",
      username: "bhupendra7021@gmail.com",
      password: "12345678",
      notes: "hi",
      createdAt: "2025-08-28T16:46:34.586Z",
    },
    {
      _id: "df52a189-4662-4188-adc2-9866c7358494",
      Doctype: "password",
      url: "apnacollege.in/jmbyvfhfdgndsfg",
      username: "bhupendra7021@gmail.com",
      password: "123456789",
      notes: "apna",
      createdAt: "2025-08-28T23:26:35.636Z",
    },
  ];

  const [renderDocs, setRenderDocs] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    let filterArr = [];

    //filter based on user
    if (currentUser === "All Users") {
      filterArr = [...receivedDocs]
    } else {
      filterArr = receivedDocs.filter((ele) => {
        return ele.userEmail === currentUser.email;
      })
    }

    //filter baesed on active catagory
    if (activeCategory !== "All Vaults") {
      filterArr = filterArr.filter((ele) => {
        return ele.Doctype === activeCategory.toLowerCase().slice(0, -1);
      })
    }

    //search ke basis pe filter
    if (search.trim()) {
      filterArr = [...filterArr].filter((ele) => {
        return ele.Doctype === "password" ? ele.url.toLowerCase().includes(search.trim().toLowerCase()) : ele.Doctype === "email" ? ele.email.toLowerCase().includes(search.trim().toLowerCase()) : ele.card_holder_name.toLowerCase().includes(search.trim().toLowerCase()) || ele.card_number.substring(ele.card_number.length - 4).toLowerCase().includes(search.trim().toLowerCase());
      }).sort((a, b) => {
        let aVal = a.url || a.email || a.card_holder_name.toLowerCase().includes(search.trim().toLowerCase()) ? a.card_holder_name : a.card_number;

        let bVal = b.url || b.email || b.card_holder_name.toLowerCase().includes(search.trim().toLowerCase()) ? b.card_holder_name : b.card_number;

        return aVal - bVal;
      })
    } else {
      filterArr = [...filterArr].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    }

    setRenderDocs([...filterArr]);
  }, [receivedDocs, activeCategory, currentUser, search])


  const [loaderMap, setLoaderMap] = useState(new Map());

  useEffect(() => {
    const map = new Map();
    receivedDocs.map((ele) => {
      if (loaderMap.get(ele.shareId)) {
        map.set(ele.shareId, loaderMap.get(ele.shareId));
      } else {
        map.set(ele.shareId, { loader: false });
      }
      return ele
    })
    setLoaderMap(new Map(map));
  }, [receivedDocs])

  const deleteDoc = async (shareId , userId) => {
    try {
      setLoaderMap(prev => {
        if (!prev.has(shareId)) return prev;
        let newmap = new Map(prev);
        newmap.set(shareId, { loader: true });
        return newmap;
      })

      await shareAxios.post('/deleteRecievedDocs', { _id: shareId });

      const data = { shareId, userId }
      
      socket.emit("deletedocsfromrecieved", data);

      setReceivedDocs(receivedDocs.filter((ele) => {
        return ele.shareId !== shareId;
      }))

      setLoaderMap(prev => {
        if (!prev.has(shareId)) return prev;
        let newmap = new Map(prev);
        newmap.set(shareId, { loader: false });
        return newmap;
      })
    } catch (error) {
      setLoaderMap(prev => {
        if (!prev.has(shareId)) return prev;
        let newmap = new Map(prev);
        newmap.set(shareId, { loader: false });
        return newmap;
      })

      notify("error", error?.response?.data?.message || error?.message || "Something went wrong!");
    }
  }

  useEffect(() => {
    setSearch("")
  }, [activeCategory, currentUser])

  const [records, setRecords] = useState(0);

  useEffect(() => {
    const set = new Set();
    (receivedDocs || []).map((ele) => {
      if (currentUser === "All Users") {
        set.add(ele._id, ele);
      } else {
        if (ele.userEmail === currentUser.email) {
          set.add(ele._id, ele);
        }
      }
    })
    setRecords(set.size);
  }, [receivedDocs, currentUser])

  return <section className='recieved-vault'>
    <fieldset>
      <legend>Recieved</legend>
      {receivedDocs.length ? <>
      <div className="recieved-vault-header">
        <div>
          Records : {records}
        </div>
        <div>
          <i className="ri-search-line"></i>
          <input type="text" placeholder={`Search ${activeCategory === "All Vaults" ? "passwords or cards" : activeCategory === "Cards" ? "cards by name or last 4 digits" : "passwords"}`} value={search} onChange={(e) => { setSearch(e.target.value) }} />
          {search && <i className="ri-close-line" onClick={() => { setSearch("") }}></i>}
        </div>
      </div>
        <div className="recieved-vault-main">
          {renderDocs.length ? (renderDocs.length || search) ? <>
            {renderDocs.map((ele, idx) => {
              return <div className="user" key={idx}>
                <details className="card-det">
                  <summary onClick={(e) => { if (eye) { setEye(false) } }}>
                    {currentUser === "All Users" && <div>
                      <div>
                        <div>{ele.userName}</div>
                        <div>{ele.userEmail}</div>
                      </div>
                      <div className="del">
                        {loaderMap.get(ele.shareId).loader ? <CircularProgress size={20} className='circularloader' /> : <i className="ri-close-circle-line" onClick={(e) => {
                          e.preventDefault();
                          deleteDoc(ele.shareId , ele.userId);
                        }}></i>}
                      </div>
                    </div>}
                    <div>
                      <div className={size <= 750 ? "image big-img" : "image"}>
                        {ele.Doctype === "card" ? <a href={ele.brandUrl || `/${user._id}`} target="_blank">
                          <img src={Extractfavicon(ele.brandUrl) || card} alt="link_image" />
                        </a> : ele.Doctype === "email" ? <a href={`mailto:${ele.email}`} target="_blank">
                          <img src={email} alt="link_image" />
                        </a> : isSites(ele?.url) ?
                          <a href={makeUrl(ele?.url)} target="_blank">
                            <img src={Extractfavicon(ele?.url) || link} alt="link_image" />
                          </a>
                          :
                          <span className="app-name">{ele?.url?.trim().charAt(0).toUpperCase()}</span>}
                        {ele?.expiredAt && <span className="disappear"><i className="bi bi-clock-history"></i></span>}
                      </div>
                      <div className="link-or-site">
                        {ele.Doctype === "card" ? ele.card_holder_name.toUpperCase() : ele.Doctype === "email" ? ele.email : ele?.url}
                      </div>
                      {size > 250 && <div className="all-icon">
                        {activeCategory === "All Vaults" && (ele.Doctype === "card" ? <BsCreditCard2Front /> : ele.Doctype === "email" ? <MdOutlineMailLock /> : isSites(ele.url) ? <IoLink /> : <RiAppsFill />)}
                      </div>}
                      <div className="arrow">
                        <i className="ri-arrow-down-s-line"></i>
                      </div>
                      {currentUser !== "All Users" && <div className="del">
                        {!true ? <CircularProgress size={20} className='circularloader' /> : <i className="ri-close-circle-line"></i>}
                      </div>}
                    </div>
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
                            <img src={ele?.bankUrl ? Extractfavicon(ele.bankUrl) || card : logo} alt="bank_logo" height={5} />
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
                              {eye ? ele?.password : "*".repeat(ele?.password?.length)}
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
                    <div className={`date ${size < 290 ? "wrap" : ""}`} >
                      <div className="created">
                        <span>
                          <i className="ri-calendar-check-fill"></i> {new Date(ele.createdAt).toLocaleDateString("en-GB")}
                        </span>
                        <span>
                          <i className="ri-time-line"></i> {new Date(ele.createdAt).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                      </div>
                      {ele?.expiredAt && <div className="expired">
                        <i className="bi bi-calendar-range"></i> {Math.ceil((new Date(ele.expiredAt) - new Date(ele.createdAt)) / (1000 * 60 * 60 * 24))} Days</div>}
                    </div>
                  </div>
                </details>
              </div>
            })}
          </>
            : <div className="noresult"></div> : <div className="noresult"></div>}
        </div></> : <div className="noitems"></div>}
    </fieldset>
  </section>
}

export default RecievedVault