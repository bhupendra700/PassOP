import '../../CSS/User/usermain.css'
import { CircularProgress } from '@mui/material';
import Save from './Save';
import Empty from './Empty';
import UserTable from './UserTable';
import { useContext, useState } from 'react';
import { ContextData } from '../../main';

const UserMain = () => {
  const { user, data, setData } = useContext(ContextData);

  const [catagory, setCatagory] = useState(user.collections);

  const [passDocs, setPassDocs] = useState({ url: "", username: "", password: "", notes: "" })
  const [emailDocs, setEmailDocs] = useState({ email: "", password: "", notes: "" })
  const [cardDocs, setCardDocs] = useState({ card_holder_name: "", card_number: "", expiry_date: "" })

  const [isEdit, setIsEdit] = useState(false)

  const [editId, setEditId] = useState(null)

  const setValidCat = () => {
    const localcat = localStorage.getItem("cat");

    const allCat = (catagory || []).map((ele) => {
      return ele.name;
    })

    if (localcat && allCat.includes(localcat)) {
      return catagory.find((ele) => {
        return ele.name === localcat
      });
    } else { //localcat = null
      localStorage.setItem("cat", catagory[0]?.name);
      return catagory[0];
    }
  }

  const [cat, setCat] = useState(setValidCat());

  return <section className='usermain'>
    <div className="main-container">
      <Save catagory={catagory} passDocs={passDocs} setPassDocs={setPassDocs} emailDocs={emailDocs} setEmailDocs={setEmailDocs} cardDocs={cardDocs} setCardDocs={setCardDocs} isEdit={isEdit} setIsEdit={setIsEdit} setCatagory={setCatagory} newcat={cat} newsetCat={setCat} editId={editId} setEditId
        ={setEditId} />
      {data.length > 0 ? <UserTable catagory={catagory} setCatagory={setCatagory} data={data} setData={setData} setIsEdit={setIsEdit} setEditId={setEditId} cat={cat} setCat={setCat} /> : <Empty />}
    </div>
  </section>
}

export default UserMain