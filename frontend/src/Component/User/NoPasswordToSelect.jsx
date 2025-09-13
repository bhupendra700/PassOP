import nopassword from "../../Images/nopassword.png"

const NoPasswordToSelect = ({ setSelect }) => {
  return <div className="nopasswordtoselect">
    <div className="message">No passwords are available to add right now!</div>
    <div className="image">
      <img src={nopassword} alt="no_password" />
    </div>
  </div>
}

export default NoPasswordToSelect