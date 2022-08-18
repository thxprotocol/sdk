import { THXClient } from '../index';

import BaseManager from './BaseManager';

export default class AccountManager extends BaseManager {
  constructor(client: THXClient) {
    super(client);
  }

  async get() {
    const res = await this.client.request.get('/account');
    return res.data;
  }
}
