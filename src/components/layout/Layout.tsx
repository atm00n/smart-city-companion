import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { Chatbot } from '@/components/Chatbot';

export function Layout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container max-w-lg mx-auto px-4 py-4">
        <Outlet />
      </main>
      <BottomNav />
      <Chatbot />
    </div>
  );
}
