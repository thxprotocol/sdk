import { User, UserManager as BaseUserManager, UserManagerSettings } from 'oidc-client-ts';

import { URL_CONFIG } from '../configs';
import TorusManager from '../managers/TorusManager';
import CredentialManager from '../managers/CredentialManager';
import RequestManager from '../managers/RequestManager';
import AccountManager from '../managers/AccountManager';
import SessionManager from '../managers/SessionManager';
import UserManager from '../managers/UserManager';

import type { Credential } from '../types';
export default class THXClient {
  initialized = false;

  /* Internal managers */
  request: RequestManager;
  session: SessionManager;
  userManager: UserManager;
  credential: CredentialManager;
  torusManager: TorusManager = null!;

  /* External managers */
  account: AccountManager;

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
    this.request = new RequestManager(this);
    this.credential = new CredentialManager(this, { ...rest, scopes, torusNetwork });
    this.userManager = new UserManager(this, userManager);
    this.session = new SessionManager(this, {});
    this.account = new AccountManager(this);

    /* Register listeners */
    const callback = async () => {
      await this.initialize();
      window.removeEventListener('load', callback);
    };

    if (window) {
      window.addEventListener('load', callback);
    }
  }

  private async syncPrivateKey(user: User) {
    try {
      const privateKey = await this.torusManager.getPrivateKeyForUser(user);
      this.session.update({ privateKey });
    } catch (e) {
      console.error(e);
    }
  }

  async initialize() {
    if (this.initialized) return;
    let haveUser = false;

    const isRedirectBack = window.location.search.includes('code');

    if (isRedirectBack) {
      const user = await this.userManager.signinRedirectCallback();
      if (window.history) {
        window.history.pushState({}, document.title, window.location.pathname);
      }
      if (user) {
        haveUser = true;
        await this.syncPrivateKey(user);
      }
    } else {
      const user = await this.userManager.getUser();
      if (user) {
        haveUser = true;
        await this.syncPrivateKey(user);
      }
    }

    this.initialized = true;
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

  async signinRedirectCallback() {}

  async signout() {
    await this.userManager.cached.signoutRedirect({});
  }
}
