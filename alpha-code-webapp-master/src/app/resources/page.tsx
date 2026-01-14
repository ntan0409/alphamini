"use client";

import { Header } from "@/components/home/header";
import { Footer } from "@/components/home/footer";
import BundleCard from "@/components/resources/bundle-card";
import CourseCard from "@/components/resources/course-card";
import AddonCard from "@/components/resources/addo-card";
import SubscriptionCard from "@/components/resources/subscription-card";
import ApkCard from "@/components/resources/apk-card";
import LicenseCard from "@/components/resources/license-card";

export default function ResourcesPage() {
    return (
        <>
            <Header />

            <main className="container mx-auto px-4 py-16">
                {/* Hero */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-white to-sky-50 border border-gray-100 p-10 mb-12">
                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Danh mục sản phẩm & dịch vụ AlphaCode
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-3">
                            Khám phá hệ sinh thái sản phẩm toàn diện: ứng dụng APK, license key AI,
                            subscription định kỳ, addon mở rộng, khóa học chuyên sâu và các gói combo ưu đãi.
                        </p>

                        {/* Quick anchors */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <a href="#apk" className="px-4 py-2 rounded-full bg-white border text-sm hover:bg-rose-50 transition">APK</a>
                            <a href="#license" className="px-4 py-2 rounded-full bg-white border text-sm hover:bg-sky-50 transition">License</a>
                            <a href="#subscription" className="px-4 py-2 rounded-full bg-white border text-sm hover:bg-blue-50 transition">Subscription</a>
                            <a href="#addon" className="px-4 py-2 rounded-full bg-white border text-sm hover:bg-emerald-50 transition">Addon</a>
                            <a href="#course" className="px-4 py-2 rounded-full bg-white border text-sm hover:bg-indigo-50 transition">Khóa học</a>
                            <a href="#bundle" className="px-4 py-2 rounded-full bg-white border text-sm hover:bg-violet-50 transition">Bundle</a>
                        </div>
                    </div>
                </section>

                <div className="space-y-24">
                    {/* APK */}
                    <section id="apk" className="space-y-6 scroll-mt-20">
                        <h2 className="text-2xl font-semibold flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-100">📱</span>
                            Ứng dụng APK độc quyền
                        </h2>
                        <p className="text-muted-foreground">
                            Bộ sưu tập các ứng dụng (APK) được tối ưu dành riêng cho robot AlphaCode
                            và thiết bị Android tương thích. Khách hàng có thể tải về và cài đặt trực tiếp
                            lên robot để kích hoạt các tính năng điều khiển, học tập và tương tác AI.
                        </p>

                        {/* Danh sách preview/mẫu hoặc card chính */}
                        <ApkCard />
                    </section>


                    {/* License */}
                    <section id="license" className="space-y-6 scroll-mt-20">
                        <h2 className="text-2xl font-semibold flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-100">🔑</span>
                            License Key Cao Cấp
                        </h2>
                        <p className="text-muted-foreground">
                            Chỉ cần <span className="font-medium text-foreground">mua một lần</span> – bạn sẽ
                            <span className="font-medium text-foreground">sở hữu trọn đời</span> License Key,
                            mở khóa toàn bộ tính năng nâng cao độc quyền không có trong bản miễn phí.
                            Trải nghiệm đầy đủ sức mạnh AI từ AlphaCode với hiệu suất tối ưu và hỗ trợ ưu tiên.
                        </p>
                        <LicenseCard />
                    </section>


                    {/* Subscription */}
                    <section id="subscription" className="space-y-6 scroll-mt-20">
                        <h2 className="text-2xl font-semibold flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">🔁</span>
                            Gói dịch vụ định kỳ (Subscription)
                        </h2>
                        <p className="text-muted-foreground">
                            Kích hoạt khả năng giao tiếp giọng nói tiếng Việt & tiếng Anh với robot. Mua theo tháng hoặc năm để sử dụng không giới hạn, tốc độ phản hồi nhanh hơn và trải nghiệm AI ổn định hơn so với bản miễn phí.
                        </p>
                        <SubscriptionCard />
                    </section>


                    {/* Addon */}
                    <section id="addon" className="space-y-6 scroll-mt-20">
                        <h2 className="text-2xl font-semibold flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100">➕</span>
                            Addon mở rộng nâng cao
                        </h2>
                        <p className="text-muted-foreground">
                            Các gói tính năng chuyên sâu giúp robot trở nên thông minh hơn.
                            Người dùng có thể mua riêng từng addon hoặc kết hợp theo nhu cầu học tập và trải nghiệm.
                        </p>
                        <AddonCard />
                    </section>



                    {/* Course */}
                    <section id="course" className="space-y-6 scroll-mt-20">
                        <h2 className="text-2xl font-semibold flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100">🎓</span>
                            Khóa học chuyên sâu
                        </h2>
                        <p className="text-muted-foreground">
                            Lộ trình học từ cơ bản đến nâng cao về giao tiếp giọng nói (EN–VN), lập trình hành vi,
                            tạo kịch bản tương tác và điều khiển robot AI thực tế – phù hợp cho cả người mới và
                            người muốn khai thác robot chuyên sâu.
                        </p>
                        <CourseCard />
                    </section>


                    {/* Bundle */}
                    <section id="bundle" className="space-y-6 scroll-mt-20">
                        <h2 className="text-2xl font-semibold flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-100">📦</span>
                            Gói khóa học trọn bộ (Course Bundle)
                        </h2>
                        <p className="text-muted-foreground">
                            Học tiết kiệm hơn với các lộ trình khóa học được đóng gói theo cấp độ
                            (Cơ bản • Nâng cao • Chuyên sâu) hoặc theo chủ đề kỹ năng – phù hợp
                            cho người học muốn đi theo một hành trình rõ ràng từ đầu đến cuối.
                        </p>
                        <BundleCard />
                    </section>

                </div>
            </main>

            <Footer />
        </>
    );
}
