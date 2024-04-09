'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFileToBucket } from '../_lib/actions';

export function FileUpload({ className, userId, bucketId }) {
  const handleFileAccepted = (file) => {
    // Handle the file, e.g., setting it to state or uploading it
    console.log('handleFileAccepted', file);
    uploadFileToBucket(bucketId, userId, file)
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the files
      handleFileAccepted(acceptedFiles[0]);
    },
    [handleFileAccepted],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-dashed border-2 border-gray-300 rounded-lg p-6 text-center cursor-pointer ${isDragActive ? 'bg-gray-100' : 'bg-gray-50'} hover:bg-gray-100 ${className}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-gray-700">Drop the files here ...</p>
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
          <p className="text-sm text-gray-700"><strong>Click to upload</strong> or drag and drop</p>
          <p className="text-sm text-gray-500">Max. File Size: 10MB</p>
        </div>
      )}
    </div>
  );
}
