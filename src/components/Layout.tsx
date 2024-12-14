import { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

export function Layout() {
  const location = useLocation();
  const isCheckoutFlow = location.pathname.includes('/checkout') || 
                        location.pathname.includes('/order-confirmation') ||
                        location.pathname.includes('/order-tracking');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={cn(
        "flex-1 bg-gradient-to-b from-purple-50 to-white",
        "pt-16 sm:pt-20" // Add padding for fixed header
      )}>
        <Outlet />
      </main>
      {!isCheckoutFlow && <Footer />}
    </div>
  );
}