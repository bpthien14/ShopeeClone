'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { useUser } from '@/hooks/auth/use-user';

export interface RoleGuardProps {
  children: React.ReactNode;
}

export function RoleGuard({ children }: RoleGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const pathname = usePathname();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if (user) {
      if (user.role === 'merchant' && pathname?.startsWith('/customer')) {
        router.replace(paths.merchant.dashboard);
      } else if (user.role === 'customer' && pathname?.startsWith('/merchant')) {
        router.replace(paths.customer.dashboard);
      } else {
        router.replace(user.role === 'merchant' ? paths.merchant.dashboard : paths.customer.dashboard);
      }
      // return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
