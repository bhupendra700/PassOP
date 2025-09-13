import { useEffect } from 'react'

const useHandleclickoutside = (popup , container , setState , loader) => {
  useEffect(() => {
    const controller = new AbortController()

    const handleAnywhere = (e) => {
      const childContainer = document.getElementsByClassName(popup)[0];
      if (!loader && !childContainer.contains(e.target)) {
        setState(false)
      }
    }

    const parentcontainer = document.getElementsByClassName(container)[0]

    parentcontainer.addEventListener("click", handleAnywhere, { signal: controller.signal })

    return () => controller.abort()
  }, [loader])
}

export default useHandleclickoutside