'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, X, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function SiteHeader() {
  const { data: session, status } = useSession() || {};
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-[1200px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">SkillVane</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" size="sm">Home</Button>
          </Link>
          <Link href="/courses">
            <Button variant="ghost" size="sm">Courses</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" size="sm">About</Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" size="sm">Contact</Button>
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {status === 'loading' ? (
            <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  {session?.user?.name ?? 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" /> My Courses
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                      <Shield className="w-4 h-4" /> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link href="/signup"><Button size="sm">Sign Up</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-2">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">Home</Button>
          </Link>
          <Link href="/courses" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">Courses</Button>
          </Link>
          <Link href="/about" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">About</Button>
          </Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">Contact</Button>
          </Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <LayoutDashboard className="w-4 h-4" /> My Courses
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Shield className="w-4 h-4" /> Admin Panel
                  </Button>
                </Link>
              )}
              <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Login</Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
