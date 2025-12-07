'use client';

import { type getCurrentUser } from '@/app/actions/user/user.actions';
import Header from '@/app/components/layouts/Header/Header.layout';
import { AuthProvider } from '@/app/providers/auth/AuthProvider';
import { PromptProvider } from '@/app/providers/prompt/PromptProvider';
import PwaProvider from '@/app/providers/pwa/PwaProvider';
import Container from '@mui/material/Container';

interface ClientLayoutProps {
  children: React.ReactNode;
  drawer: React.ReactNode;
  user: Awaited<ReturnType<typeof getCurrentUser>>;
}

export default function MainLayout({ children, drawer, user }: ClientLayoutProps) {
  return (
    <AuthProvider user={user}>
      <PwaProvider>
        <Header user={user} />
        <PromptProvider>
          <Container
            maxWidth="xl"
            sx={{
              p: 1,
              minHeight: 'calc(100vh - 64px)',
            }}>
            {children}
          </Container>
        </PromptProvider>
        {drawer}
      </PwaProvider>
    </AuthProvider>
  );
}