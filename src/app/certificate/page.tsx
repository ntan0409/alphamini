'use client';

import { useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, Home, ArrowLeft } from 'lucide-react';
import { useCertificate } from '@/features/certificate/hooks/use-certificate';
import { CertificateCard } from '@/components/certificate/certificate-card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ErrorState, LoadingState } from '@/components/users';
import { Header } from '@/components/home/header';
import { Footer } from '@/components/home/footer';

function CertificateContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const accountId = searchParams.get('accountId');
    const courseId = searchParams.get('courseId');
    const certificateRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = useCertificate(accountId || undefined, courseId || undefined);

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        try {
            // Dynamically import dom-to-image-more only on client side
            const domtoimage = (await import('dom-to-image-more')).default;

            // Show loading indicator
            const button = document.querySelector('button[data-download]') as HTMLButtonElement;
            if (button) {
                button.disabled = true;
                button.textContent = 'Đang xử lý...';
            }

            // Use dom-to-image-more to convert to PNG blob
            const blob = await domtoimage.toBlob(certificateRef.current, {
                quality: 1.0,
                bgcolor: '#f3f4f6',
                style: {
                    transform: 'scale(2)',
                    transformOrigin: 'top left',
                    width: certificateRef.current.offsetWidth + 'px',
                    height: certificateRef.current.offsetHeight + 'px',
                },
                width: certificateRef.current.offsetWidth * 2,
                height: certificateRef.current.offsetHeight * 2,
            });

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const fileName = `chung-nhan-${data?.accountName?.replace(/\s+/g, '-') || 'download'}-${Date.now()}.png`;
            link.download = fileName;
            link.href = url;
            link.click();

            // Clean up
            URL.revokeObjectURL(url);

            // Reset button
            if (button) {
                button.disabled = false;
                button.innerHTML = '<svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Tải xuống chứng nhận';
            }
        } catch (error) {
            console.error('Error downloading certificate:', error);
            toast.error('Có lỗi xảy ra khi tải xuống chứng nhận. Vui lòng thử lại.');

            // Reset button on error
            const button = document.querySelector('button[data-download]') as HTMLButtonElement;
            if (button) {
                button.disabled = false;
                button.innerHTML = '<svg class="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Tải xuống chứng nhận';
            }
        }
    };

    if (!accountId || !courseId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
                <ErrorState />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
                <div className="bg-white rounded-xl shadow-sm border p-20 text-center">
                    <LoadingState message="Đang tải chứng nhận..." />
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
                <ErrorState error={error || 'Chứng nhận không tồn tại hoặc chưa được cấp cho tài khoản này.'} />
            </div>
        );
    }

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-50 p-10">
                {/* Navigation Header */}
                <div className="container mx-auto max-w-[1400px] mb-6">
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="container mx-auto max-w-[1400px]">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
                        {/* Left Column - Info & Actions */}
                        <div className="space-y-6 order-2 lg:order-1 lg:col-span-2">
                            {/* Title Section */}
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
                                    <span className="text-2xl">🎉</span>
                                    <span>Chứng nhận hoàn thành</span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                    Chúc mừng bạn đã hoàn thành xuất sắc!
                                </h1>

                                <p className="text-lg text-gray-600">
                                    Xin chúc mừng <span className="font-bold text-blue-600">{data.accountName}</span> đã hoàn thành khóa học và nhận được chứng nhận từ AlphaCode.
                                </p>
                            </div>

                            {/* Stats Cards */}
                            {/* <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="text-3xl mb-2">🎓</div>
                                <div className="text-sm text-gray-500">Người nhận</div>
                                <div className="text-lg font-bold text-gray-900 truncate">{data.accountName}</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="text-3xl mb-2">📜</div>
                                <div className="text-sm text-gray-500">Trạng thái</div>
                                <div className="text-lg font-bold text-green-600">Đã cấp</div>
                            </div>
                        </div> */}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button
                                    onClick={handleDownload}
                                    data-download
                                    size="lg"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all text-lg py-6"
                                >
                                    <Download className="h-6 w-6 mr-2" />
                                    Tải xuống chứng nhận
                                </Button>
                                <Button
                                    onClick={() => router.push('/')}
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 shadow-sm transition-all text-lg py-6"
                                >
                                    <Home className="h-6 w-6 mr-2" />
                                    Về trang chủ
                                </Button>
                            </div>

                            {/* Certificate Info */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xl">✓</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">Xác thực chứng nhận</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Chứng nhận này được cấp bởi{' '}
                                            <span className="font-bold text-blue-600">AlphaCode</span>
                                        </p>
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Mã chứng nhận</p>
                                            <p className="font-mono text-sm text-gray-900 break-all">{data.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Certificate Preview */}
                        <div className="order-1 lg:order-2 lg:col-span-3">
                            <div className="relative">
                                {/* Certificate Card */}
                                <div className="relative bg-white rounded-2xl shadow-xl p-7">
                                    <CertificateCard data={data} ref={certificateRef} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default function CertificatePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
                    <div className="bg-white rounded-xl shadow-sm border p-20 text-center">
                        <LoadingState message="Đang tải chứng nhận..." />
                    </div>
                </div>
            }
        >
            <CertificateContent />
        </Suspense>
    );
}
