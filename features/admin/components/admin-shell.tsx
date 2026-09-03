'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  ImageIcon,
  ShoppingCart,
  Settings,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/core/supabase/client';
const links: { name: string; href: string; icon: LucideIcon }[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Collections', href: '/admin/collections', icon: Layers },
  { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];
export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const logout = async () => {
    await createClient().auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  };
  return (
    <div className="container-x py-6 sm:py-10">
      <nav className="md:hidden flex gap-2 overflow-x-auto bg-ink p-2 mb-6 -mx-2">
        {links.map(({ name, href, icon: Icon }) => (
          <Link
            className="shrink-0 flex gap-2 items-center px-3 py-2.5 text-xs text-white/80 bg-white/5"
            key={href}
            href={href}
          >
            <Icon size={15} /> {name}
          </Link>
        ))}
        <button
          onClick={() => void logout()}
          className="shrink-0 flex gap-2 items-center px-3 py-2.5 text-xs text-white/80"
        >
          <LogOut size={15} /> Logout
        </button>
      </nav>
      <div className="flex gap-8">
        <aside className="hidden md:block w-56 shrink-0 bg-ink text-white p-5 min-h-[70vh]">
          <p className="display tracking-widest text-xl mb-8">SPHINX</p>
          <nav className="space-y-1">
            {links.map(({ name, href, icon: Icon }) => (
              <Link
                className="flex gap-3 items-center p-3 text-sm text-white/70 hover:text-white hover:bg-white/10"
                key={href}
                href={href}
              >
                <Icon size={17} />
                {name}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => void logout()}
            className="flex gap-3 items-center p-3 mt-8 text-sm text-white/70 hover:text-white"
          >
            <LogOut size={17} /> Logout
          </button>
        </aside>
        <div className="flex-1 min-w-0">
          <header className="flex justify-between items-start gap-3 mb-6 sm:mb-8">
            <div>
              <p className="eyebrow text-brown">Supabase · Live data</p>
              <h1 className="display text-3xl sm:text-4xl mt-2">Панель управления</h1>
            </div>
            <span className="text-xs border px-3 py-2">Admin</span>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
