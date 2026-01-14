import { CertificateInformation } from '@/types/certificate';
import { coursesHttp } from '@/utils/http';

export const getCertificateByAccountAndCourse = async (
  accountId: string,
  courseId: string
): Promise<CertificateInformation> => {
  const response = await coursesHttp.get<CertificateInformation>(
    `/certificates/get-by-account-course/${accountId}/${courseId}`
  );
  return response.data;
};
