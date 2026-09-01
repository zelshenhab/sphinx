'use client';
import { usePathname } from 'next/navigation';
import { AdminShell } from '@/features/admin';
export default function Layout({ children }: { children: React.ReactNode }) {
  if (usePathname() === '/admin/login') return children;
  return <AdminShell>{children}</AdminShell>;
}
