import axios from 'axios';
import { ElMessage } from 'element-plus';

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
    let { code } = res.data;
    if (code !== 200) {
      ElMessage.error(res.data.message);
    }
    return res.data;
  },
  (err) => {
    //对响应错误执行的操作
    //......
    return err;
  }
);

export default http;
