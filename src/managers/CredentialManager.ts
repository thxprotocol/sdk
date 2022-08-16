import THXClient from '../client/Client';
import CacheManager from './CacheManager';
import TorusManager from './TorusManager';

import type { Credential } from '../types';

export default class CredentialManager extends CacheManager<Credential> {
  constructor(client: THXClient, credential: Credential) {
    super(client, credential);

    this.client.torusManager = new TorusManager(client, {
      baseUrl: `${location.origin}/serviceworker`,
      network: credential.torusNetwork,
      enableLogging: false,
    });
  }
}
