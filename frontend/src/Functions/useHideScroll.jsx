import { useEffect } from "react"

const useHideScroll = (dependancy) => {
    useEffect(() => {
        if (dependancy) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
        return () => document.body.style.overflow = "auto"
    }, [dependancy])
}

export default useHideScroll