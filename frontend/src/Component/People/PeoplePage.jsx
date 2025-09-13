import { useContext, useEffect, useState } from 'react'
import '../../CSS/People/People.css'
import { useChild } from '../../Functions/useHandleAnyWhere'
import useWindowSize from '../../Functions/useWindowSize'
import { ContextData } from '../../main'
import RequestVault from './RequestVault'
import SentVault from './SentVault'
import RecievedVault from './RecievedVault'
import SourceVault from './SourceVault'
import { shareAxios } from '../../config/axiosconfig'

const PeoplePage = () => {

  const { notify, user , setUser , sentDocs , setSentDocs , receivedDocs , setReceivedDocs} = useContext(ContextData)

  useChild("det1")
  useChild("det2")
  useChild("det3")
  useChild("det4")

  const size = useWindowSize();

  const initialActivePage = () => {
    const val = ["Request Vault", "Sent Vault", "Recieved Vault", "Source Vault"].includes(localStorage.getItem("active-page")) ? localStorage.getItem("active-page") : "Request Vault";
    return val;
  }

  const [activePage, setActivePage] = useState(initialActivePage());

  const SetActivePageFun = (val) => {
    localStorage.setItem("active-page", val)
    setActivePage(val)
  }

  const [disappearAfter, setDisappearAfter] = useState(user?.disappear || "7 Days");

  const [disappearAfterLoader, setDisappearAfterLoader] = useState(false);

  const SetDisAppear = async (val) => {
    try {
      setDisappearAfterLoader(true)
      await shareAxios.post('/disappear', { disappear: val });
      setUser({...user , disappear : val})
      setDisappearAfter(val)
      setDisappearAfterLoader(false)
    } catch (error) {
      setDisappearAfterLoader(false)
      console.log(error);
      notify("error", error?.response?.data?.message || "Something went wrong")
    }
  }

  const initialActiveCategory = () => {
    const val = ["All Vault", "Passwords", "Emails", "Cards"].includes(localStorage.getItem("active-category")) ? localStorage.getItem("active-category") : "All Vaults";
    return val;
  }

  const [activeCategory, setActiveCatagory] = useState(initialActiveCategory())

  const SetActiveCatagoryFun = (val) => {
    localStorage.setItem("active-category", val);
    setActiveCatagory(val);
  }

  // const AllUser = [
  //   { _id: "dtyjesjrdtju5rejturywtgr", name: "Bhupendra Yadav", email: "bhupendra7021@gmail.com" },
  //   { _id: "uytresjhdgfyrt56shdghj78", name: "Ankit Sharma", email: "ankit.sharma@example.com" },
  //   { _id: "wertyujkdfgh3456kjhgfds90", name: "Priya Singh", email: "priya.singh@example.com" },
  //   { _id: "zxcvbnm9876poiuytrewq1234", name: "Rahul Verma", email: "rahul.verma@example.com" },
  //   { _id: "lkjhgfdsapoiuytrewq098765", name: "Neha Gupta", email: "neha.gupta@example.com" },
  //   { _id: "mnbvcxz1234qwertyuiop5678", name: "Amit Patel", email: "amit.patel@example.com" },
  //   { _id: "poiuytrewq0987lkjhgfds543", name: "Sneha Mehta", email: "sneha.mehta@example.com" }
  // ]

  const [AllUser , setAllUser] = useState([]);

  const initialUser = () => {
    const id = activePage === "Recieved Vault" ? localStorage.getItem("recievedUserId") : localStorage.getItem("userId");
    if (!id || id === "All Users") {
      return "All Users"
    } else { //id can be any thing
      if (AllUser.length === 0) {
        return "All Users"
      } else {
        const ele = AllUser.find((ele) => {
          return ele.userId === id;
        })
        return ele || "All Users";
      }
    }
  }

  useEffect(()=>{
    setCurrentUser(initialUser())
  },[AllUser])

  const [currentUser, setCurrentUser] = useState(initialUser())

  const SetCurrentUserFun = (ele) => {
    if(activePage === "Recieved Vault"){
      if (ele === "All Users") {
        localStorage.setItem("recievedUserId", ele);
      } else {
        localStorage.setItem("recievedUserId", ele.userId);
      }
    }else{
      if (ele === "All Users") {
        localStorage.setItem("userId", ele);
      } else {
        localStorage.setItem("userId", ele.userId);
      }
    }
    setCurrentUser(ele);
  }

  useEffect(()=>{
    const map = new Map();
    (activePage === "Recieved Vault" ? receivedDocs : sentDocs || []).map((ele)=>{
      map.set(ele.userId , {name : ele.userName , email : ele.userEmail , photoURL : ele.userPhotoURL , userId : ele.userId});

      return {name : ele.userName , email : ele.userEmail , photoURL : ele.userPhotoURL , userId : ele.userId};
    })

    setAllUser([...map.values()]);
  },[sentDocs , receivedDocs , activePage]);

  return <section className='peoplepage-con'>
    <div className="people-header-con">
      <div className={`first-people-header-con ${size < 500 ? "wrap" : ""}`}>
        <details className='common-det'>
          <summary id='det1'>
            {activePage}
            <i className="ri-arrow-down-s-line"></i>
          </summary>
          <div>
            <div onClick={() => { SetActivePageFun("Request Vault") }}>Request Vault {false && <span>10</span>}</div>
            <div onClick={() => { SetActivePageFun("Sent Vault") }}>Sent Vault{false && <span>10</span>}</div>
            <div onClick={() => { SetActivePageFun("Recieved Vault") }}>Recieved Vault {false && <span>10</span>}</div>
            <div onClick={() => { SetActivePageFun("Source Vault") }}>Source Vault {false && <span>10</span>}</div>
          </div>
        </details>
        <div>
          Disappear :
          <details className={`common-det ${disappearAfterLoader ? "loader" : ""}`}>
            <summary id='det2'>
              {disappearAfter}
              <i className="ri-arrow-down-s-line"></i>
            </summary>
            <div>
              <div onClick={() => { if (!disappearAfterLoader) { SetDisAppear("1 Days") } }}>1 Days</div>
              <div onClick={() => { if (!disappearAfterLoader) { SetDisAppear("7 Days") } }}>7 Days</div>
              <div onClick={() => { if (!disappearAfterLoader) { SetDisAppear("15 Days") } }}>15 Days</div>
              <div onClick={() => { if (!disappearAfterLoader) { SetDisAppear("30 Days") } }}>30 Days</div>
              <div onClick={() => { if (!disappearAfterLoader) { SetDisAppear("Never") } }}>Never</div>
            </div>
          </details>
        </div>
      </div>
      {["Sent Vault", "Recieved Vault"].includes(activePage) && <div className={`second-people-header-con ${size < 650 ? "wrap" : ""}`}>
        <details>
          <summary id='det3'>
            {activeCategory}
            <i className="ri-arrow-down-s-line"></i>
          </summary>
          <div>
            <div onClick={() => { SetActiveCatagoryFun("All Vaults") }}>All Vaults</div>
            <div onClick={() => { SetActiveCatagoryFun("Passwords") }}>Passwords</div>
            <div onClick={() => { SetActiveCatagoryFun("Emails") }}>Emails</div>
            <div onClick={() => { SetActiveCatagoryFun("Cards") }}>Cards</div>
          </div>
        </details>
        <div>
          <div>
            User :
          </div>
          <details>
            <summary id='det4'>
              {currentUser !== "All Users" ? <div className='first-div'>
                <div className='box1'>{currentUser.name}</div>
                <div className='box2'>{currentUser.email}</div>
              </div> : <div className='first-div'>
                {currentUser}
              </div>}
              <i className="ri-arrow-down-s-line"></i>
            </summary>
            <div>
              <div onClick={() => { SetCurrentUserFun("All Users") }}>All Users</div>
              {AllUser.length !== 0 && AllUser.map((ele, idx) => {
                return <div onClick={() => { SetCurrentUserFun(ele) }} key={idx}>
                  <div>{ele.name}</div>
                  <div>{ele.email}</div>
                </div>
              })}
            </div>
          </details>
        </div>
      </div>}
    </div>
    <div className="people-main-con">
      {activePage === "Request Vault" ? <RequestVault /> : activePage === "Sent Vault" ? <SentVault activeCategory={activeCategory} currentUser={currentUser} /> : activePage === "Recieved Vault" ? <RecievedVault activeCategory={activeCategory} currentUser={currentUser} /> : <SourceVault />}
    </div>
  </section>
}

export default PeoplePage