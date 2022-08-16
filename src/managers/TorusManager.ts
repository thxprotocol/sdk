import { THXClient } from '@/index';
import CustomAuth, { CustomAuthArgs } from '@toruslabs/customauth';

import CacheManager from './CacheManager';

class TorusManager extends CacheManager<CustomAuth> {
  constructor(client: THXClient, args: CustomAuthArgs) {
    const torusClient = new CustomAuth(args);
    super(client, torusClient);
  }
}

export default TorusManager;
