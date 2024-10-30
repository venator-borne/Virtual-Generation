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

export const getResources = async (data) => {
  try {
    let res = await axios.post(`${URL}/resources/files`, data);
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const getResourcesCount = async (data) => {
  try {
    let res = await axios.post(`${URL}/resources/count`, data);
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const check = async (identifier, filename) => {
  try {
    let res = await axios.get(`${URL}/resources/upload?identifier=${identifier}&filename=${filename}`);
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const upload = async (data, retries, onProgress) => {
  try {
    let res = await axios.post(`${URL}/resources/upload`, data, {
      headers: {'Content-Type': 'multipart/form-data'},
      onUploadProgress: onProgress,
    });
    console.log(res.data);
    return true;
  } catch (e) {
    if (retries > 0) {
      return await upload(data, retries - 1, onProgress);
    } else {
      console.log(e.response.data);
      return false;
    }
  }
}

export const merge = async (data) => {
  try {
    let res = await axios.post(`${URL}/resources/merge`, data);
    console.log(res.data);
    return true;
  } catch (e) {
    console.log(e.response.data);
    return false;
  }
}
