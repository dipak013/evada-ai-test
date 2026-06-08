"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { canAccessPath, getDefaultAuthorizedRoute, hasPermission, RBAC_PERMISSIONS } from "@/lib/rbac";

export default function AiScannerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const hasSessionCookie = () => {
        if (typeof document === "undefined") return false;
        return document.cookie.split(";").some((cookie) =>
            cookie.trim().startsWith("sessionid=")
        );
    };

    useEffect(() => {
        if (isLoading) return;
        const hasSession = hasSessionCookie();
        if (!isAuthenticated && !hasSession) {
            queryClient.clear();
            router.replace("/login");
            return;
        }

        if (isAuthenticated && user && !canAccessPath(user, pathname)) {
            router.replace(getDefaultAuthorizedRoute(user));
        }
    }, [isLoading, isAuthenticated, router, queryClient, user, pathname]);

    useEffect(() => {
        const handlePopState = () => {
            const hasSession = hasSessionCookie();
            if (!hasSession) {
                queryClient.clear();
                globalThis.window?.location.replace("/login");
            }
        };
        globalThis.window?.addEventListener("popstate", handlePopState);
        return () => globalThis.window?.removeEventListener("popstate", handlePopState);
    }, [queryClient]);

    if (isLoading) return <div>Loading...</div>;

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

    const canAccessKnowledgeBase = hasPermission(user, RBAC_PERMISSIONS.PAGE_AI_SCANNER_KB);

    const menuItems = [
        { name: "Dashboard", icon: "dashboard", path: "/ai-scanner/dashboard" },
        { name: "Pipeline", icon: "pipeline", path: "/ai-scanner/pipeline" },
        { name: "Vulnerabilities", icon: "vulnerabilities", path: "/ai-scanner/vulnerabilities" },
        { name: "Reports", icon: "reports", path: "/ai-scanner/reports" },
        ...(canAccessKnowledgeBase ? [{ name: "Knowledge Hub", icon: "knowledge", path: "/ai-scanner/knowledge-base" }] : []),
        { name: "Launch Scan", icon: "launch", path: "/ai-scanner/new-scan" },
    ];

    const renderIcon = (icon: string) => {
        switch (icon) {
            case "dashboard":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                );
            case "pipeline":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                );
            case "vulnerabilities":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                );
            case "exploits":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                );
            case "knowledge":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                );
            case "reports":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                );
            case "launch":
                return (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen flex bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 overflow-hidden">
            {/* Collapsed Sidebar Color Bar */}
            {isSidebarCollapsed && (
                <div className="hidden lg:block w-14 h-full bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-700 shadow-lg relative z-40">
                    <button
                        onClick={() => setIsSidebarCollapsed(false)}
                        className="absolute top-4 left-1/2 transform -translate-x-1/2 p-2 bg-white rounded-md hover:bg-gray-50 transition-all duration-200 shadow-md group"
                        aria-label="Expand sidebar"
                    >
                        <div className="w-5 h-4 flex flex-col justify-between">
                            <span className="block h-0.5 w-full bg-indigo-600 rounded-full"></span>
                            <span className="block h-0.5 w-full bg-indigo-600 rounded-full"></span>
                            <span className="block h-0.5 w-full bg-indigo-600 rounded-full"></span>
                        </div>
                    </button>
                </div>
            )}

            {/* Hamburger - Desktop open state */}
            {!isSidebarCollapsed && (
                <button
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="hidden lg:block fixed top-4 left-4 z-50 p-1.5 bg-white rounded-md shadow-md hover:shadow-lg transition-all duration-200 hover:bg-indigo-50 group"
                    aria-label="Collapse sidebar"
                >
                    <div className="w-5 h-4 flex flex-col justify-between">
                        <span className="block h-0.5 w-full bg-gray-600 rounded-full group-hover:bg-indigo-600"></span>
                        <span className="block h-0.5 w-full bg-gray-600 rounded-full group-hover:bg-indigo-600"></span>
                        <span className="block h-0.5 w-full bg-gray-600 rounded-full group-hover:bg-indigo-600"></span>
                    </div>
                </button>
            )}

            {/* Mobile Hamburger */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close mobile menu"
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-40 bg-white rounded-tr-2xl rounded-br-2xl shadow-xl p-4 pt-20 lg:pt-16 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out h-full ${isSidebarCollapsed ? "lg:w-0 lg:p-0 lg:opacity-0" : "w-56 md:w-64"}`}
                style={{
                    minWidth: isSidebarCollapsed ? "0" : undefined,
                    overflow: isSidebarCollapsed ? "hidden" : undefined,
                }}
            >
                {(!isSidebarCollapsed || isMobileMenuOpen) && (
                    <>
                        {/* Brand */}
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
                                    <p className="text-[10px] text-slate-500">AI Pentester</p>
                                </div>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 space-y-1 overflow-y-auto thin-scrollbar">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center px-3.5 py-2.5 rounded-xl transition-all ${
                                            isActive
                                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                                : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-[18px] h-[18px] md:w-5 md:h-5 mr-2.5 flex-shrink-0 stroke-[1.8]"
                                        >
                                            {renderIcon(item.icon)}
                                        </svg>
                                        <span className="text-[13px] md:text-sm font-semibold tracking-[0.01em] truncate">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Logout */}
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
                                    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout/`, {
                                        method: "POST",
                                        credentials: "include",
                                    });
                                    globalThis.window?.location.replace("/login");
                                }}
                                className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l3 3m0 0l-3 3m3-3H9" />
                                </svg>
                                <span className="text-sm font-semibold">Logout</span>
                            </button>
                        </div>
                    </>
                )}
            </aside>

            <main className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-0" : "pt-16 lg:pt-0"}`}>
                {children}
            </main>
        </div>
    );
}
