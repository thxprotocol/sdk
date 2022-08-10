import THXClient from 'client/Client';
import CacheManager from './CacheManager';

import type { Credential } from 'types';

export default class CredentialManager extends CacheManager<Credential> {
  constructor(client: THXClient, credential: Credential) {
    super(client, credential);
  }
}
