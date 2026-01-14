"use client";

import React, { useEffect, useState } from "react";
import { useValidateLicenseKey } from "@/features/license-key/hooks/use-license-key";
import { getUserIdFromToken } from "@/utils/tokenUtils";
import LoadingState from "./loading-state";
import { setLicenseKeyCookie, setAccessTokenCookie } from "@/utils/cookieUtils";

interface ProtectLicenseProps {
  children: React.ReactNode;
  accountId?: string;
  licenseKey?: string;
  purchaseUrl?: string;
}

const LockedOverlayLicense = ({ purchaseUrl, children }: { purchaseUrl: string; children: React.ReactNode }) => (
  <div className="relative min-h-screen">
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60 flex flex-col items-center justify-center z-20 transition-opacity duration-300">
      <div className="bg-white/5 border border-white/20 rounded-xl p-8 text-center max-w-md mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mb-4 text-amber-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V5a3 3 0 10-6 0v3c0 1.657 1.343 3 3 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
        </svg>

        <h2 className="text-2xl font-bold text-white mb-2">Thiếu License</h2>
        <p className="text-gray-200 mb-6 text-sm leading-relaxed">Bạn chưa nhập hoặc chưa kích hoạt license để truy cập nội dung này. Vui lòng nhập license hoặc mua để mở khóa.</p>

        <div className="flex gap-3 justify-center">
          <button onClick={() => (window.location.href = "/license-key")} className="px-5 py-2 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600">
            Mua
          </button>
          <button onClick={() => (window.location.href = "/license-key")} className="px-5 py-2 border border-gray-300 text-gray-100 rounded-md hover:bg-gray-100 hover:text-black">
            Thông tin về license
          </button>
        </div>
      </div>
    </div>

    <div className="filter brightness-75 pointer-events-none">{children}</div>
  </div>
);

export const ProtectLicense = ({ children, accountId, licenseKey, purchaseUrl = "/payment" }: ProtectLicenseProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Infer accountId/licenseKey from session storage and react to storage/auth changes so
  // the hook will re-run when the user logs in or enters a key.
  const [inferredAccountId, setInferredAccountId] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    const token = sessionStorage.getItem("accessToken");
    return token ? getUserIdFromToken(token) ?? undefined : undefined;
  });
  const [inferredLicenseKey, setInferredLicenseKey] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    return sessionStorage.getItem("key") || undefined;
  });

  useEffect(() => {
    const refresh = () => {
      const token = sessionStorage.getItem("accessToken");
      setInferredAccountId(token ? getUserIdFromToken(token) ?? undefined : undefined);
      setInferredLicenseKey(sessionStorage.getItem("key") || undefined);
    };

    // Some parts of the app dispatch a custom event when auth changes (see header/logout)
    window.addEventListener("authStateChange", refresh);
    // storage event helps when other tabs change sessionStorage
    window.addEventListener("storage", refresh);

    // ensure initial read
    refresh();

    return () => {
      window.removeEventListener("authStateChange", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // call the hook with the current inferred values; the hook enables itself when both are present
  const query = useValidateLicenseKey(accountId ?? inferredAccountId, licenseKey ?? inferredLicenseKey);

  // Keep local loading so we can show a spinner while query is resolving.
  useEffect(() => {
    setIsLoading(query.isLoading || query.isFetching);
  }, [query?.isLoading, query?.isFetching]);

  const isAllowedDerived = query.data;

  // Set cookies khi validate license key thành công
  useEffect(() => {
    if (query.data === true && inferredLicenseKey && inferredAccountId) {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
      setLicenseKeyCookie(inferredLicenseKey);
      if (token) {
        setAccessTokenCookie(token);
      }
    }
  }, [query.data, inferredLicenseKey, inferredAccountId]);

  // DEBUG: show query results in console to help trace why it may still block
  // Remove or disable these logs in production
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug("ProtectLicense - accountId:", accountId, "query.data:", query.data, "isAllowedDerived:", isAllowedDerived, "status:", query.status, "error:", query.error);
  }, [query?.data, query?.error, accountId, isAllowedDerived, query?.status]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingState />
      </div>
    );
  }

  if (!isAllowedDerived) return <LockedOverlayLicense purchaseUrl={purchaseUrl}>{children}</LockedOverlayLicense>;

  return <>{children}</>;
};

export default ProtectLicense;
