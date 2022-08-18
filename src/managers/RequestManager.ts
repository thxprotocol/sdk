import axios, { Axios, AxiosRequestConfig } from 'axios';

import THXError from '../errors/Error';
import ErrorCode from '../errors/ErrorCode';
import { THXClient } from '../index';
import CacheManager from './CacheManager';

class RequestManager extends CacheManager<Axios> {
  constructor(client: THXClient) {
    const axiosClient = axios.create({
      maxRedirects: 0,
      baseURL: 'https://api.thx.network/v1',
      withCredentials: true,
    });

    axiosClient.interceptors.request.use((config) => {
      const user = this.client.session.cached.user;
      if (user && !user.expired) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${user.access_token}`;
      }
      return config;
    });

    super(client, axiosClient);
  }

  private async preflight() {
    if (this.client.session.cached.user) return;
    throw new THXError(ErrorCode.SIGN_IN_REQUIRED);
  }

  async get(url: string, config?: AxiosRequestConfig) {
    await this.preflight();
    return this.cached.get(url, config);
  }

  async post(url: string, config?: AxiosRequestConfig) {
    await this.preflight();
    return this.cached.post(url, config);
  }

  async patch(url: string, config?: AxiosRequestConfig) {
    await this.preflight();
    return this.cached.patch(url, config);
  }

  async put(url: string, config?: AxiosRequestConfig) {
    await this.preflight();
    return this.cached.put(url, config);
  }
}

export default RequestManager;
