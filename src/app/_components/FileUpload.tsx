'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { downloadFileFromBucket, uploadFileToBucket } from '../_lib/actions';
import Image from 'next/image';

export function FileUpload({ className, userId, bucketId }) {
  const [uploaded, setUploaded] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const handleFileAccepted = async (file) => {
    try {
      // Create a new FormData object and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Attempt to upload the file
      const uploadResult = await uploadFileToBucket(userId, bucketId, formData);
      // If successful, update the upload status and set the image URL
      console.log(uploadResult, 'uploadResult')
      setUploaded(true);
      if (uploadResult?.path) {
        const data = await downloadFileFromBucket(bucketId, uploadResult.path)
        console.log(data, 'data')
        if (data) {
            const url = URL.createObjectURL(data)
            setUploadedImageUrl(url);
        }
      }
    } catch (error) {
      // Handle any errors
      console.error('Upload failed', error);
      setUploaded(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Reset upload status on new drop
      setUploaded(false);
      setUploadedImageUrl(''); // Reset the image URL on new drop
      handleFileAccepted(acceptedFiles[0]);
    },
    [handleFileAccepted],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
        'image/*': ['.jpeg', '.jpg', '.png']
      }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-dashed border-2 border-gray-300 rounded-lg p-6 text-center cursor-pointer ${isDragActive ? 'bg-gray-100' : 'bg-gray-50'} hover:bg-gray-100 ${className}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-gray-700">Drop the files here ...</p>
      ) : uploaded ? (
        <Image
          src={uploadedImageUrl}
          alt="Uploaded Image"
          width={24}
          height={24}
        />
      ) : (
        <div className="space-y-2">
          <div className="flex justify-center text-blue-600 text-3xl">
            <svg
              width="24px"
              height="24px"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#000000"
            >
              <path
                d="M6 20L18 20"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M12 16V4M12 4L15.5 7.5M12 4L8.5 7.5"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
          <p className="text-sm text-gray-700">
            <strong>Click to upload</strong> or drag and drop
          </p>
          <p className="text-sm text-gray-500">Max. File Size: 10MB</p>
        </div>
      )}
    </div>
  );
}
