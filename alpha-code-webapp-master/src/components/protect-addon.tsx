"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "@/utils/tokenUtils";
import { ValidateAddon } from "@/types/addon";
import { useAddonAccess } from "@/features/addon/hooks/use-license-key-addon";
import { setAddonKeyCookie, setAccessTokenCookie } from "@/utils/cookieUtils";

interface ProtectAddonProps {
  children: React.ReactNode;
  category: number;
  sessionKeyName?: string;
  validateFn?: (payload: ValidateAddon) => Promise<{ allowed: boolean; status?: string } | boolean>;
  purchaseUrl?: string;
}

const LockedOverlay = ({ purchaseUrl, children }: { purchaseUrl: string; children: React.ReactNode }) => (
  <div className="relative min-h-screen">
    {/* Overlay gradient nhẹ */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60 flex flex-col items-center justify-center z-20 transition-opacity duration-300">
      <div className="bg-white/5 border border-white/20 rounded-xl p-8 text-center max-w-md mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 mb-4 text-blue-400 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V5a3 3 0 10-6 0v3c0 1.657 1.343 3 3 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
        </svg>

        <h2 className="text-2xl font-bold text-white mb-2">Nội dung bị khóa</h2>
        <p className="text-gray-200 mb-6 text-sm leading-relaxed">
          Bạn chưa có quyền truy cập vào trang này.<br />
          Hãy mua dịch vụ để mở khóa nội dung này.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.href = purchaseUrl}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md transition-all hover:bg-blue-700 hover:scale-105"
          >
            Mua ngay
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="px-5 py-2 border border-gray-300 text-gray-100 rounded-md transition-all hover:bg-gray-100 hover:text-black hover:scale-105"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>

    {/* Background mờ nhẹ */}
    <div className="filter brightness-75 pointer-events-none">{children}</div>
  </div>
);

export const ProtectAddon = ({
  children,
  category,
  sessionKeyName = "key",
  validateFn,
  purchaseUrl = "/addons",
}: ProtectAddonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  const sessionKey = typeof window !== "undefined" ? sessionStorage.getItem(sessionKeyName) || undefined : undefined;
  const accessToken = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") || "" : "";
  const accountId = getUserIdFromToken(accessToken || "") || undefined;

  const { useValidateAccess } = useAddonAccess();
  // Build payload matching backend shape: ValidateAddon expects `key` (not `sessionKey`).
  const validatePayload: ValidateAddon = { key: sessionKey, accountId, category };
  // Small log to help debugging in dev
  // eslint-disable-next-line no-console
  // Call the hook unconditionally — the internal `enabled` option will prevent queries when data is missing.
  const query = useValidateAccess(validatePayload);

  // Redirect nếu chưa login
  useEffect(() => {
    if (typeof window !== "undefined" && !accessToken) {
      //router.push("/login");
    }
  }, [accessToken, router]);

  // Sử dụng validateFn (legacy) với timeout
  useEffect(() => {
    if (!validateFn) return;

    let mounted = true;
    const checkAccess = async () => {
      setIsLoading(true);
      try {
        const payload: ValidateAddon = { key: sessionKey, accountId, category };
        const result = await Promise.race([
          validateFn(payload),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Validation timeout")), 8000)),
        ]);

        if (!mounted) return;

        const allowed = typeof result === "boolean"
          ? result
          : Boolean((result as { allowed?: boolean })?.allowed);
        setIsAllowed(allowed);
      } catch (err) {
        console.error("ProtectAddon: validation failed", err);
        if (mounted) setIsAllowed(false);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    checkAccess();
    return () => { mounted = false; };
  }, [validateFn, sessionKey, accountId, category]);

  // Update state từ query (React Query) và set cookies khi validate thành công
  useEffect(() => {
    if (query) {
      setIsLoading(query.isLoading || query.isFetching);
      if (query.data !== undefined) {
        const allowed = Boolean(query.data);
        setIsAllowed(allowed);
        
        // Set cookies khi validate thành công
        if (allowed && sessionKey && accessToken) {
          setAddonKeyCookie(sessionKey);
          setAccessTokenCookie(accessToken);
        }
      }
    }
  }, [query?.data, query?.isLoading, query?.isFetching, query, sessionKey, accessToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAllowed) return <LockedOverlay purchaseUrl={purchaseUrl}>{children}</LockedOverlay>;

  return <>{children}</>;
};

export default ProtectAddon;
