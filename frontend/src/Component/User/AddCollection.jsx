import { CircularProgress } from '@mui/material'
import useHideScroll from '../../Functions/useHideScroll'
import useHandleclickoutside from '../../Functions/useHandleclickoutside';
import { useContext, useState } from 'react';
import { userAxios } from '../../config/axiosconfig';
import { ContextData } from '../../main';

const AddCollection = ({ setShowAddCollection, showAddCollection, setCatagory, catagory, setCat }) => {
  const { notify } = useContext(ContextData)

  const [adding, setAdding] = useState(false)
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useHideScroll(showAddCollection);

  useHandleclickoutside("popup", "add-collection-container", setShowAddCollection, adding);

  const addCollection = async () => {
    try {
      setAdding(true)

      const res = await userAxios.post('/addcollection', { name })
      if (res.data.success) {
        setCatagory([...catagory, res.data.data])

        localStorage.setItem("cat", res.data.data.name)
        setCat(res.data.data);
      }

      setAdding(false)
      setShowAddCollection(false)
      setError("")
      notify("success", res.data.message);

    } catch (error) {
      setAdding(false)
      setError("")
      if (error?.response?.data?.message){
        if (error?.response?.data?.message.includes("name")) {
          setError(error?.response?.data?.message)
        }else {
          notify("error", error?.response?.data?.message);
        }
      } else {
        notify("error", error.message);
      }
    }
  }

  return <div className="add-collection-container">
    <div className="popup">
      <div className="add-col-header">
        <div className="content">Add Collections</div>
        <div className="close-btn" onClick={() => { if (!adding) { setShowAddCollection(false) } }}>
          <i className="ri-close-line"></i>
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); addCollection() }}>
        {name && <div className='show'>{name}</div>}
        <div className="input">
          <input type="text" placeholder='Add Collections' maxLength={100} value={name} onChange={(e) => { setName(e.target.value) }} />
          {error && <div className="error">* {error}</div>}
        </div>
        {adding ? <button type='button'><CircularProgress size={"19px"} className='circularloader' /></button> : <button type='submit'>Add</button>}
      </form>
    </div>
  </div>
}

export default AddCollection