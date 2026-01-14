'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Video, CheckCircle, XCircle, Clock, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingState } from '@/components/users';
import useVideoSubmissions from '@/features/submissions/hooks/use-video-submissions';

export default function VideoSubmissionsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    const { data: submissions, isLoading } = useVideoSubmissions();

    // Filter submissions
    const filteredSubmissions = submissions?.filter((submission) => {
        const matchesSearch = 
            submission.accountName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            submission.lessonTitle?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = 
            statusFilter === 'all' || 
            submission.status.toString() === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: number) => {
        // Map numeric status to localized labels
        const label = status === 0 ? 'Chờ chấm' : status === 1 ? 'Đạt' : status === 2 ? 'Không đạt' : 'Không rõ';

        switch (status) {
            case 0: // Pending
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        {label}
                    </Badge>
                );
            case 1: // Pass
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {label}
                    </Badge>
                );
            case 2: // Fail
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircle className="h-3 w-3 mr-1" />
                        {label}
                    </Badge>
                );
            default:
                return <Badge variant="outline">{label}</Badge>;
        }
    };

    const getStatusCount = (status: number) => {
        return submissions?.filter(s => s.status === status).length || 0;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingState message="Đang tải bài tập đã nộp" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-6">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Video Submissions</h1>
                        <p className="text-gray-600 mt-1">
                            Chấm điểm video bài tập từ học viên
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Video className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Chờ chấm
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">
                            {getStatusCount(4)}
                        </div>
                    </CardContent>
                </Card>
                

                
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Không đạt
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                            {getStatusCount(6)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Bộ lọc
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Tìm kiếm theo tên học viên hoặc bài học..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="4">Chờ chấm</SelectItem>
                                <SelectItem value="6">Không đạt</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Submissions List */}
            <div className="space-y-4">
                {filteredSubmissions && filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                        <Card key={submission.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Video Thumbnail */}
                                    <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {submission.videoUrl ? (
                                            <video
                                                src={submission.videoUrl}
                                                className="w-full h-full object-cover"
                                                controls={false}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Video className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {submission.lessonTitle}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Học viên: <span className="font-medium">{submission.accountName}</span>
                                                </p>
                                            </div>
                                            {getStatusBadge(submission.status)}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                            <div>
                                                <span className="text-gray-500">Ngày nộp:</span>{' '}
                                                {new Date(submission.createdDate).toLocaleDateString('vi-VN')}
                                            </div>
                                            {submission.lastUpdated && (
                                                <div>
                                                    <span className="text-gray-500">Cập nhật:</span>{' '}
                                                    {new Date(submission.lastUpdated).toLocaleDateString('vi-VN')}
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => router.push(`/staff/video-submissions/${submission.id}`)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            <Video className="h-4 w-4 mr-2" />
                                            Xem và chấm điểm
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Không tìm thấy submission nào
                            </h3>
                            <p className="text-gray-600">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Thử thay đổi bộ lọc để xem kết quả khác'
                                    : 'Chưa có video submission nào được nộp'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
