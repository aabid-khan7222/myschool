const isProduction = process.env.NODE_ENV === 'production';

function resolveSameSite() {
  const configured = String(process.env.COOKIE_SAME_SITE || '').trim().toLowerCase();
  const allowCrossSite = String(process.env.ALLOW_CROSS_SITE_COOKIES || '').toLowerCase() === 'true';
  const requested = configured || (allowCrossSite ? 'none' : 'lax');
  if (requested === 'strict') return 'strict';
  if (requested === 'none') return isProduction ? 'none' : 'lax';
  return 'lax';
}

function secureCookieBase() {
  const sameSite = resolveSameSite();
  const secure = isProduction || sameSite === 'none';
  return { sameSite, secure };
}

module.exports = {
  secureCookieBase,
};
