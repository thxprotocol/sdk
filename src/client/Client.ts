import { UserManager as BaseUserManager, UserManagerSettings } from 'oidc-client-ts';

import { URL_CONFIG } from '../configs';
import TorusManager from '../managers/TorusManager';
import CredentialManager from '../managers/CredentialManager';
import SessionManager from '../managers/SessionManager';
import UserManager from '../managers/UserManager';

import type { Credential } from '../types';
export default class THXClient {
  userManager: UserManager;
  credential: CredentialManager;
  session: SessionManager;

  /* Internal inits */
  torusManager: TorusManager = null!; // Init inside Credential

  constructor({ scopes = 'openid', torusNetwork = 'testnet', ...rest }: Credential) {
    const settings: UserManagerSettings = {
      authority: URL_CONFIG['AUTH_URL'],
      client_id: rest.clientId,
      client_secret: rest.clientSecret,
      redirect_uri: rest.redirectUrl!,
      response_type: 'code',
      post_logout_redirect_uri: rest.redirectUrl!,
      resource: rest.redirectUrl!,
      automaticSilentRenew: true,
      loadUserInfo: false,
      scope: scopes,
    };

    /* Mapped values */
    const userManager = new BaseUserManager(settings);

    /** Init managers */
    this.credential = new CredentialManager(this, { ...rest, scopes, torusNetwork });
    this.userManager = new UserManager(this, userManager);
    this.session = new SessionManager(this, {});

    /* Register listeners */
    const callback = async () => {
      await this.initialize();
      window.removeEventListener('load', callback);
    };

    if (window) {
      window.addEventListener('load', callback);
    }
  }

  private async initialize() {
    let haveUser = false;

    const isRedirectBack = window.location.search.includes('code');
    if (isRedirectBack) {
      const user = await this.userManager.signinRedirectCallback();
      if (window.history) {
        window.history.pushState({}, document.title, window.location.pathname);
      }
      if (user) haveUser = true;
    } else {
      const user = await this.userManager.getUser();
      if (user) haveUser = true;
    }

    return haveUser;
  }

  async signin() {
    const haveUser = await this.initialize();
    if (haveUser) return;

    await this.userManager.cached.signinRedirect({
      extraQueryParams: {
        return_url: this.credential.cached.redirectUrl!,
      },
    });
  }
}
