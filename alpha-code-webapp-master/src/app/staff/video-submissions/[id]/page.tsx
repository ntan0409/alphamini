'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Send, Video, User, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { LoadingState, ErrorState } from '@/components/users';
import { toast } from 'sonner';
import useVideoSubmission from '@/features/submissions/hooks/use-video-submission';
import useGradeSubmission from '@/features/submissions/hooks/use-grade-submission';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
    DialogTrigger,
} from '@/components/ui/dialog';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function VideoSubmissionDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);

    const { data: submission, isLoading, error, refetch } = useVideoSubmission(resolvedParams.id);
    const gradeSubmission = useGradeSubmission();

    const handleGrade = async (approved: boolean) => {
        if (!submission) return;

        // if rejecting, ensure comment exists
        if (!approved && !comment.trim()) {
            toast.error('Vui lòng nhập lý do FAIL');
            return;
        }

        setIsSubmitting(true);
        try {
            await gradeSubmission.mutateAsync({
                submissionId: submission.id,
                approved,
                comment: comment.trim() || undefined,
            });

            toast.success(approved ? 'Đã chấm PASS!' : 'Đã chấm FAIL!');

            // refresh data but do not redirect so staff can re-grade if needed
            refetch();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi chấm bài');
            console.error(error);
        } finally {
            setIsSubmitting(false);
            setShowFailModal(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <LoadingState message="Đang tải submission..." />
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className="container mx-auto py-8 px-4">
                <ErrorState error="Không tìm thấy submission" />
            </div>
        );
    }

    const isPending = submission.status === 4;
    const isApproved = submission.status === 5;
    const isRejected = submission.status === 6;

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            {/* Header */}
            <div className="mb-6">
                <Button
                    onClick={() => router.push('/staff/video-submissions')}
                    variant="ghost"
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại danh sách
                </Button>

                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Chi tiết Submission</h1>
                    {isPending && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Chờ chấm
                        </Badge>
                    )}
                    {isApproved && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Đạt
                        </Badge>
                    )}
                    {isRejected && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <XCircle className="h-3 w-3 mr-1" />
                            Không đạt
                        </Badge>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Video */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Video Player */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="h-5 w-5" />
                                Video bài làm
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {submission.videoUrl ? (
                                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                    <video
                                        src={submission.videoUrl}
                                        controls
                                        className="w-full h-full"
                                    >
                                        Trình duyệt không hỗ trợ phát video.
                                    </video>
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <Video className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600">Không có video</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Log Data */}
                    {submission.logData && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Dữ liệu log
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                                    {submission.logData}
                                </pre>
                            </CardContent>
                        </Card>
                    )}

                    {/* Grading Section - Only for pending submissions */}
                    {/* Grading Section - always shown so staff can update grade */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Chấm điểm</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nhận xét của staff (tùy chọn)
                                </label>
                                <Textarea
                                    placeholder="Nhập nhận xét về bài làm của học viên (bắt buộc nếu chấm FAIL)..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => handleGrade(true)}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Đạt / Cập nhật
                                </Button>
                                <Button
                                    onClick={() => setShowFailModal(true)}
                                    disabled={isSubmitting}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Không đạt / Cập nhật
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fail confirmation modal */}
                    <Dialog open={showFailModal} onOpenChange={setShowFailModal}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Xác nhận Không đạt</DialogTitle>
                            </DialogHeader>
                            <div className="py-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Lý do Không đạt (bắt buộc)</label>
                                <Textarea
                                    placeholder="Nhập lý do khiến học viên không đạt"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={5}
                                />
                            </div>
                            <DialogFooter>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setShowFailModal(false)}>Hủy</Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleGrade(false)}
                                        disabled={isSubmitting || !comment.trim()}
                                    >
                                        Xác nhận Không đạt
                                    </Button>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Previous Staff Comment */}
                    {!isPending && submission.staffComment && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Nhận xét của staff
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {submission.staffComment}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar - Info */}
                <div className="space-y-6">
                    {/* Student Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Thông tin học viên
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Tên học viên</p>
                                <p className="font-semibold text-gray-900">
                                    {submission.accountName}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Account ID</p>
                                <p className="font-mono text-sm text-gray-700">
                                    {submission.accountId}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lesson Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Thông tin bài học</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Tên bài học</p>
                                <p className="font-semibold text-gray-900">
                                    {submission.lessonTitle}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Lesson ID</p>
                                <p className="font-mono text-sm text-gray-700">
                                    {submission.lessonId}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Thời gian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Ngày nộp</p>
                                <p className="text-gray-900">
                                    {new Date(submission.createdDate).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            {submission.lastUpdated && (
                                <div>
                                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                                    <p className="text-gray-900">
                                        {new Date(submission.lastUpdated).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
