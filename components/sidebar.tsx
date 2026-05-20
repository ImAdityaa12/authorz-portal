"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import {
  House,
  Books,
  CurrencyInr,
  Headset,
  Users,
  Ticket,
  ChartBar,
  SignOut,
  List,
  X,
  Leaf,
} from "@phosphor-icons/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const authorLinks = [
  { href: "/author/dashboard", label: "Dashboard", icon: House },
  { href: "/author/books", label: "My Books", icon: Books },
  { href: "/author/royalties", label: "Royalties", icon: CurrencyInr },
  { href: "/author/support", label: "Support", icon: Headset },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: House },
  { href: "/admin/authors", label: "Authors", icon: Users },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user?.role === "admin" ? adminLinks : authorLinks;

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-4">
        <Link
          href={user?.role === "admin" ? "/admin/dashboard" : "/author/dashboard"}
          className="flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <Leaf className="text-white" size={20} weight="bold" />
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-zinc-900">
              BookLeaf
            </span>
            <span className="block text-[11px] text-muted leading-none tracking-wide uppercase">
              {user?.role === "admin" ? "Admin" : "Author Portal"}
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-accent/10 text-accent-dark"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <link.icon
                size={20}
                weight={isActive ? "fill" : "regular"}
                className={isActive ? "text-accent" : ""}
              />
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border mt-auto">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-zinc-900 truncate">
            {user?.name}
          </p>
          <p className="text-xs text-muted truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-danger w-full transition-colors"
        >
          <SignOut size={20} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-surface border border-border shadow-sm"
      >
        <List size={20} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[280px] bg-surface border-r border-border z-50"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100"
              >
                <X size={18} />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[260px] lg:min-h-screen bg-surface border-r border-border">
        <NavContent />
      </aside>
    </>
  );
}
