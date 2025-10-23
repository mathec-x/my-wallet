'use client';

import MenuLayout from '@/app/components/layouts/Menu/Menu.layout';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const router = useRouter();

  const handleClose = (path?: string) => {
    router.replace(path || '/dashboard');
  };

  return <MenuLayout onClose={handleClose} />;
}
