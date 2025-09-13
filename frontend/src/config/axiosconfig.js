import axios from "axios";

const backendUrl = "https://passop-sj3o.onrender.com"
// const backendUrl = "http://localhost:8000"

const userAxios = axios.create({
    baseURL: `${backendUrl}/user`,
    withCredentials: true
})

const authAxios = axios.create({
    baseURL: `${backendUrl}/auth`,
})

const shareAxios = axios.create({
    baseURL : `${backendUrl}/share`,
    withCredentials : true
})

export { userAxios , authAxios ,shareAxios};