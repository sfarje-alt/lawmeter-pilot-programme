import { CertificateStatus } from '@/types/certificates';

export const calculateCertificateStatus = (expirationDate: string | null): CertificateStatus => {
  if (!expirationDate) {
    return 'In Progress';
  }

  const expiration = new Date(expirationDate);
  const today = new Date();
  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Expired';
  } else if (diffDays <= 90) {
    return 'Expiring Soon';
  } else {
    return 'Valid';
  }
};

export const getStatusColor = (status: CertificateStatus) => {
  switch (status) {
    case 'Valid':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'Expiring Soon':
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
    case 'Expired':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    case 'In Progress':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
  }
};

export const uploadCertificateFile = async (
  file: File,
  clientId: string,
  certificateId: string
): Promise<{ url: string; key: string } | null> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const year = new Date().getFullYear();
  const fileExt = file.name.split('.').pop();
  const fileName = `${certificateId}.${fileExt}`;
  const filePath = `goglobal-certificates/${clientId}/${year}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('certificate-files')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('certificate-files')
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    key: filePath,
  };
};

export const deleteCertificateFile = async (fileKey: string): Promise<void> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { error } = await supabase.storage
    .from('certificate-files')
    .remove([fileKey]);

  if (error) {
    throw error;
  }
};

export const downloadCertificateFile = async (fileKey: string, fileName: string): Promise<void> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { data, error } = await supabase.storage
    .from('certificate-files')
    .download(fileKey);

  if (error || !data) {
    throw error || new Error('File not found');
  }

  // Create download link
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
