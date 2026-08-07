import Cookies from 'js-cookie';

export const AUTH_TOKEN_COOKIE = 'token';
export const AUTH_ROLE_COOKIE = 'role';

export function getAuthToken(): string | undefined {
  return Cookies.get(AUTH_TOKEN_COOKIE);
}

export function getAuthRole(): string | undefined {
  return Cookies.get(AUTH_ROLE_COOKIE);
}

export function setAuthSession(opts: {
  token: string;
  role?: string;
  remember?: boolean;
}) {
  const expires = opts.remember ? 30 : 1;
  Cookies.set(AUTH_TOKEN_COOKIE, opts.token, { expires, path: '/' });
  if (opts.role) {
    Cookies.set(AUTH_ROLE_COOKIE, opts.role, { expires, path: '/' });
  }
}

export function clearAuthSession() {
  Cookies.remove(AUTH_TOKEN_COOKIE, { path: '/' });
  Cookies.remove(AUTH_ROLE_COOKIE, { path: '/' });
}

export function pickPrimaryRole(roles?: string[]): string {
  if (!roles?.length) return 'user';
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('moderator')) return 'moderator';
  return roles[0];
}
