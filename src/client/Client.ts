import { UserManager as BaseUserManager, UserManagerSettings } from 'oidc-client-ts';

import { SCOPES, URL_CONFIG } from '../configs';
import CredentialManager from '../managers/CredentialManager';
import SessionManager from '../managers/SessionManager';
import UserManager from '../managers/UserManager';

import type { Credential } from '../types';
export default class THXClient {
  initialized = false;

  userManager: UserManager;
  credential: CredentialManager;
  session: SessionManager;

  constructor(credential: Credential) {
    const settings: UserManagerSettings = {
      authority: URL_CONFIG['AUTH_URL'],
      client_id: credential.clientId,
      client_secret: credential.clientSecret,
      redirect_uri: credential.redirectUrl!,
      response_type: 'code',
      post_logout_redirect_uri: credential.redirectUrl!,
      resource: credential.redirectUrl!,
      automaticSilentRenew: true,
      loadUserInfo: false,
      scope: 'openid', //TO-DO: Make this configable
    };

    /* Mapped values */
    const userManager = new BaseUserManager(settings);

    /** Init managers */
    this.credential = new CredentialManager(this, credential);
    this.userManager = new UserManager(this, userManager);
    this.session = new SessionManager(this, {});

    /* Register listeners */

    if (window) {
      window.addEventListener('load', async () => {
        await this.initialize();
      });
    }
  }

  async signin() {
    if (!this.initialized) return await this.initialize();
    await this.userManager.cached.signinRedirect({
      extraQueryParams: {
        return_url: this.credential.cached.redirectUrl!,
      },
    });
  }

  private async initialize() {
    /* CHECK IF HAVE CODE IN URL AND PROCESS IT */
    await this.userManager.signinRedirectCallback();
    this.initialized = true;
  }

  // private async windowSigninRedirectCallback() {
  //   console.log('Test');
  //   const user = await this.userManager.signinRedirectCallback();
  //   if (!user) return;

  //   window.removeEventListener('load', this.windowSigninRedirectCallback);
  // }
}
