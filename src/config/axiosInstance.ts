import { APP } from "@/constants/endpoints";
import axios from "axios";
import Cookies from 'js-cookie';

const token = Cookies.get('token');

export const axiosInstance = axios.create({
    baseURL: APP.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
});

axios.interceptors.request.use(function (config) {
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });