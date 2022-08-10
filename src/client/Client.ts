import CredentialManager from '@/managers/CredentialManager';

export default class THXClient {
  credential: CredentialManager;

  constructor(clientId: string, clientSecret: string, requestUrl: string) {
    this.credential = new CredentialManager(this, { clientId, clientSecret, requestUrl });
  }
}
