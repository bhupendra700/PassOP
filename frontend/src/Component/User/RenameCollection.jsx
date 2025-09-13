import { CircularProgress } from "@mui/material"
import { useContext, useState } from "react"
import useHandleclickoutside from "../../Functions/useHandleclickoutside"
import useHideScroll from "../../Functions/useHideScroll"
import { ContextData } from "../../main"
import { userAxios } from "../../config/axiosconfig"

const RenameCollection = ({ setShowRenameCollection, showRenameCollection, setCatagory, catagory, cat, setCat }) => {
  const [renaming, setRenaming] = useState(false)
  const { notify } = useContext(ContextData)

  const [inputval, setInputVal] = useState(cat.name)
  const [error, setError] = useState("")

  useHideScroll(showRenameCollection)

  useHandleclickoutside("popup", "rename-collection-container", setShowRenameCollection, renaming)

  const renameCollection = async () => {
    try {
      setRenaming(true)

      const duplicateName = catagory.find((ele) => {
        return ele.name === inputval;
      })

      if (duplicateName) {
        throw new Error("Collection name is already exists.")
      }

      await userAxios.post('/renamecollection', { colid: cat._id, name: inputval });

      localStorage.setItem("cat", inputval);

      setCatagory(catagory.map((ele) => {
        if (ele._id === cat._id) {
          return { ...ele, name: inputval };
        } else {
          return ele;
        }
      }))

      setCat({ ...cat, name: inputval })

      setRenaming(false)
      setShowRenameCollection(false)
      setInputVal("")
    } catch (error) {
      setRenaming(false)
      setError("")
      if (error?.response?.data?.message) {
        if (error?.response?.data?.message.includes("name")) {
          setError(error?.response?.data?.message)
        } else {
          notify("error", error?.response?.data?.message);
        }
      } else {
        notify("error", error.message);
      }
    }
  }

  return <div className="rename-collection-container">
    <div className="popup">
      <div className="rename-col-header">
        <div className="content">Rename Collections</div>
        <div className="close-btn">
          <i className="ri-close-line" onClick={() => { if (!renaming) { setShowRenameCollection(false) } }}></i>
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); renameCollection() }}>
        {inputval && <div>{inputval}</div>}
        <input type="text" maxLength={120} placeholder='Rename Collections' onChange={(e) => { setInputVal(e.target.value) }} value={inputval} required />
        {error && <div className="error">* {error}</div>}
        {renaming ? <button type='button'><CircularProgress size={"19px"} className='circularloader' /></button> : <button type='submit'>Rename</button>}
      </form>
    </div>
  </div>
}

export default RenameCollection