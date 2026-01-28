import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URI;

const userAxios = axios.create({
    baseURL: `${backendUrl}/user`,
    withCredentials: true
})

const authAxios = axios.create({
    baseURL: `${backendUrl}/auth`,
    withCredentials: true
})

const shareAxios = axios.create({
    baseURL : `${backendUrl}/share`,
    withCredentials : true
})

const paymentAxios = axios.create({
    baseURL : `${backendUrl}/payment`,
    withCredentials : true,
})

export { userAxios , authAxios ,shareAxios , backendUrl , paymentAxios};