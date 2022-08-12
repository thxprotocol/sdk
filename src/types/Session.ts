import { User } from 'oidc-client-ts';

type Session = Partial<{
  user: User;
  tokenType: string;
  accessToken: string;
  /** AUTHORIZATION_FLOW */
  idToken?: string;
  refreshToken?: string;
  expiresIn?: string;
}>;

export default Session;
