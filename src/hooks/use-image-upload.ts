import { useState } from 'react';

const BASE = import.meta.env.VITE_API_URL || '';

export function useImageUpload(_bucketName?: string) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true);
    setProgress(0);

    try {
      const token = localStorage.getItem('opser_token') || '';
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${BASE}/api/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setProgress(100);
      // Return full URL
      return `${BASE}${data.url}`;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress };
}
