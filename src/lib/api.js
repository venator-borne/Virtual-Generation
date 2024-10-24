import axios from 'axios';

const URL = import.meta.env.VITE_SERVER_URL;

export const publicKey = async () => {
  try {
    let res = await axios.get(`${URL}/security/public`);
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const login = async (username, password) => {
  try {
    await axios.post(`${URL}/login`, {
      username: username,
      password: password
    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    })
    return true;
  } catch (e) {
    console.log(e);
    return false;
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
