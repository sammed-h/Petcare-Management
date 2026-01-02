import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PawPrint } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">PetCare</span>
          </Link>
          <Link href="/caretakers" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Find Caretakers
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="lg">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
