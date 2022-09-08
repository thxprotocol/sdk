import THXError from '../errors/Error';
import ErrorCode from '../errors/ErrorCode';
import { THXClient } from '../index';
import BaseManager from './BaseManager';

class RequestManager extends BaseManager {
  constructor(client: THXClient) {
    super(client);
  }

  private async getHeaders() {
    const accessToken = this.client.session.cached.accessToken;
    return { authorization: `Bearer ${accessToken}` };
  }

  private async preflight() {
    if (this.client.session.cached.user || this.client.session.cached.accessToken) return;
    throw new THXError(ErrorCode.SIGN_IN_REQUIRED);
  }

  async get(url: string, config?: RequestInit) {
    await this.preflight();
    const headers = await this.getHeaders();

    return fetch(url, {
      ...config,
      mode: 'cors',
      method: 'GET',
      credentials: 'omit',
      headers: new Headers({ ...config?.headers, ...headers }),
    });
  }

  async post(url: string, config?: RequestInit) {
    await this.preflight();
    const headers = await this.getHeaders();

    return fetch(url, {
      ...config,
      mode: 'cors',
      method: 'POST',
      credentials: 'omit',
      headers: new Headers({ ...config?.headers, ...headers }),
    });
  }

  async patch(url: string, config?: RequestInit) {
    await this.preflight();
    const headers = await this.getHeaders();

    return fetch(url, {
      ...config,
      mode: 'cors',
      method: 'PATCH',
      credentials: 'omit',
      headers: new Headers({ ...config?.headers, ...headers }),
    });
  }

  async put(url: string, config?: RequestInit) {
    await this.preflight();
    const headers = await this.getHeaders();

    return fetch(url, {
      ...config,
      mode: 'cors',
      method: 'PUT',
      credentials: 'omit',
      headers: new Headers({ ...config?.headers, ...headers }),
    });
  }
}

export default RequestManager;
