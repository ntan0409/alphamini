'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthData, getTokenPayload, isValidToken } from '@/utils/tokenUtils';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const checkAuth = async () => {
      try {
        console.log('AuthGuard: Starting auth check...');
        const accessToken = sessionStorage.getItem('accessToken');

        // If no token, redirect to login
        if (!accessToken) {
          console.log('AuthGuard: No access token found');
          clearAuthData();
          router.push('/login');
          return;
        }

        // Validate token first (this handles both validation and refresh if needed)
        try {
          const isValid = await Promise.race([
            isValidToken(accessToken),
            new Promise<boolean>((_, reject) => 
              setTimeout(() => reject(new Error('Auth check timeout')), 5000)
            )
          ]);

          if (!isValid) {
            console.log('AuthGuard: Token validation failed');
            clearAuthData();
            router.push('/login');
            return;
          }
        } catch (error) {
          console.error('AuthGuard: Token validation error:', error);
          clearAuthData();
          router.push('/login');
          return;
        }

        // Get updated token after refresh (if it was refreshed)
        const currentToken = sessionStorage.getItem('accessToken') || accessToken;
        const accountData = getTokenPayload(currentToken);

        // If accountData is null (token decode failed), redirect to login
        if (!accountData) {
          console.log('AuthGuard: Failed to decode token payload');
          clearAuthData();
          router.push('/login');
          return;
        }

        // Check role-based access
        if (allowedRoles && allowedRoles.length > 0) {
          const userRole = accountData.roleName?.toLowerCase();
          
          if (!userRole) {
            console.log('AuthGuard: No role found in token');
            clearAuthData();
            router.push('/login');
            return;
          }

          const hasRequiredRole = allowedRoles.some((role: string) => 
            role.toLowerCase() === userRole
          );
          
          if (!hasRequiredRole) {
            console.log(`AuthGuard: Role mismatch. User role: ${userRole}, Required: ${allowedRoles.join(', ')}`);
            
            // Redirect to appropriate page based on user's role
            switch (userRole) {
              case 'admin':
                router.push('/admin');
                break;
              case 'parent':
              case 'user':
                router.push('/parent');
                break;
              case 'staff':
                router.push('/staff');
                break;
              case 'children':
                router.push('/children');
                break;
              default:
                router.push('/');
            }
            return;
          }
        }
        
        console.log('AuthGuard: Auth check successful, setting authenticated');
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, allowedRoles, isMounted]);

  // Don't render anything until component is mounted
  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" suppressHydrationWarning></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
