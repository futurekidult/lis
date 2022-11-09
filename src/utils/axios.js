import axios from 'axios';

axios.defaults.withCredentials = true;

const http = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.request.use((config) => {
  //请求前需执行的操作
  //......
  return config;
});

http.interceptors.response.use(
  (res) => {
    //请求后对响应回来的数据执行的操作
    //......
    return res.data;
  },
  (err) => {
    //对响应错误执行的操作
    //......
    return err;
  }
);

export default http;
