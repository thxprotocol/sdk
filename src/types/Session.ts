import { User } from 'oidc-client-ts';

type Session = Partial<{
  user: User;
  privateKey: string;
}>;

export default Session;
