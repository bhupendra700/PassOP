import '../../CSS/User/usermain.css'
import Empty from '../User/Empty';
import { useEffect, useState } from 'react';
import '../../CSS/Home/homemain.css'
import Save from './Save';
import HomeTable from './HomeTable';

const HomeMain = () => {
  const [data, setData] = useState([])
  // const [data, setData] = useState([
  //   {
  //     Doctype: "password",
  //     email: "bhupendra1@gmail.com",
  //     notes: "",
  //     password: "12345678",
  //     url: "PW",
  //     _id: "0415181c-0001-471b-bd90-a13ef11c08ba"
  //   },
  //   {
  //     Doctype: "password",
  //     email: "bhupendra2@gmail.com",
  //     notes: "",
  //     password: "abcd1234",
  //     url: "facebook.com",
  //     _id: "0415181c-0002-471b-bd90-a13ef11c08ba"
  //   },
  //   {
  //     Doctype: "password",
  //     email: "bhupendra3@gmail.com",
  //     notes: "",
  //     password: "pass1234",
  //     url: "twitter.com",
  //     _id: "0415181c-0003-471b-bd90-a13ef11c08ba"
  //   },
  //   {
  //     Doctype: "password",
  //     email: "bhupendra4@gmail.com",
  //     notes: "",
  //     password: "qwerty12",
  //     url: "linkedin.com",
  //     _id: "0415181c-0004-471b-bd90-a13ef11c08ba"
  //   },
  //   {
  //     Doctype: "password",
  //     email: "bhupendra5@gmail.com",
  //     notes: "",
  //     password: "zxcvbn12",
  //     url: "instagram.com",
  //     _id: "0415181c-0005-471b-bd90-a13ef11c08ba"
  //   },
  //   {
  //     Doctype: "password",
  //     email: "bhupendra6@gmail.com",
  //     notes: "",
  //     password: "asdf1234",
  //     url: "netflix.com",
  //     _id: "0415181c-0006-471b-bd90-a13ef11c08ba"
  //   },
  //   {
  //     Doctype: "password",
  //     email: "bhupendra7@gmail.com",
  //     notes: "",
  //     password: "passw0rd",
  //     url: "spotify.com",
  //     _id: "0415181c-0007-471b-bd90-a13ef11c08ba"
  //   },
  //   {
  //     Doctype: "password",
  //     email: "bhupendra8@gmail.com",
  //     notes: "",
  //     password: "hello123",
  //     url: "github.com",
  //     _id: "0415181c-0008-471b-bd90-a13ef11c08ba"
  //   },
  //   {
  //     Doctype: "password",
  //     email: "bhupendra9@gmail.com",
  //     notes: "",
  //     password: "mypassword",
  //     url: "stackoverflow.com",
  //     _id: "0415181c-0009-471b-bd90-a13ef11c08ba"
  //   },
  //   {
  //     Doctype: "password",
  //     email: "bhupendra10",
  //     notes: "",
  //     password: "letmein12",
  //     url: "medium.com",
  //     _id: "0415181c-0010-471b-bd90-a13ef11c08ba"
  //   }, {
  //     Doctype: "card",
  //     email: "4567891234567890",
  //     notes: "Office card",
  //     password: "05/24", // expiry
  //     url: "Anjali Verma", // cardholder name
  //     _id: "3d89c6e2-6e71-49c1-b712-453f0a7f2c2d",
  //     brandUrl: "https://visa.com",
  //     brandName: "Visa",
  //     cardType: "debit",
  //     bankName: "Federal Bank",
  //   },
  //   {
  //     Doctype: "card",
  //     email: "5123456789012345",
  //     notes: "Personal card",
  //     password: "12/26",
  //     url: "Rahul Sharma",
  //     _id: "a7b6c1d2-9e84-4f92-8c9b-2d7f0a1c2b3d",
  //     brandUrl: "https://mastercard.com",
  //     brandName: "Mastercard",
  //     cardType: "credit",
  //     bankName: "HDFC Bank",
  //   },
  //   {
  //     Doctype: "card",
  //     email: "6078123456789012",
  //     notes: "Travel card",
  //     password: "03/25",
  //     url: "Pooja Mehta",
  //     _id: "b1c2d3e4-5f67-48a9-8b0c-9d1e2f3a4b5c",
  //     brandUrl: "https://rupay.co.in",
  //     brandName: "RuPay",
  //     cardType: "debit",
  //     bankName: "ICICI Bank",
  //   },
  //   {
  //     Doctype: "card",
  //     email: "371449635398431",
  //     notes: "Business card",
  //     password: "09/27",
  //     url: "Vikram Singh",
  //     _id: "c3d4e5f6-7a89-4b0c-9d1e-2f3a4b5c6d7e",
  //     brandUrl: "https://americanexpress.com",
  //     brandName: "AMEX",
  //     cardType: "credit",
  //     bankName: "SBI Bank",
  //   }, {
  //     Doctype: "card",
  //     email: "4567891234568970",
  //     notes: "Office card",
  //     password: "05/24",
  //     url: "Anjali Verma",
  //     _id: "3d89c6e2-6e71-49c1-b712-453f0a7f2c2d",
  //     brandUrl: "https://visa.com",
  //     brandName: "Visa",
  //     cardType: "debit",
  //     bankName: "Federal Bank",
  //   },
  //   {
  //     Doctype: "card",
  //     email: "5123456789012345",
  //     notes: "Personal card",
  //     password: "12/26",
  //     url: "Rahul Sharma",
  //     _id: "a7b6c1d2-9e84-4f92-8c9b-2d7f0a1c2b3d",
  //     brandUrl: "",
  //     brandName: "Mastercard",
  //     cardType: "",
  //     bankName: "HDFC Bank",
  //   },
  //   {
  //     Doctype: "card",
  //     email: "6078123456789012",
  //     notes: "Travel card",
  //     password: "03/25",
  //     url: "Pooja Mehta",
  //     _id: "b1c2d3e4-5f67-48a9-8b0c-9d1e2f3a4b5c",
  //     brandUrl: "https://rupay.co.in",
  //     brandName: "",
  //     cardType: "debit",
  //     bankName: "",
  //   },
  //   {
  //     Doctype: "card",
  //     email: "371449635398431",
  //     notes: "Business card",
  //     password: "09/27",
  //     url: "Vikram Singh",
  //     _id: "c3d4e5f6-7a89-4b0c-9d1e-2f3a4b5c6d7e",
  //     brandUrl: "",
  //     brandName: "",
  //     cardType: "",
  //     bankName: "",
  //   },
  //   {
  //     Doctype: "email",
  //     email: "bhupendra7021@gmail.com",
  //     notes: "",
  //     password: "12345678",
  //     _id: "244dd8f8-0c4f-48fd-a08f-b5a243995a94"
  //   },
  //   {
  //     Doctype: "email",
  //     email: "rohitsharma@gmail.com",
  //     notes: "Cricket updates",
  //     password: "87654321",
  //     _id: "312ac2d1-7b94-4b56-95a2-cc7a1f85c7f4"
  //   },
  //   {
  //     Doctype: "email",
  //     email: "anjali.verma@yahoo.com",
  //     notes: "Office use only",
  //     password: "abc12345",
  //     _id: "5a13e9db-123f-49cd-a8a7-86c2bfb2d90b"
  //   },
  //   {
  //     Doctype: "email",
  //     email: "amit.kumar@outlook.com",
  //     notes: "",
  //     password: "password@1",
  //     _id: "e9e77a2b-92b5-4d6c-b23b-91a913cc0a31"
  //   }
  // ])

  const [docs, setDocs] = useState({ url: "", email: "", password: "", notes: "" })

  const [isEdit, setIsEdit] = useState(false)

  const [editId, setEditId] = useState(null)

  useEffect(() => {
    if (editId) {
      setDocs(data.find((ele) => {
        return ele._id === editId;
      }))

      document.getElementById("save-det").open = true;

      setEditId(null);
      window.scroll({
        top: 0,
        behavior: "smooth"
      })
    }
  }, [editId])

  useEffect(() => {
    console.log("Home Data: ", data);
  }, [data])

  return <section className='homemain'>
    <div className="main-container">
      <Save setData={setData} data={data} docs={docs} setDocs={setDocs} isEdit={isEdit} setIsEdit={setIsEdit} />
      {data.length !== 0 ? <HomeTable data={data} setData={setData} setIsEdit={setIsEdit} setEditId={setEditId} /> : <Empty />}
    </div>
  </section>
}

export default HomeMain