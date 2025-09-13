import axios from "axios";

const userAxios = axios.create({
    baseURL: "http://localhost:8000/user",
    withCredentials: true
})

const authAxios = axios.create({
    baseURL: "http://localhost:8000/auth",
})

const shareAxios = axios.create({
    baseURL : "http://localhost:8000/share",
    withCredentials : true
})

export { userAxios , authAxios ,shareAxios};