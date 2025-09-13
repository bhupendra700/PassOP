import { useEffect, useState } from "react"

const useWindowSize = () => {
  const[size , setSize] = useState(window.innerWidth);

  useEffect(()=>{
    const calwinsize = ()=>{
      setSize(window.innerWidth);
    }

    window.addEventListener("resize" , calwinsize)

    return ()=> window.removeEventListener("resize" , calwinsize)
  },[])

  return size;
}

export default useWindowSize