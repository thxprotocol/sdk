export default interface Session {
  tokenType: string;
  accessToken: string;
  /** AUTHORIZATION_FLOW */
  idToken?: string;
  refreshToken?: string;
  expiresIn?: string;
}
