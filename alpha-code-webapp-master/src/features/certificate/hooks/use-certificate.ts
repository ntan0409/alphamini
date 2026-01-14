import { useQuery } from '@tanstack/react-query';
import { getCertificateByAccountAndCourse } from '../api/certificate-api';

export const useCertificate = (accountId?: string, courseId?: string) => {
  return useQuery({
    queryKey: ['certificate', accountId, courseId],
    queryFn: () => getCertificateByAccountAndCourse(accountId!, courseId!),
    enabled: !!accountId && !!courseId,
    retry: 1,
  });
};
