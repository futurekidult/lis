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
  if (config.method === 'post') {
    config.headers['X-CSRFToken'] = localStorage.getItem('logistics-token');
  }
  return config;
});

let isRefreshing = false;
let requests = [];

http.interceptors.response.use(
  async (res) => {
    let { code } = res.data;
    if (code) {
      if (code !== 200 && code !== 40015) {
        if (code === 401) {
          localStorage.removeItem('logistics-token');
          if (process.env.NODE_ENV === 'development') {
            await devLogin();
            return http(res.config);
          } else {
            window.location.href = res.data.data.auth_url;
          }
        } else if (code === 403) {
          ElMessage.error('无权限访问');
        } else if (code === 405) {
          //token过期时，重新获取token并执行刚暂停的请求
          let { config } = res;
          if (!isRefreshing) {
            isRefreshing = true;
            return await refreshToken()
              .then((response) => {
                let token = response.csrftoken;
                config.headers['X-CSRFToken'] = token;
                localStorage.setItem('logistics-token', token);
                config.baseURL = '/api';
                requests.forEach((cb) => {
                  cb(token);
                });
                requests = [];
                return http(config);
              })
              .finally(() => {
                isRefreshing = false;
              });
          } else {
            return new Promise((resolve) => {
              requests.push((token) => {
                config.baseURL = '/api';
                config.headers['X-CSRFToken'] = token;
                resolve(http(config));
              });
            });
          }
        } else {
          ElMessage.error(res.data.message);
        }
        throw new Error(code);
      }
    }
    return res.data;
  },
  (err) => {
    //http code处理
    if (err.response) {
      let { status } = err.response;
      if (status === 404) {
        ElMessage.error('找不到页面！');
      } else if (status === 406) {
        ElMessage.error(err.response.statusText);
      } else if (status === 413) {
        ElMessage.error(err.response.statusText);
      } else if (status === 500) {
        ElMessage.error('服务器出错！');
      } else if (status === 503) {
        window.location.href = `${window.location.protocol}//${window.location.host}/503.html`;
      } else {
        ElMessage.error('未知错误！');
      }
    }
  }
);

const refreshToken = async () => {
  return await http.get('csrftoken-get').then((res) => {
    return res.data;
  });
};

const devLogin = async () => {
  await http.get(`login?id=${process.env.VUE_APP_LOGIN_ID}`).then((res) => {
    return res.data;
  });
};

export default http;
