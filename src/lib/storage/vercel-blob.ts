import { put, del } from '@vercel/blob';

/**
 * Uploads a file to Vercel Blob storage.
 * @param file The file object (File or Blob) to upload.
 * @param path The path/filename to save the file as.
 * @returns The public URL of the uploaded blob.
 */
export async function uploadMedia(file: File | Blob | string, path: string): Promise<string> {
  const blob = await put(path, file, { 
    access: 'public',
  });
  return blob.url;
}

/**
 * Deletes a file from Vercel Blob storage.
 * @param url The public URL of the blob to delete.
 */
export async function deleteMedia(url: string): Promise<void> {
  await del(url);
}
