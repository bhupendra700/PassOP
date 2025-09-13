import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { createContext, useEffect, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { authAxios, shareAxios } from './config/axiosconfig.js';
import io from "socket.io-client"
import { getToken, onMessage } from "firebase/messaging"
import { messaging } from "./Functions/Firebase.js"

const ContextData = createContext();

const notify = (method, message) => {
    toast.dismiss();
    toast[method](message, {
        position: method === "error" ? "bottom-right" : "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}

const socket = io("http://localhost:8000");

const Root = () => {
    const [user, setUser] = useState(null);

    const [alert, setAlert] = useState(false);

    const [loginLoader, setLoginLoader] = useState(true);

    const [shareableUsers, setShareableUsers] = useState([]);

    const [recieveableUsers, setRecieveableUsers] = useState([]);

    const [sentDocs, setSentDocs] = useState([]);

    const [receivedDocs, setReceivedDocs] = useState([]);

    useEffect(() => {
        console.log("User: ", user);
    }, [user])

    useEffect(() => {
        const isLogedIn = async () => {
            if (!navigator.onLine) {
                setLoginLoader(false)
                return;
            }
            try {
                const res = await authAxios.get('/islogin', { withCredentials: true });
                setUser(res.data.user);

                if (res?.data?.send || res?.data?.send?.length !== 0) {
                    setShareableUsers(res.data.send);
                }

                if (res?.data?.recieved || res?.data?.recieved?.length !== 0) {
                    setRecieveableUsers(res.data.recieved);
                }

                if (res?.data?.sendResult || res?.data?.sendResult?.length !== 0) {
                    setSentDocs(res.data.sendResult);
                }

                if (res?.data?.recievedResult || res?.data?.recievedResult?.length !== 0) {
                    setReceivedDocs(res?.data?.recievedResult)
                }

                setLoginLoader(false)
            } catch (error) {
                console.log(error);
                setLoginLoader(false)
            }
        }

        isLogedIn()
    }, [])

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(false);
            }, 5000);
        }
    }, [alert])

    const [data, setData] = useState([])

    const [passwordCount, setPasswordCount] = useState(0);

    useEffect(() => {
        console.log("Data: ", data);
        setPasswordCount(data.length)
    }, [data])

    useEffect(() => {
        if (user) {
            setData(user.AllPassword)
        }
    }, [user])


    useEffect(() => {
        if (user) {
            socket.emit("register", user._id);

            socket.on("request_send_listen", (userDetails) => {
                setRecieveableUsers([...recieveableUsers, userDetails]);
            })

            socket.on("request_cancel_listen", (userId) => {
                setRecieveableUsers(recieveableUsers.filter((ele) => {
                    return ele.userId !== userId;
                }));
            })

            socket.on("sentRequestAccepted", (userId) => {
                console.log("share: ", shareableUsers);

                const newArr = shareableUsers.map((ele) => {
                    if (ele.userId === userId) {
                        return { ...ele, status: "accepted" }
                    } else {
                        return ele
                    }
                })
                setShareableUsers(newArr)
            })

            socket.on("sentRequestRejected", (userId) => {
                setShareableUsers(shareableUsers.filter((ele) => {
                    return ele.userId !== userId;
                }))
            })

            socket.on("deleteuseranddocsfromsent2", (userId) => {
                setRecieveableUsers(recieveableUsers.filter((ele) => {
                    return ele.userId !== userId;
                }))

                setReceivedDocs(receivedDocs.filter((ele) => {
                    return ele.userId !== userId;
                }))
            })

            socket.on("deleteuseranddocsfromrecieved2", (userId) => {
                setShareableUsers(shareableUsers.filter((ele) => {
                    return ele.userId !== userId;
                }))

                setSentDocs(sentDocs.filter((ele) => {
                    return ele.userId !== userId;
                }))
            })

            socket.on("deletedocsfromsent1", (shareId) => {
                setReceivedDocs(receivedDocs.filter((ele) => {
                    return ele.shareId !== shareId;
                }))
            })

            socket.on("deletedocsfromrecieved1", (shareId) => {
                setSentDocs((prev) => prev.filter((ele) => ele.shareId !== shareId));
            })

            socket.on("adddocs", (obj) => {
                if (obj?.shareId) { //add new docs
                    setReceivedDocs([...receivedDocs, obj])
                } else { //update only
                    setReceivedDocs(receivedDocs.map((ele) => {
                        if (obj._id === ele._id) {
                            return { ...obj, shareId: ele.shareId }
                        } else {
                            return ele;
                        }
                    }))
                }
            })

            socket.on("editRecievedDocs", (obj) => {
                setReceivedDocs((prev) => prev.map((ele) => {
                    if (ele._id === obj._id) {
                        return { ...ele, ...obj };
                    } else {
                        return { ...ele }
                    }
                }))
            })

            socket.on("deleteRecievedDocs", (passwordId) => {
                setReceivedDocs((prev) => prev.filter((ele) => ele._id !== passwordId))
            })

            socket.on("deleteAll", (userId) => {
                setRecieveableUsers((prev) => prev.filter((ele) => ele.userId !== userId))

                setShareableUsers((prev) => prev.filter((ele) => ele.userId !== userId))

                setSentDocs((prev) => prev.filter((ele) => ele.userId !== userId))

                setReceivedDocs((prev) => prev.filter((ele) => ele.userId !== userId));
            })
        }
    }, [user, shareableUsers, recieveableUsers, receivedDocs, sentDocs])

    useEffect(() => {
        const requestPermissionAndGetToken = async () => {
            const permission = await Notification.requestPermission()

            if (permission === "granted") {
                const token = await getToken(messaging, { vapidKey: "BIKWyOoNTRt-Ef0DP1iU1dVf712O5AfdbKOWxIT3s1M89tGYLeMYWuisl-cBh-QizcBipSLPaFuRk36iPexkVRU" })

                const localToken = localStorage.getItem("token");
                if (localToken !== token) {
                    await shareAxios.post("/registerToken", { token });
                    localStorage.setItem("token", token);
                }
            } else {
                console.log("permission is not granted");
            }
        }

        if (user) {
            setTimeout(() => {
                requestPermissionAndGetToken()
            }, 1000 * 40);
        }
    }, [user])

    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            new Notification(payload.data.title, {
                body: payload.data.body,
                icon: '../public/icon.png'
            })
        })

        return () => unsubscribe
    }, [])

    return <ContextData.Provider value={{ notify, user, setUser, alert, setAlert, loginLoader, setLoginLoader, data, setData, passwordCount, setPasswordCount, shareableUsers, setShareableUsers, setRecieveableUsers, recieveableUsers, sentDocs, setSentDocs, receivedDocs, setReceivedDocs, socket }}>
        <Router>
            <App />
        </Router >
        <ToastContainer />
    </ContextData.Provider>
}

createRoot(document.getElementById('root')).render(<Root />)

export { ContextData }