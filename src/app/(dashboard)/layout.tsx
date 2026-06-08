"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { canAccessPath, getDefaultAuthorizedRoute, hasPermission, hasRole, RBAC_PERMISSIONS, SUPERADMIN_ROLE } from "@/lib/rbac";
import { UnifiedAPIService } from "@/services/unified-api.service";
import { SidebarService } from "@/services/sidebar.service";

function hasSessionCookie() {
    if (typeof document === 'undefined') return false;
    return document.cookie.split(';').some(cookie =>
        cookie.trim().startsWith('sessionid=')
    );
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, isLoading } = useAuth();
    const queryClient = useQueryClient();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
        const initial = new Set<string>();
        if (pathname.startsWith('/saas-admin') || pathname.startsWith('/client-admin')) initial.add('Security Console');
        if (pathname.startsWith('/ai-scanner')) initial.add('AI Pentester');
        return initial;
    });

    useEffect(() => {
        // Wait for authentication to complete loading
        if (isLoading) {
            return;
        }

        const hasSession = hasSessionCookie();

        // Only redirect if we're certain the user is not authenticated
        // Check both React Query state and session cookie
        if (!isAuthenticated && !hasSession) {
            console.log('[DashboardLayout] Not authenticated, redirecting to login');
            queryClient.clear();
            SidebarService.clearSidebarClientsCache();
            router.replace('/login');
            return;
        }

        if (isAuthenticated && user && !canAccessPath(user, pathname)) {
            router.replace(getDefaultAuthorizedRoute(user));
        }
    }, [isLoading, isAuthenticated, router, queryClient, user, pathname]);

    // Prevent back navigation after logout
    useEffect(() => {
        const handlePopState = () => {
            const hasSession = hasSessionCookie();
            if (!hasSession) {
                console.log('[DashboardLayout] Blocked back navigation - no session');
                // Clear cache and redirect
                queryClient.clear();
                SidebarService.clearSidebarClientsCache();
                globalThis.window?.location.replace('/login');
            }
        };

        globalThis.window?.addEventListener('popstate', handlePopState);
        return () => globalThis.window?.removeEventListener('popstate', handlePopState);
    }, [queryClient]);

    if (isLoading) return <div>Loading...</div>;

    const hasSession = hasSessionCookie();
    if (!hasSession && !isAuthenticated) {
        return null;
    }

    const displayName = user?.first_name || user?.username || user?.email || "User";
    const displayEmail = user?.email || "";
    const tenantName = user?.tenant?.name || "";
    const tenantRole = user?.tenant?.role || "";
    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part[0]?.toUpperCase())
        .join("") || "U";

    const canAccessSaasAdmin = hasPermission(user, RBAC_PERMISSIONS.PAGE_SAAS_ADMIN);
    const canAccessClientAdmin = hasPermission(user, RBAC_PERMISSIONS.PAGE_CLIENT_ADMIN);
    const canAccessAiScanner = hasPermission(user, RBAC_PERMISSIONS.PAGE_AI_SCANNER);
    const canAccessAiScannerKb = hasPermission(user, RBAC_PERMISSIONS.PAGE_AI_SCANNER_KB);
    const isSuperadmin = hasRole(user, SUPERADMIN_ROLE);

    const menuItems = [
        { name: "Home", icon: "home", path: "/#home" },
        { name: "Overview", icon: "overview", path: "/dashboard" },
        { name: "WebApp Scanner", icon: "applications", path: "/configuration" },
        {
            name: "Security Console",
            icon: "security",
            path: "",
            subItems: [
                ...(canAccessSaasAdmin ? [{ name: "SaaS Admin", path: "/saas-admin", disabled: false }] : []),
                ...(canAccessClientAdmin ? [{ name: "Client Admin", path: "/client-admin", disabled: false }] : []),
            ],
        },
        ...(canAccessSaasAdmin
            ? [{ name: "License Management", icon: "license", path: "/saas-admin/license-management" }]
            : []),
        {
            name: "Application Management",
            icon: "users",
            path: "",
            subItems: isSuperadmin
                ? [
                    { name: "User Access", path: "/superadmin/users", disabled: false },
                    { name: "Tenants", path: "/superadmin/tenants", disabled: false },
                    { name: "Clients", path: "/superadmin/clients", disabled: false },
                ]
                : [],
        },
        // { name: "Reports", icon: "chart", path: "/reports" },
        // AI Pentester: surface Dashboard and Reports at top-level per request
        { name: "Dashboard", icon: "ai", path: "/ai-scanner/dashboard" },
        { name: "Reports", icon: "chart", path: "/ai-scanner/reports" },
        { name: "View Logs", icon: "logs", path: "/view-logs" },
        {
            name: "AI Pentester",
            icon: "ai",
            path: "",
            subItems: canAccessAiScanner
                ? [
                    { name: "Pipeline", path: "/ai-scanner/pipeline", disabled: false },
                    { name: "Vulnerabilities", path: "/ai-scanner/vulnerabilities", disabled: false },
                    ...(canAccessAiScannerKb ? [{ name: "Knowledge Hub", path: "/ai-scanner/knowledge-base", disabled: false }] : []),
                    { name: "Launch Scan", path: "/ai-scanner/new-scan", disabled: false },
                    /* WebApp Scanner moved to main menu per request - keep commented for easy restore
                    { name: "WebApp Scanner", path: "/ai-scanner/webapp-scanner", disabled: false },
                    */
                ]
                : [],
        },
        { name: "Billing", icon: "credit-card", path: "/subscription" },
        // Settings menu intentionally hidden per request
        // { name: "Settings", icon: "settings", path: "/settings" },
    ];

    const renderSidebarIcon = (icon: string) => {
        switch (icon) {
            case "home":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.125 1.125 0 011.592 0L21.75 12M4.5 9.75V19.5A1.5 1.5 0 006 21h4.5v-5.25A1.5 1.5 0 0112 14.25h0a1.5 1.5 0 011.5 1.5V21H18a1.5 1.5 0 001.5-1.5V9.75" />
                );
            case "overview":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5v4.5H3.75V4.5zM3.75 12h7.5v7.5h-7.5V12zM13.5 12h6.75M13.5 16.5h6.75M13.5 19.5h6.75" />
                );
            case "applications":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75A2.25 2.25 0 016 4.5h12A2.25 2.25 0 0120.25 6.75v10.5A2.25 2.25 0 0118 19.5H6a2.25 2.25 0 01-2.25-2.25V6.75zM8.25 9.75h7.5M8.25 13.5h3.75" />
                );
            case "security":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25l7.5 3v6.707c0 4.305-2.88 8.087-7.5 9.793-4.62-1.706-7.5-5.488-7.5-9.793V5.25l7.5-3zM9.75 12.75l1.5 1.5 3-3" />
                );
            case "license":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75h3.75v3.75m-9 3.75l6.75-6.75M4.5 6.75A2.25 2.25 0 016.75 4.5h4.19c.298 0 .584.118.795.33l7.435 7.435a1.125 1.125 0 010 1.59l-4.32 4.32a1.125 1.125 0 01-1.59 0L5.83 10.74a1.125 1.125 0 01-.33-.795V6.75z" />
                );
            case "users":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.75a3.75 3.75 0 00-3.75-3.75H9.75A3.75 3.75 0 006 18.75M15 8.25a3 3 0 11-6 0 3 3 0 016 0zm6.75 10.5a3 3 0 00-3-3h-.75m.75 3v-.375c0-1.243-.757-2.31-1.836-2.771M3 18.75a3 3 0 013-3h.75m-3 3v-.375c0-1.243.757-2.31 1.836-2.771" />
                );
            case "chart":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                );
            case "logs":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5v9A2.25 2.25 0 0117.25 18.75H6.75A2.25 2.25 0 014.5 16.5v-9A2.25 2.25 0 016.75 5.25h10.5A2.25 2.25 0 0119.5 7.5zM8.25 9h7.5M8.25 12h7.5M8.25 15h4.5" />
                );
            case "ai":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3v3m4.5-3v3M9 12h6m-7.5 9h9A2.25 2.25 0 0018.75 18.75v-10.5A2.25 2.25 0 0016.5 6h-9A2.25 2.25 0 005.25 8.25v10.5A2.25 2.25 0 007.5 21zm-3-9h16.5" />
                );
            case "credit-card":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5m-18 0h16.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5v-7.5a1.5 1.5 0 011.5-1.5zM6 15h3" />
                );
            case "settings":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h9m-9 10.5h15m-15-5.25h6m-6 0a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zm9-5.25a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zm-3 10.5a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" />
                );
            default:
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15" />
                );
        }
    };

    const showDashboardShell = isAuthenticated || hasSession;
    let mainOffsetClass = '';
    if (showDashboardShell) {
        mainOffsetClass = isSidebarCollapsed ? 'lg:ml-0' : 'pt-16 lg:pt-0';
    }

    return (
        <div className="h-screen flex bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 overflow-hidden">
            {/* Vertical Color Bar - Desktop (when sidebar collapsed) */}
            {showDashboardShell && isSidebarCollapsed && (
                <div className="hidden lg:block w-14 h-full bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-700 shadow-lg relative z-40">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="absolute top-4 left-1/2 transform -translate-x-1/2 p-2 bg-white rounded-md hover:bg-gray-50 transition-all duration-200 shadow-md group"
                        aria-label="Toggle sidebar"
                    >
                        <div className="w-5 h-4 flex flex-col justify-between">
                            <span className="block h-0.5 w-full bg-indigo-600 rounded-full transition-colors duration-200 group-hover:bg-purple-600"></span>
                            <span className="block h-0.5 w-full bg-indigo-600 rounded-full transition-colors duration-200 group-hover:bg-purple-600"></span>
                            <span className="block h-0.5 w-full bg-indigo-600 rounded-full transition-colors duration-200 group-hover:bg-purple-600"></span>
                        </div>
                    </button>
                </div>
            )}
            
            {/* Hamburger Menu Button - Desktop (when sidebar open) */}
            {showDashboardShell && !isSidebarCollapsed && (
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:block fixed top-4 left-4 z-50 p-1.5 bg-white rounded-md shadow-md hover:shadow-lg transition-all duration-200 hover:bg-indigo-50 group"
                    aria-label="Toggle sidebar"
                >
                    <div className="w-5 h-4 flex flex-col justify-between">
                        <span className="block h-0.5 w-full bg-gray-600 rounded-full transition-colors duration-200 group-hover:bg-indigo-600"></span>
                        <span className="block h-0.5 w-full bg-gray-600 rounded-full transition-colors duration-200 group-hover:bg-indigo-600"></span>
                        <span className="block h-0.5 w-full bg-gray-600 rounded-full transition-colors duration-200 group-hover:bg-indigo-600"></span>
                    </div>
                </button>
            )}

            {/* Mobile Menu Button */}
            {showDashboardShell && (
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-700"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            )}

            {/* Overlay for mobile */}
            {showDashboardShell && isMobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close mobile menu"
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></button>
            )}

            {/* Sidebar */}
            {showDashboardShell && (
            <aside className={`${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 fixed lg:relative z-40 bg-white rounded-tr-2xl rounded-br-2xl shadow-xl p-4 pt-20 lg:pt-16 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out h-full ${
                isSidebarCollapsed ? 'lg:w-0 lg:p-0 lg:opacity-0' : 'w-56 md:w-64'
            }`}
            style={{ 
                minWidth: isSidebarCollapsed ? '0' : undefined,
                overflow: isSidebarCollapsed ? 'hidden' : undefined 
            }}
            >
                {(!isSidebarCollapsed || isMobileMenuOpen) && (
                    <>
                        {/* Logo */}
                        <div className="mb-6 pb-4 border-b border-slate-200/90">
                            <div className="flex items-center gap-3">
                                <div className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 shadow-sm ring-1 ring-slate-700/60">
                                    <Image
                                        src="/logos/logo.png"
                                        alt="Logo"
                                        width={140}
                                        height={36}
                                        className="h-7 w-auto object-contain"
                                        priority
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold tracking-[0.09em] text-slate-900">EVADA</p>
                                    <p className="text-[10px] text-slate-500">Security Platform</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <nav className="flex-1 space-y-1.5 overflow-y-auto thin-scrollbar">
                    {menuItems.filter((item) => !item.subItems || item.subItems.length > 0).map((item) => {
                        const isSubItemActive = item.subItems?.some((subItem) => subItem.path === pathname) ?? false;
                        const isActive = pathname === item.path && !isSubItemActive && item.path !== "";
                        const isExpanded = expandedSections.has(item.name);

                        const toggleSection = () => {
                            setExpandedSections((prev) => {
                                const next = new Set(prev);
                                if (next.has(item.name)) next.delete(item.name);
                                else next.add(item.name);
                                return next;
                            });
                        };

                        const iconEl = (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-[18px] h-[18px] md:w-5 md:h-5 mr-2.5 flex-shrink-0 stroke-[1.8]"
                            >
                                    {renderSidebarIcon(item.icon)}
                            </svg>
                        );

                        return (
                            <div key={item.name}>
                                {item.subItems ? (
                                    <button
                                        onClick={toggleSection}
                                        className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all ${
                                            isSubItemActive
                                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                                : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        {iconEl}
                                        <span className="text-[13px] md:text-sm font-semibold flex-1 text-left tracking-[0.01em]">{item.name}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className={`w-3.5 h-3.5 ml-1 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </button>
                                ) : (
                                    <Link
                                        href={item.path}
                                        className={`flex items-center px-3.5 py-2.5 rounded-xl transition-all ${
                                            isActive
                                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                                : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        {iconEl}
                                        <span className="text-[13px] md:text-sm font-semibold tracking-[0.01em]">{item.name}</span>
                                    </Link>
                                )}

                                {item.subItems && isExpanded && (
                                    <div className="ml-7 mt-1 space-y-1">
                                        {item.subItems.map((subItem) => {
                                            const isSubActive = pathname === subItem.path;

                                            if (subItem.disabled) {
                                                return (
                                                    <div
                                                        key={subItem.name}
                                                        className="flex items-center px-3 py-1.5 text-xs md:text-sm rounded-md text-gray-400 cursor-not-allowed"
                                                    >
                                                        {subItem.name}
                                                        <span className="ml-2 text-[10px] uppercase tracking-wide">Soon</span>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={subItem.path}
                                                    href={subItem.path}
                                                    className={`flex items-center px-3 py-2 text-xs md:text-sm rounded-lg transition-all ${
                                                        isSubActive
                                                            ? "bg-indigo-100 text-indigo-700 font-semibold"
                                                            : "text-slate-500 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                                {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-gray-800 truncate">{displayName}</p>
                                {displayEmail ? (
                                    <p className="text-[11px] text-gray-500 truncate">{displayEmail}</p>
                                ) : null}
                                {(tenantRole || tenantName) ? (
                                    <p className="text-[10px] text-indigo-600 truncate mt-0.5">
                                        {[tenantRole, tenantName].filter(Boolean).join(" • ")}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                await UnifiedAPIService.auth.logout();
                            } finally {
                                queryClient.clear();
                                SidebarService.clearSidebarClientsCache();
                            }
                            // Use replace() instead of href to prevent back button navigation
                            // This replaces the current history entry instead of adding a new one
                            globalThis.window?.location.replace("/login");
                        }}
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l3 3m0 0l-3 3m3-3H9"
                            />
                        </svg>
                        <span className="text-sm font-semibold">Logout</span>
                    </button>
                </div>
                </>
                )}
            </aside>
            )}
            <main className={`flex-1 overflow-auto transition-all duration-300 ${mainOffsetClass}`}>{children}</main>
        </div>
    );
}