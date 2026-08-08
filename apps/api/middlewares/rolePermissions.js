// Role-based permission configuration (TrendVaulta retail domain)
const ROLE_PERMISSIONS = {
  user: ['users:read:own'],

  moderator: [
    'products:read',
    'products:write',
    'brands:read',
    'brands:write',
    'coupons:read',
    'offers:read',
    'orders:read',
    'users:read',
  ],

  admin: [
    'products:read',
    'products:write',
    'products:delete',
    'brands:read',
    'brands:write',
    'brands:delete',
    'coupons:read',
    'coupons:write',
    'coupons:delete',
    'offers:read',
    'offers:write',
    'offers:delete',
    'orders:read',
    'orders:write',
    'users:read',
    'users:write',
    'users:delete',
  ],
};

const hasPermission = (userPermissions, requiredPermission) => {
  return userPermissions.some(
    (permission) => permission === requiredPermission,
  );
};

const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

const getUserPermissions = (userRoles) => {
  const allPermissions = new Set();
  const roles = Array.isArray(userRoles) ? userRoles : [];

  roles.forEach((role) => {
    getRolePermissions(role).forEach((perm) => allPermissions.add(perm));
  });

  return Array.from(allPermissions);
};

module.exports = {
  ROLE_PERMISSIONS,
  hasPermission,
  getRolePermissions,
  getUserPermissions,
};
