import THXClient from '@/client/Client';
import { UserManager as BaseUserManager } from 'oidc-client-ts';
import CacheManager from './CacheManager';

export default class UserManager extends CacheManager<BaseUserManager> {
  constructor(client: THXClient, user: BaseUserManager) {
    super(client, user);
  }
}
