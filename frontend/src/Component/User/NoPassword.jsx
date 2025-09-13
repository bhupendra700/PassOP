import nopassword from "../../Images/nopassword.png"
const NoPassword = ({ setSelect }) => {
  return <div className="nopassword">
    <div className="message">This collection is currently empty. Add your first password to get started!</div>
    <button onClick={() => {setSelect(true)}}><i className="ri-add-line"></i> Add</button>
    <div className="image">
      <img src={nopassword} alt="no_password" />
    </div>
  </div>
}

export default NoPassword