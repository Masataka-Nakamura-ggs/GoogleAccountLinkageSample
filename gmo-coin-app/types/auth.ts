export interface KeycloakUserInfo {
  sub: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  [key: string]: any;
}

export interface BackendUserInfo {
  subject: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  emailVerified: boolean;
  tokenIssuer: string;
  tokenIssuedAt: string;
  tokenExpiresAt: string;
}

export interface AuthState {
  userInfo: KeycloakUserInfo | null;
  backendUserInfo: BackendUserInfo | null;
  isAuthenticated: boolean;
  authChecked: boolean;
  loading: boolean;
  error: string | null;
}
