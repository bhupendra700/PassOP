import { useContext, useEffect, useState } from 'react'
import { useChild } from '../../Functions/useHandleAnyWhere'
import logo from '../../Images/icon.png'
import nosearch from '../../Images/nosearch.png'
import nothing from '../../Images/nothing.png'
import { CircularProgress } from '@mui/material'
import { ContextData } from '../../main'
import { shareAxios } from '../../config/axiosconfig'

const SharePage = ({ setShowShare, shareDocs, setShareDocs }) => {
    useChild("share-det1")
    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = "auto"
            setShareDocs(null);
        }
    }, [])

    const [searchUser, setSearchUser] = useState("")

    const [loader, setLoader] = useState(false);

    const { notify, user, shareableUsers, setSentDocs, sentDocs, socket } = useContext(ContextData);

    const [shareableUsersList, setShareableUsersList] = useState([]);

    useEffect(() => {
        setShareableUsersList(shareableUsers.filter((ele) => {
            return ele.status === "accepted";
        }).reverse())
    }, [shareableUsers])

    const [renderList, setRenderList] = useState([]);

    useEffect(() => {
        if (searchUser) {
            setRenderList(shareableUsersList.filter((ele) => {
                return ele.name?.toLowerCase().includes(searchUser?.toLowerCase()) || ele.email?.toLowerCase().includes(searchUser?.toLowerCase());
            }).sort((a, b) => {
                let aVal = a.name?.toLowerCase().includes(searchUser?.toLowerCase()) ? a.name : a.email;

                let bVal = b.name?.toLowerCase().includes(searchUser?.toLowerCase()) ? b.name : b.email;

                return aVal.indexOf(searchUser?.toLowerCase()) - bVal.indexOf(searchUser?.toLowerCase())
            }))
        } else { // ""
            setRenderList(shareableUsersList)
        }
    }, [searchUser, shareableUsersList])

    const [disappear, setDisappear] = useState(user?.disappear || "7 Days")

    const [selectedUser, setSelectedUser] = useState([])

    useEffect(() => {
        if (selectedUser.length === 0) {
            setSelectedUser(shareableUsersList.map((ele) => {
                return { ...ele, isSelected: false }
            }))
        } else {
            const map = new Map();

            selectedUser.map((ele) => {
                map.set(ele.email, ele);
                return ele;
            })

            const newSelectedUser = shareableUsersList.map((ele) => {
                if (map.has(ele.email)) {
                    return map.get(ele.email);
                } else {
                    return { ...ele, isSelected: false }
                }
            })

            setSelectedUser(newSelectedUser);
        }
    }, [shareableUsersList])

    const sendDocs = async () => {
        try {
            setLoader(true);
            const arr_of_Id = selectedUser.filter((ele) => ele.isSelected).map((ele) => ele.userId);
            const _id = shareDocs._id;
            const expiredAt = disappear;

            if (!arr_of_Id.length) {
                setLoader(false);
                notify("success", `Please select at least one user to share the ${shareDocs.Doctype.slice(0)}.`)
                return;
            }

            const { data } = await shareAxios.post('/senddocs', { arr_of_Id, _id, expiredAt });

            setLoader(false);
            setShowShare(false);

            let message = "";

            switch (shareDocs.Doctype) {
                case "password":
                    message = "Password shared successfully!";
                    break;
                case "email":
                    message = "Email shared successfully!";
                    break;
                case "card":
                    message = "Card shared successfully!";
                    break;
                default:
                    message = "Item shared successfully!";
            }

            notify("success", message)

            const resId = new Map(data.resId);

            let updateSentDocs = (sentDocs || []).map((ele) => {
                if ((resId.has(ele.userId) && !resId.get(ele.userId)) && (ele._id === shareDocs._id)) { //user exists only update
                    if (expiredAt === "Never") {
                        let newObj = { ...ele, createdAt: new Date() };
                        if (newObj.expiredAt) {
                            delete newObj.expiredAt
                        }

                        return newObj
                    } else {
                        return { ...ele, createdAt: new Date(), expiredAt: new Date(Date.now() + (parseInt(expiredAt) * 24 * 60 * 60 * 1000)) }
                    }
                } else {
                    return { ...ele }
                }
            })

            let userMap = new Map(selectedUser.filter((ele) => {
                return ele.isSelected
            }).map((ele) => {
                return [ele.userId, ele];
            }))

            for (const [key, value] of resId) {
                if (value) {
                    let obj = {
                        ...shareDocs,
                        shareId: value,
                        createdAt: new Date(),
                        userId: key,
                        userEmail: userMap.get(key).email,
                        userName: userMap.get(key).name,
                        userPhotoURL: userMap.get(key).photoURL,
                    }

                    if (expiredAt !== "Never") {
                        obj.expiredAt = new Date(Date.now() + (parseInt(expiredAt) * 24 * 60 * 60 * 1000))
                    }
                    updateSentDocs.push(obj);
                }
            }

            setSentDocs([...updateSentDocs])

            for (const [key, value] of resId) {
                let obj = {
                    ...shareDocs,
                    shareId: value,
                    createdAt: new Date(),
                    userId: user._id,
                    userEmail: user.email,
                    userName: user.name,
                    userPhotoURL: user.photoURL,
                }

                if (expiredAt !== "Never") {
                    obj.expiredAt = new Date(Date.now() + (parseInt(expiredAt) * 24 * 60 * 60 * 1000))
                }

                let emitdata = { id: key, obj}
                socket.emit("shared", emitdata);
            }

            await shareAxios.post('/sendNotification' , {title : `${shareDocs.Doctype[0].toUpperCase() + shareDocs.Doctype.slice(1)} Shared With You` , body : `${user.name[0].toUpperCase() + user.name.slice(1)} (${user.email}) has shared a ${shareDocs.Doctype} with you ${expiredAt === "Never" ? "permanently" : `for ${expiredAt.toLowerCase()}`}` , arr_id : arr_of_Id})

        } catch (error) {
            setLoader(false);
            console.log(error);
            notify("error", error?.response?.data?.message || "Something Went Wrong!")
        }
    }

    return <section className='sharepage-con'>
        <div className="share-con">
            <div className="share-header">
                <div className="share-heading">
                    Share {shareDocs.Doctype || "Password"}
                </div>
                <div onClick={() => { if (!loader) { setShowShare(false) } }}><i className="ri-close-large-line"></i></div>
            </div>
            <div className="disappear-con">
                <div>
                    Disappear : <details>
                        <summary id='share-det1'>
                            {disappear}
                            <i className="ri-arrow-down-s-line"></i>
                        </summary>
                        <div>
                            <div onClick={() => { setDisappear("1 Days") }}>1 Days</div>
                            <div onClick={() => { setDisappear("7 Days") }}>7 Days</div>
                            <div onClick={() => { setDisappear("15 Days") }}>15 Days</div>
                            <div onClick={() => { setDisappear("30 Days") }}>30 Days</div>
                            <div onClick={() => { setDisappear("Never") }}>Never</div>
                        </div>
                    </details>
                </div>
                {!loader ? <button type='button' onClick={() => { sendDocs() }}><i className="ri-share-forward-fill"></i> Share</button> :
                    <button className='loader'><CircularProgress size={19} className='circularloader' /></button>}
            </div>
            {shareableUsersList?.length ? <>
                <div className="search-con">
                    <i className="ri-search-line"></i>
                    <input type="text" value={searchUser} onChange={(e) => { setSearchUser(e.target.value) }} placeholder="Search users by name or email" />
                    {searchUser && <i className="ri-close-large-line" onClick={() => { setSearchUser("") }}></i>}
                </div>
                <fieldset className="user-con">
                    <legend>Authorized Users</legend>
                    {renderList?.length ? (renderList || []).map((ele, idx) => {
                        return <label htmlFor={ele.email} className="user" key={idx}>
                            <div className="image" style={{ backgroundColor: ele.photoURL || "green" }}>
                                {1 ? ele.name[0].toUpperCase() : <img src={logo} alt="image" />}
                            </div>
                            <div className="details">
                                <div>{ele.name}</div>
                                <div>{ele.email}</div>
                            </div>
                            <input id={ele.email} type="checkbox" checked={selectedUser.find((selectele) => { return selectele.email === ele.email })?.isSelected} onChange={() => {
                                if (!loader) {
                                    setSelectedUser(selectedUser.map((selectele) => {
                                        if (selectele.email === ele.email) {
                                            return { ...selectele, isSelected: !selectele?.isSelected }
                                        }
                                        return selectele;
                                    }));
                                }
                            }} />
                        </label>
                    }) : <div className='nosearch'>
                        <img src={nosearch} alt="image" />
                    </div>}
                </fieldset></> : <div className='nouser'>
                <img src={nothing} alt="image" />
            </div>}
        </div>
    </section>
}

export default SharePage