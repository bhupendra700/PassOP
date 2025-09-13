import { useEffect } from "react";

const useParent = (id) => {
    useEffect(() => {
        const parent = (e) => {
            const ele = document.getElementById(id);
            if(ele && !ele.contains(e.target)){
                ele.removeAttribute("open");
            }
        }

        window.addEventListener("click" , parent)

        return ()=> window.removeEventListener("click", parent)
    }, [])
}

const useChild = (id) => {
    useEffect(() => {
        const child = (e) => {
            const ele = document.getElementById(id);
            if(ele && !ele.contains(e.target)){
                ele.parentElement.removeAttribute("open");
            }
        }

        window.addEventListener("click" , child)

        return ()=> window.removeEventListener("click", child)
    }, [])
}

export {useParent , useChild}