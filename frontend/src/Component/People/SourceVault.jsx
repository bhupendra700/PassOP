import logo from "../../Images/icon.png"
import { CircularProgress } from "@mui/material";
import useWindowSize from '../../Functions/useWindowSize';
import { useContext, useEffect, useState } from "react";
import { ContextData } from "../../main";
import { shareAxios } from "../../config/axiosconfig";


const SourceVault = () => {
  const { notify, user, recieveableUsers, setRecieveableUsers, socket, receivedDocs, setReceivedDocs } = useContext(ContextData);

  const [pendingrequest, setPendingRequest] = useState([]);

  const [acceptedRequest, setAcceptedRequest] = useState([]);

  useEffect(() => {
    const pending = [];
    const accepted = [];
    (recieveableUsers || []).map((ele) => {
      if (ele.status === "pending") {
        pending.push({ ...ele, cancelloading: false, acceptloading: false });
      } else {
        accepted.push({ ...ele, loading: false });
      }
      return true;
    })
    setPendingRequest(pending.reverse());
    setAcceptedRequest(accepted.reverse());
  }, [recieveableUsers])

  const acceptRequest = async (idx) => {
    try {
      setPendingRequest(pendingrequest.map((ele, eleidx) => {
        if (eleidx === idx) {
          return { ...ele, acceptloading: true }
        }
        return ele
      }))

      const sender = {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL
      }

      const reciever = {
        _id: pendingrequest[idx].userId,
        name: pendingrequest[idx].name,
        email: pendingrequest[idx].email,
        photoURL: pendingrequest[idx].photoURL
      }

      const res = await shareAxios.post('/acceptrequest', { sender, reciever });

      const data = { MyUserId: user._id, userId: pendingrequest[idx].userId }
      socket.emit("accept-pending-request", data);

      if (res.data.success) {
        setRecieveableUsers(recieveableUsers.map((ele) => {
          if (ele.userId === pendingrequest[idx].userId) {
            return { ...ele, status: "accepted" };
          }
          return ele;
        }))
      }

      await shareAxios.post('/sendNotification', { title: "Request Approved", body: `${user.name[0].toUpperCase() + user.name.slice(1)} (${user.email}) has approved your document share request`, arr_id: [pendingrequest[idx].userId] })

    } catch (error) {
      setPendingRequest(pendingrequest.map((ele, eleidx) => {
        if (eleidx === idx) {
          return { ...ele, acceptloading: false }
        }
        return ele
      }))
      notify("error", error?.response?.data?.message || "Something went wrong!")
    }
  }

  const cancelRequest = async (idx) => {
    try {
      setPendingRequest(pendingrequest.map((ele, eleidx) => {
        if (eleidx === idx) {
          return { ...ele, cancelloading: true }
        }
        return ele
      }))

      const sender = {
        _id: pendingrequest[idx].userId,
        name: pendingrequest[idx].name,
        email: pendingrequest[idx].email,
        photoURL: pendingrequest[idx].photoURL,
      }

      const reciever = {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      }

      const res = await shareAxios.post('/recievedrequestcancel', { sender, reciever });

      const data = { MyUserId: user._id, userId: pendingrequest[idx].userId }
      socket.emit("reject-pending-request", data);

      if (res.data.success) {
        setRecieveableUsers(recieveableUsers.filter((ele) => {
          return ele.userId !== pendingrequest[idx].userId;
        }))
      }

       await shareAxios.post('/sendNotification', { title: "Request Declined", body: `${user.name[0].toUpperCase() + user.name.slice(1)} (${user.email}) has declined your document share request`, arr_id: [pendingrequest[idx].userId] })

    } catch (error) {
      setPendingRequest(pendingrequest.map((ele, eleidx) => {
        if (eleidx === idx) {
          return { ...ele, cancelloading: false }
        }
        return ele
      }))
      notify("error", error?.response?.data?.message || "Something went wrong!")
    }
  }

  const deleteUserFromRequestRecieved = async (idx) => {
    try {
      setAcceptedRequest(acceptedRequest.map((ele, eleidx) => {
        if (eleidx === idx) {
          return { ...ele, loading: true };
        }
        return ele
      }))

      const sender = {
        _id: acceptedRequest[idx].userId,
        name: acceptedRequest[idx].name,
        email: acceptedRequest[idx].email,
        photoURL: acceptedRequest[idx].photoURL,
      }

      const reciever = {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      }

      await shareAxios.post('/deleteUserfromrequestrecieved', { sender, reciever });

      //idhar docs share kiya hua bhi delete karna hoga
      setReceivedDocs(receivedDocs.filter((ele) => {
        return ele.userId !== acceptedRequest[idx].userId;
      }))

      setRecieveableUsers(recieveableUsers.filter((ele) => {
        return ele.userId !== acceptedRequest[idx].userId;
      }));

      const data = { MyUserId: user._id, userId: acceptedRequest[idx].userId };
      socket.emit("deleteuseranddocsfromrecieved", data)

    } catch (error) {
      setAcceptedRequest(acceptedRequest.map((ele, eleidx) => {
        if (eleidx === idx) {
          return { ...ele, loading: false };
        }
        return ele
      }))
      notify("error", error?.response?.data?.message || "Something went wrong!")
    }
  }

  const [searchUser, setSearchUser] = useState("");

  const [renderacceptedRequest, setRenderAcceptedRequest] = useState([]);

  useEffect(() => {
    if (searchUser) {
      setRenderAcceptedRequest(acceptedRequest.filter((ele) => {
        return ele.name.toLowerCase().includes(searchUser.toLowerCase()) || ele.email.toLowerCase().includes(searchUser.toLowerCase());
      }).sort((a, b) => {
        let aVal = a.name.toLowerCase().includes(searchUser.toLowerCase()) ? a.name : a.email;

        let bVal = b.name.toLowerCase().includes(searchUser.toLowerCase()) ? b.name : b.email;

        return aVal.indexOf(searchUser.toLowerCase()) - bVal.indexOf(searchUser.toLowerCase())
      }))
    } else { // searchUser = ""
      setRenderAcceptedRequest(acceptedRequest)
    }
  }, [searchUser, acceptedRequest])

  const size = useWindowSize()
  return <div className='source-vault'>
    {pendingrequest.length !== 0 && <fieldset className='request-pending'>
      <legend>Request Pending</legend>
      {pendingrequest.length !== 0 && <div className='request-status'>
        {(pendingrequest || []).map((ele, idx) => {
          return <div className={`user ${size < 290 ? "wrap" : ""}`} key={idx}>
            <div className="image" style={{ backgroundColor: ele.photoURL }}>
              {!ele.photoURL.startsWith("https://") ? ele.name[0].toUpperCase() : <img src={ele.photoURL} alt="user" />}
            </div>
            <div className="details">
              <div>{ele.name}</div>
              <div>{ele.email}</div>
            </div>
            <button disabled={ele.cancelloading || ele.acceptloading} onClick={() => { acceptRequest(idx) }}>{pendingrequest[idx].acceptloading ? <CircularProgress size={22} className='circularloader' /> : <i className="ri-checkbox-circle-line"></i>}</button>
            <button className="close" disabled={ele.acceptloading || ele.cancelloading} onClick={() => { cancelRequest(idx) }}>{pendingrequest[idx].cancelloading ? <CircularProgress size={22} className='circularloader' /> : <i className="ri-close-circle-line close"></i>}</button>
          </div>
        })}
      </div>}
    </fieldset>}
    {acceptedRequest.length !== 0 && <fieldset className='request-accepted'>
      <legend>Request Accepted</legend>
      <div className="search-con">
        <div>Your Circle : {acceptedRequest.length} Users</div>
        <div className="search">
          <i className="ri-search-line"></i>
          <input value={searchUser} onChange={(e) => { setSearchUser(e.target.value) }} type="text" placeholder='Search users by name or email' />
          {searchUser && <i className="ri-close-line" onClick={() => { setSearchUser("") }}></i>}
        </div>
      </div>
      <section className='request-acceptor'>
        {renderacceptedRequest && renderacceptedRequest.length !== 0 ? (renderacceptedRequest).map((ele, idx) => {
          return <div className="user" key={idx}>
            <div className="image" style={{ backgroundColor: ele.photoURL }}>
              {!ele.photoURL.startsWith("https://") ? ele.name[0].toUpperCase() : <img src={ele.photoURL} alt="image" />}
            </div>
            <div className="details">
              <div>{ele.name}</div>
              <div>{ele.email}</div>
            </div>
            <div>
              {!ele.loading ? <i className="ri-close-circle-line" onClick={() => {
                if (!ele.loading) {
                  deleteUserFromRequestRecieved(idx)
                }
              }}></i> :
                <div><CircularProgress size={22} className='circularloader' /></div>}
              <div>Total : {(() => {
                let count = 0;
                receivedDocs.map((recieved_ele) => {
                  if (recieved_ele.userId === ele.userId) {
                    count++;
                  }
                  return recieved_ele;
                })
                return count;
              })()}</div>
            </div>
          </div>
        }) :
          <div className="noresult">
            No User Found
          </div>}
      </section>
    </fieldset>}
    {(!pendingrequest.length && !acceptedRequest.length) && <div className="noitems">
    </div>}
  </div>
}

export default SourceVault