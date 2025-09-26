import { CircularProgress } from "@mui/material"
import { useContext, useState } from "react"
import useHandleclickoutside from "../../Functions/useHandleclickoutside"
import useHideScroll from "../../Functions/useHideScroll";
import { userAxios } from "../../config/axiosconfig";
import { ContextData } from "../../main";

const DeleteCollections = ({ setShowDelCollection, showDelCollection, cat, setCat, setCatagory, catagory }) => {
    const [deleting, setDeleting] = useState(false);

    const { notify } = useContext(ContextData)

    useHandleclickoutside("popup", "delete-collection-container", setShowDelCollection, deleting);

    useHideScroll(showDelCollection);


    const deleteCollection = async () => {
        try {
            setDeleting(true);

            const res = await userAxios.post('/deletecollection', { colid: cat._id })

            if (res.data.success) {
                let catTempId = 0;
                setCatagory(catagory.filter((ele, idx) => {
                    if (ele._id === cat._id) {
                        catTempId = idx - 1;
                    }
                    return ele._id !== cat._id
                }))
                localStorage.setItem("cat", catagory[catTempId].name);

                setCat(catagory[catTempId]);
            }

            setDeleting(false);
            setShowDelCollection(false);
            notify("success", res.data.message);
        } catch (error) {
            setDeleting(false)
            if (error?.response?.data?.message) {
                notify("error", error?.response?.data?.message)
            } else {
                notify("error", error?.message);
            }
        }
    }

    return <div className="delete-collection-container">
        <div className="popup">
            <div className="del-col-header">
                Delete Collections
            </div>
            <div className="message">
                Are you sure you want to delete the collection <p>{cat.name} ?</p>. This action is permanent and cannot be undone.
            </div>
            <div className="button">
                <button type="button" onClick={() => { if (!deleting) { setShowDelCollection(false) } }}>Cancel</button>
                {deleting ? <button type="button" className="loader"><CircularProgress size={19} className="circularloader" /></button> : <button type="button" onClick={() => { deleteCollection() }}>Delete Collections</button>}
            </div>
        </div>
    </div>
}

export default DeleteCollections