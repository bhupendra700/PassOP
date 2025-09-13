import axios from "axios";

const userAxios = axios.create({
    baseURL: "https://passop-sj3o.onrender.com/user",
    withCredentials: true
})

const authAxios = axios.create({
    baseURL: "https://passop-sj3o.onrender.com/auth",
})

const shareAxios = axios.create({
    baseURL : "https://passop-sj3o.onrender.com/share",
    withCredentials : true
})

export { userAxios , authAxios ,shareAxios};