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
  authenticated = false;

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
  }

  public async syncPrivateKey(user: User) {
    try {
      const privateKey = await this.torusManager.getPrivateKeyForUser(user);
      this.session.update({ privateKey });
    } catch (e) {
      console.error(e);
    }
  }

  public async init() {
    if (this.initialized) return;

    const grantType = this.credential.cached.grantType;

    if (grantType === 'authorization_code') {
      return await this.credential.authorizationCode();
    } else {
      return await this.credential.clientCredential();
    }
  }

  public async signin() {
    const grantType = this.credential.cached.grantType;
    if (grantType === 'client_credentials') return;

    await this.userManager.cached.signinRedirect({
      extraQueryParams: {
        return_url: this.credential.cached.redirectUrl!,
      },
    });
  }

  public async signout() {
    const grantType = this.credential.cached.grantType;
    if (grantType === 'client_credentials') return;

    await this.userManager.cached.signoutRedirect({});
  }
}
