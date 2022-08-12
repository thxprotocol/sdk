import THXClient from '../client/Client';
import type { Credential } from '../types';

import CacheManager from './CacheManager';

export default class CredentialManager extends CacheManager<Credential> {
  constructor(client: THXClient, credential: Credential) {
    super(client, credential);
  }
}
