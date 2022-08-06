import axios from 'axios';
import { localStorageKeys, REACT_APP_API_URL } from './constants';
import toaster from './toastMessage';
import { onUserLogOut } from '../store/auth/action';
import store from '../store/index';

const axiosInstance = axios.create();

const errorInterceptor = (errorResponse) => {
  const { message } = errorResponse.data;
  toaster.error(message);
};

axiosInstance.defaults.baseURL = REACT_APP_API_URL;
axiosInstance.interceptors.request.use(
  (req) => {
    const isLoggedIn = localStorage.getItem(localStorageKeys.isLoggedIn);
    // check for token
    if (isLoggedIn) {
      const { token } = JSON.parse(isLoggedIn);
      if (token) req.headers.Authorization = token;
    }

    return req;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (req) => req,
  (err) => {
    if (err.message === 'Network Error') {
      err.response = {
        status: 500,
        data: {
          message: 'Network Unavailable'
        }
      };
    }
    if (err.response.status === 401) {
      localStorage.clear();
      store.dispatch(onUserLogOut());
    }
    errorInterceptor(err.response);
    return Promise.reject(err);
  }
);

export default class HTTPService {
  static get(url, body) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(url, { params: body })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response || error));
    });
  }

  static put(url, body) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .put(url, body)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response || error));
    });
  }

  static post(url, body) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(url, body)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response || error));
    });
  }

  static delete(url, body) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .delete(url, { data: body })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error.response || error));
    });
  }
}
