import { User } from 'oidc-client-ts';

import { TORUS_VERIFIER } from '@/configs';
import { THXClient } from '@/index';
import CustomAuth, { CustomAuthArgs, TorusKey } from '@toruslabs/customauth';

import CacheManager from './CacheManager';

class TorusManager extends CacheManager<CustomAuth> {
  constructor(client: THXClient, args: CustomAuthArgs) {
    const torusClient = new CustomAuth(args);
    super(client, torusClient);
  }

  async getPrivateKeyForUser(user: User) {
    const torusKey: TorusKey = await this.cached.getTorusKey(
      TORUS_VERIFIER,
      user.profile.sub,
      { verifier_id: user.profile.sub }, // eslint-disable-line @typescript-eslint/camelcase
      user.access_token
    );

    return `0x${torusKey.privateKey}`;
  }
}

export default TorusManager;
