import { THXClient } from '../index';
import BaseManager from './BaseManager';

class ERC721Manager extends BaseManager {
  constructor(client: THXClient) {
    super(client);
  }

  async list() {
    const res = await this.client.request.get('/erc721/tokens');
    return res.data;
  }

  async get(id: string) {
    const res = await this.client.request.get(`/erc721/tokens/${id}`);
    return res.data;
  }
}

export default ERC721Manager;
