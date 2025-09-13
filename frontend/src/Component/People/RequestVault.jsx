import logo from "../../Images/icon.png"
import { CircularProgress } from "@mui/material";
import useWindowSize from '../../Functions/useWindowSize';
import { useContext, useEffect, useState } from "react";
import { ContextData } from "../../main";
import { shareAxios } from "../../config/axiosconfig";

const RequestVault = () => {

    const { user, shareableUsers, notify, setShareableUsers, socket, sentDocs, setSentDocs } = useContext(ContextData)

    const [pendingShareableUsers, setPendingShareableUsers] = useState([])

    const [acceptedShareableUsers, setAcceptedShareableUsers] = useState([])

    useEffect(() => {
        const pending = [];
        const accepted = [];
        // console.log("share: " , shareableUsers);
        (shareableUsers || []).map((ele) => {
            if (ele.status === "pending") {
                pending.push({ ...ele, loading: false });
            } else {
                accepted.push({ ...ele, loading: false });
            }
            return true;
        })
        setPendingShareableUsers(pending.reverse());
        setAcceptedShareableUsers(accepted.reverse());
    }, [shareableUsers])

    const [searchUser, setSearchUser] = useState("")

    const [searchUserResult, setSearchUserResult] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        if (searchUserResult) {
            setSearchUserResult(null);
        }
        setSearchUser(e.target.value);
    }

    const searchUserFun = async () => {
        try {
            if (user.email === searchUser) {
                throw new Error("Don't provide your email")
            }

            setIsLoading(true);

            const res = await shareAxios.post('searchuser', { email: searchUser })

            const userAlredyExits = shareableUsers.find((ele) => {
                return ele.userId === res.data.userDB._id;
            })

            if (userAlredyExits) {

                if (userAlredyExits.status === "pending") {
                    notify("success", "Request already sent. Waiting for response.")
                } else {
                    notify("success", "Request already accepted.")
                }

                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            setSearchUserResult(res.data.userDB);
        } catch (error) {
            setIsLoading(false);
            setSearchUserResult("noresult");
            notify("error", error?.response?.data?.message || error?.message || "Something went wrong")
        }
    }

    const [isRequesting, setIsRequesting] = useState(false);

    const sendRequest = async () => {
        try {
            setIsRequesting(true)

            const sender = {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL
            }

            const reciever = searchUserResult;

            const res = await shareAxios.post('/sendrequest', { sender, reciever })

            setShareableUsers([...shareableUsers, res.data.request]);

            const data = { userId: searchUserResult._id, userDetails: res.data.userRequest }

            socket.emit("request_send", data);
            setSearchUserResult(null);
            setIsRequesting(false)

            
            await shareAxios.post('/sendNotification' , {title : "New Share Request" , body : `${user.name[0].toUpperCase() + user.name.slice(1)} (${user.email}) wants to share documents with you. Confirm or cancel` , arr_id : [searchUserResult._id]})

        } catch (error) {
            setIsRequesting(false)
            notify("error", error?.response?.data?.message || "Something went wrong")
        }
    }

    const cancelRequest = async (idx) => {
        try {
            setPendingShareableUsers(pendingShareableUsers.map((ele, mapidx) => {
                if (mapidx === idx) {
                    return { ...ele, loading: true };
                }
                return ele;
            }))

            const sender = {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL
            }

            const reciever = {
                _id: pendingShareableUsers[idx].userId,
                name: pendingShareableUsers[idx].name,
                email: pendingShareableUsers[idx].email,
                photoURL: pendingShareableUsers[idx].photoURL,
            }

            const res = await shareAxios.post('/sendRequestCancel', { sender, reciever });

            const data = { MyUserId: user._id, userId: pendingShareableUsers[idx].userId }

            socket.emit("request_cancel", data)

            if (res.data.success) {
                setShareableUsers(shareableUsers.filter((ele) => {
                    return ele.userId !== pendingShareableUsers[idx].userId;
                }))
            }
        } catch (error) {
            setPendingShareableUsers(pendingShareableUsers.map((ele, mapidx) => {
                if (mapidx === idx) {
                    return { ...ele, loading: false };
                }
                return ele;
            }))
            notify("error", error?.response?.data?.message || "Something went wrong")
        }
    }

    const size = useWindowSize()

    const deleteUserfromrequestsent = async (idx) => {
        try {
            setRenderAcceptedShareableUsers(renderAcceptedShareableUsers.map((ele, eleidx) => {
                if (eleidx === idx) {
                    return { ...ele, loading: true }
                }
                return ele;
            }))

            const sender = {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
            }

            const reciever = {
                _id: renderAcceptedShareableUsers[idx].userId,
                name: renderAcceptedShareableUsers[idx].name,
                email: renderAcceptedShareableUsers[idx].email,
                photoURL: renderAcceptedShareableUsers[idx].photoURL,
            }

            const res = await shareAxios.post('/deleteUserfromrequestsent', { sender, reciever });

            if (res.data.success) {
                //idhar docs delete karna baki hai
                setSentDocs(sentDocs.filter((ele) => {
                    return ele.userId !== renderAcceptedShareableUsers[idx].userId
                }))

                setShareableUsers(shareableUsers.filter((ele) => {
                    return ele.userId !== renderAcceptedShareableUsers[idx].userId
                }))

                const data = { MyUserId: user._id, userId: renderAcceptedShareableUsers[idx].userId }
                socket.emit("deleteuseranddocsfromsent", data);
            }
        } catch (error) {
            setRenderAcceptedShareableUsers(renderAcceptedShareableUsers.map((ele, eleidx) => {
                if (eleidx === idx) {
                    return { ...ele, loading: false }
                }
                return ele;
            }))
            notify("error", error?.response?.data?.message || "Something went wrong");
        }
    }

    const [filterUser, setFilterUser] = useState("")

    const [renderAcceptedShareableUsers, setRenderAcceptedShareableUsers] = useState([]);

    useEffect(() => {
        if (filterUser) {
            setRenderAcceptedShareableUsers(acceptedShareableUsers.filter((ele) => {
                return ele.name.toLowerCase().includes(filterUser.toLowerCase()) || ele.email.toLowerCase().includes(filterUser.toLowerCase());
            }).sort((a, b) => {
                let aVal = a.name.toLowerCase().includes(filterUser.toLowerCase()) ? a.name : a.email;

                let bVal = b.name.toLowerCase().includes(filterUser.toLowerCase()) ? b.name : b.email;

                return aVal.indexOf(filterUser.toLowerCase()) - bVal.indexOf(filterUser.toLowerCase())
            }))
        } else { // searchUser = ""
            setRenderAcceptedShareableUsers(acceptedShareableUsers)
        }

    }, [filterUser, acceptedShareableUsers])

    return <div className='request-vault'>
        <fieldset className='request-sent'>
            <legend>Requests Sent</legend>
            <div className="request-search">
                <div className="search">
                    <i className="ri-search-line"></i>
                    <input onKeyDown={(e) => { if (e.key === "Enter") { searchUserFun() } }} type="text" placeholder='Send request by email' value={searchUser} onChange={(e) => { handleChange(e) }} />
                    {searchUser && <i className="ri-close-large-line" onClick={() => { setSearchUser("") }}></i>}
                </div>
                {(isLoading || searchUserResult) && <div className='result'>
                    {(searchUserResult && searchUserResult !== "noresult") ? <div className={`user ${size < 290 ? "wrap" : ""}`}>
                        <div className="image" style={{ backgroundColor: searchUserResult.photoURL }}>
                            {false ? <img src={logo} alt='user' height={10} /> : searchUserResult.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div className='details'>
                            <div>{searchUserResult.name}</div>
                            <div>{searchUserResult.email}</div>
                        </div>
                        <button disabled={isRequesting} onClick={() => { sendRequest() }}>{isRequesting ? <CircularProgress size={18} className='circularloader' /> : <>Request <i className="ri-send-plane-2-line"></i></>}</button>
                    </div> : isLoading ? <div className='noresult'><CircularProgress className="circularloader" size={25} /></div> : <div className='noresult'>No Result Found</div>}
                </div>}
            </div>
            {pendingShareableUsers.length !== 0 && <div className='request-sended'>
                {pendingShareableUsers.map((ele, idx) => {
                    return <div className={`user ${size < 290 ? "wrap" : ""}`} key={idx}>
                        <div className="image" style={{ backgroundColor: ele.photoURL }}>
                            {true ? ele.name.substring(0, 1).toUpperCase() : <img src={ele.photoURL} alt="user" />}
                        </div>
                        <div className="details">
                            <div>{ele.name}</div>
                            <div>{ele.email}</div>
                        </div>
                        <button className="close" disabled={pendingShareableUsers[idx].loading} onClick={() => { cancelRequest(idx) }}>{pendingShareableUsers[idx].loading ? <CircularProgress size={26} className='circularloader' /> : <i className="ri-close-circle-line close"></i>}</button>
                    </div>
                })}
            </div>}
        </fieldset>
        {acceptedShareableUsers.length !== 0 && <fieldset className='request-accepted'>
            <legend>Active Sharing</legend>
            <div className="search-con">
                <div>Shared With: {acceptedShareableUsers.length} Users</div>
                <div className="search">
                    <i className="ri-search-line"></i>
                    <input type="text" value={filterUser} onChange={(e) => { setFilterUser(e.target.value) }} placeholder='Search users by name or email' />
                    {filterUser && <i className="ri-close-line" onClick={() => { setFilterUser("") }}></i>}
                </div>
            </div>
            <section className='request-acceptor'>
                {renderAcceptedShareableUsers.length === 0 ? <div className="noresult">No User Found</div> : renderAcceptedShareableUsers.map((ele, idx) => {
                    return <div className="user" key={idx}>
                        <div className="image" style={{ backgroundColor: ele.photoURL }}>
                            {1 ? ele.name[0].toUpperCase() : <img src={logo} alt="image" />}
                        </div>
                        <div className="details">
                            <div>{ele.name}</div>
                            <div>{ele.email}</div>
                        </div>
                        <div>
                            {!ele.loading ? <i className="ri-close-circle-line" onClick={() => { deleteUserfromrequestsent(idx) }}></i> :
                                <div><CircularProgress size={22} className='circularloader' /></div>}
                            <div>Total : {(()=>{
                                let count = 0;
                                sentDocs.map((sended_ele)=>{
                                    if(sended_ele.userId === ele.userId){
                                        count++;
                                    }
                                    return sended_ele;
                                })
                                return count;
                            })()}</div>
                        </div>
                    </div>
                })}

            </section>
        </fieldset>}
        {(!pendingShareableUsers.length && !acceptedShareableUsers.length) && <div className="noitems">
        </div>}
    </div>
}

export default RequestVault