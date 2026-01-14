"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { isValidToken } from '@/utils/tokenUtils';
import { useSubscription } from "@/features/subscription/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Check, Star, Mic, Globe, Bot, Video } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";
import { Header } from "@/components/home/header";
import { Footer } from "@/components/home/footer";

const billingCycleLabel = (cycle: number) => {
  if (cycle === 1) return "/tháng";
  if (cycle === 3) return "/3 tháng";
  if (cycle === 9) return "/9 tháng";
  if (cycle === 12) return "/năm";
  return "/chu kỳ";
};

const priceFormat = (price: number) => price.toLocaleString('vi-VN');

const parseFeatures = (desc: string) => {
  if (!desc) return [];
  const doc = typeof window !== 'undefined' && window.DOMParser
    ? new window.DOMParser().parseFromString(desc, "text/html")
    : null;
  const ps = doc ? Array.from(doc.querySelectorAll("p")) : [];
  return ps.length
    ? ps.map(p => p.textContent?.trim() || "")
    : desc.split(/<br\s*\/?>|\n|\r/).filter(Boolean);
};

export default function SubscriptionPlansPage() {
  const { useGetPagedSubscriptions } = useSubscription();
  const { data, isLoading, isError } = useGetPagedSubscriptions(1, 10);

  const router = useRouter();

  const handleRegister = async (planId: string) => {
    try {
      const token = sessionStorage.getItem('accessToken') || '';
      const valid = await isValidToken(token);
      if (!valid) {
        toast.error('Vui lòng đăng nhập để tiếp tục');
        return;
      }
      // Redirect to payment with query params
      router.push(`/payment?category=plan&id=${encodeURIComponent(planId)}`);
    } catch (err) {
      console.error('Error handling register click', err);
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const plans: (SubscriptionPlan & { isRecommended?: boolean })[] = data?.data
    ? data.data.map((plan, i) => ({
      ...plan,
      isRecommended: plan.name.toLowerCase().includes("pro") || plan.billingCycle === 12 || i === 1,
    }))
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-[color:var(--background)]">
      <Header />

      <main className="flex-1 relative overflow-x-hidden px-2 md:px-8 py-8 md:py-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-10 items-stretch">
        {/* subtle background accents */}
        <div className="pointer-events-none select-none absolute -z-10 inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-60" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-50 blur-3xl opacity-70" />
        </div>

        {/* Left: Text + Plans */}
        <div className="flex-1 flex flex-col justify-start md:justify-between gap-6 z-10">
          <div className="mb-6">
            <h1 className="flex items-center text-3xl md:text-4xl font-bold mb-4 text-[color:var(--chart-2)] leading-tight gap-2">
              <Star className="text-yellow-400 w-6 h-6" strokeWidth={2.2} />
              Đăng ký gói Alpha Mini
            </h1>
            <ul className="text-sm space-y-3 text-[color:var(--foreground)]">
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-[color:var(--chart-2)] mt-1" />
                Giao tiếp không giới hạn tiếng Việt & tiếng Anh với robot
              </li>
              <li className="flex items-start gap-2">
                <Mic className="w-4 h-4 text-[color:var(--chart-2)] mt-1" />
                Điều khiển robot bằng giọng nói, phản hồi nhanh
              </li>
              <li className="flex items-start gap-2">
                <Bot className="w-4 h-4 text-[color:var(--chart-2)] mt-1" />
                Tương tác AI trực tiếp trong bài học, trò chơi
              </li>
              <li className="flex items-start gap-2">
                <Video className="w-4 h-4 text-[color:var(--chart-2)] mt-1" />
                Render video AI từ ảnh do robot chụp (ví dụ: tranh học sinh vẽ)
              </li>
            </ul>
          </div>


          {/* Cards plans */}
          <div className="w-full max-w-2xl flex-1">
            <div className="flex flex-col gap-7 h-full">
              {isLoading && (
                <div className="text-[color:var(--chart-2)] py-10 text-center font-semibold">Đang tải các gói...</div>
              )}
              {isError && (
                <div className="text-red-600 py-10 text-center font-semibold">Không tải được dữ liệu gói đăng ký.</div>
              )}
              {plans && plans.length > 0 && plans.map(plan => {
                const features = parseFeatures(plan.description);
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl border shadow-lg px-5 py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 relative transition-all duration-200 
                      hover:shadow-xl hover:-translate-y-[2px]
                      ${plan.isRecommended ? "border-[color:var(--chart-2)] shadow-[0_4px_28px_0_rgba(37,99,235,0.12)]" : "border-[color:var(--border)]"}
                      ${plan.isCurrent ? "ring-2 ring-[color:var(--accent)] bg-[color:var(--muted)]" : "bg-[color:var(--card)]"}
                    `}
                  >
                    {/* Main Info with badge */}
                    <div className="flex-1 text-left">
                      <div className="mb-2 flex items-center gap-2">
                        {plan.isCurrent && (
                          <span className="bg-[color:var(--muted)] text-[color:var(--chart-2)] font-bold px-3 py-0.5 rounded-full text-xs">Gói hiện tại</span>
                        )}
                        {!plan.isCurrent && plan.isRecommended && (
                          <span className="bg-[color:var(--chart-2)] text-white font-semibold px-3 py-0.5 rounded-full text-xs shadow">Khuyên dùng</span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold mb-1 text-[color:var(--chart-2)]">{plan.name}</h2>
                      <div className="mb-1 text-2xl font-extrabold text-[color:var(--foreground)]">
                        {plan.price === 0 ? 'Miễn phí' : priceFormat(plan.price) + ' VNĐ'}
                        <span className="ml-2 text-base font-medium text-[color:var(--muted-foreground)]">{billingCycleLabel(plan.billingCycle)}</span>
                      </div>
                      <ul className="text-sm space-y-1 mt-2">
                        {features.map((ft, i) => (
                          <li key={i} className="flex items-center gap-1 text-[color:var(--foreground)]">
                            <Check className="w-4 h-4 text-green-500 inline-block mr-2" />{ft}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button */}
                    <div className="flex flex-row md:flex-col gap-3 md:justify-between md:min-w-[120px]">
                      <Button
                        className={`rounded-xl px-6 py-2 font-semibold text-base border border-[color:var(--chart-2)] transition 
                        ${plan.isCurrent ? "bg-[color:var(--muted)] text-[color:var(--chart-2)] cursor-not-allowed" :
                            "bg-[color:var(--chart-2)] text-white hover:bg-white hover:text-[color:var(--chart-2)]"}`}
                        disabled={plan.isCurrent}
                        onClick={() => handleRegister(String(plan.id))}
                      >
                        {plan.buttonText ? plan.buttonText : plan.isCurrent ? "Đang sử dụng" : "Đăng ký"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Image + description */}
        <div className="w-full md:flex-1 flex flex-col items-center md:items-end gap-4">
          <div className="w-full flex justify-center md:justify-end items-center flex-1">
            <img
              src="/welcome_content.webp"
              alt="Alpha Mini"
              className="block max-w-full max-h-full object-contain animate-float drop-shadow-xl"
              draggable={false}
              style={{ minWidth: 280 }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
