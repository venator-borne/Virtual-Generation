import axios from 'axios';
import store from "../store/store.js";

const URL = import.meta.env.VITE_SERVER_URL;

axios.interceptors.request.use((config) => {
  const token = store.getState().user.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {return Promise.reject(error);});

export const publicKey = async () => {
  try {
    let res = await axios.get(`${URL}/security/public`);
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const login = async (email, password) => {
  try {
    let res = await axios.post(`${URL}/security/login`, {
      email: email,
      password: password
    });
    return {status: true, data: res.data};
  } catch (e) {
    console.log(e);
    return {status: false, data: e.response.data};
  }
}

export const signup = async (info) => {
  try {
    let res = await axios.post(`${URL}/security/signup`, info);
    console.log(res.data);
    return {status: res.status, data: res.data};
  } catch (e) {
    console.log(e.response.data);
    return {status: e.response.status, data: e.response.data};
  }
}

export const logout = async () => {

}
