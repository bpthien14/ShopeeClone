import * as React from 'react';

import { RoleGuard } from '@/components/auth/role-guard';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return <RoleGuard>{children}</RoleGuard>;
}
