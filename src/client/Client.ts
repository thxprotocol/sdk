import { UserManager as BaseUserManager, UserManagerSettings } from 'oidc-client-ts';

import { SCOPES, URL_CONFIG } from '@/configs';
import CredentialManager from '@/managers/CredentialManager';
import UserManager from '@/managers/UserManager';

import type { Credential } from '@/types';
export default class THXClient {
  userManager: UserManager;
  credential: CredentialManager;

  constructor(credential: Credential) {
    const settings: UserManagerSettings = {
      authority: URL_CONFIG['AUTH_URL'],
      client_id: credential.clientId,
      client_secret: credential.clientSecret,
      redirect_uri: credential.redirectUrl!,
      response_type: 'code',
      post_logout_redirect_uri: credential.redirectUrl!,
      loadUserInfo: false,
      scope: SCOPES.join(' '),
    };

    /* Mapped values */
    const userManager = new BaseUserManager(settings);

    /** Init managers */
    this.credential = new CredentialManager(this, credential);
    this.userManager = new UserManager(this, userManager);
  }
}
