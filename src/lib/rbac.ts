export const RBAC_PERMISSIONS = {
  PAGE_SAAS_ADMIN: "page.saas_admin.access",
  PAGE_CLIENT_ADMIN: "page.client_admin.access",
  PAGE_AI_SCANNER: "page.ai_scanner.access",
  PAGE_AI_SCANNER_KB: "page.ai_scanner_kb.access",
} as const;

export const SUPERADMIN_ROLE = "superadmin";

type MaybeUser = {
  roles?: string[];
  permissions?: string[];
  tenant?: {
    role?: string;
  } | null;
} | null | undefined;

const LEGACY_ROLE_MAP: Record<string, string> = {
  owner: "admin",
  admin: "admin",
  member: "client",
};

export function getUserRoles(user: MaybeUser): string[] {
  const roleSet = new Set<string>((user?.roles || []).map((r) => String(r).toLowerCase()));

  const legacy = (user?.tenant?.role || "").toLowerCase();
  if (legacy) {
    roleSet.add(LEGACY_ROLE_MAP[legacy] || legacy);
  }

  return Array.from(roleSet);
}

export function hasPermission(user: MaybeUser, permission: string): boolean {
  const permissions = new Set((user?.permissions || []).map((p) => String(p).toLowerCase()));
  if (permissions.has(permission.toLowerCase())) {
    return true;
  }

  const roles = new Set(getUserRoles(user));
  return roles.has(SUPERADMIN_ROLE);
}

export function hasRole(user: MaybeUser, role: string): boolean {
  return getUserRoles(user).includes(role.toLowerCase());
}

export function canAccessPath(user: MaybeUser, pathname: string): boolean {
  if (!pathname) return true;

  if (pathname.startsWith("/saas-admin")) {
    return hasPermission(user, RBAC_PERMISSIONS.PAGE_SAAS_ADMIN);
  }

  if (pathname.startsWith("/superadmin")) {
    return hasRole(user, SUPERADMIN_ROLE);
  }

  if (pathname.startsWith("/client-admin")) {
    return hasPermission(user, RBAC_PERMISSIONS.PAGE_CLIENT_ADMIN);
  }

  if (pathname.startsWith("/ai-scanner/knowledge-base")) {
    return hasPermission(user, RBAC_PERMISSIONS.PAGE_AI_SCANNER_KB);
  }

  if (pathname.startsWith("/ai-scanner")) {
    return hasPermission(user, RBAC_PERMISSIONS.PAGE_AI_SCANNER);
  }

  return true;
}

export function getDefaultAuthorizedRoute(user: MaybeUser): string {
  if (hasRole(user, SUPERADMIN_ROLE)) return "/superadmin/users";
  if (hasPermission(user, RBAC_PERMISSIONS.PAGE_SAAS_ADMIN)) return "/saas-admin";
  if (hasPermission(user, RBAC_PERMISSIONS.PAGE_CLIENT_ADMIN)) return "/client-admin";
  if (hasPermission(user, RBAC_PERMISSIONS.PAGE_AI_SCANNER)) return "/ai-scanner/dashboard";
  return "/dashboard";
}
