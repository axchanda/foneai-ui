import type { DropzoneOptions } from 'react-dropzone';
import type { Theme, SxProps } from '@mui/material/styles';

import type { FileThumbnailProps } from '../file-thumbnail';
import React from 'react';

// ----------------------------------------------------------------------

export type FileUploadType = File | string | null;

export type FilesUploadType = (File | string)[];

export type SingleFilePreviewProps = {
  file: File | string;
};

export type MultiFilePreviewProps = {
  files: FilesUploadType;
  sx?: SxProps<Theme>;
  lastNode?: React.ReactNode;
  firstNode?: React.ReactNode;
  onEdit?: UploadProps['onEdit'];
  onRemove?: UploadProps['onRemove'];
  thumbnail: UploadProps['thumbnail'];
  slotProps?: {
    thumbnail?: Omit<FileThumbnailProps, 'file'>;
  };
};


export type MultiFileNamesPreviewProps = {
  fileNames: string[];
  sx?: SxProps<Theme>;
  lastNode?: React.ReactNode;
  firstNode?: React.ReactNode;
  onEdit?: UploadProps['onEdit'];
  onRemove?: UploadProps['onRemove'];
  thumbnail: UploadProps['thumbnail'];
  slotProps?: {
    thumbnail?: Omit<FileThumbnailProps, 'file'>;
  };
};

export type UploadProps = DropzoneOptions & {
  error?: boolean;
  sx?: SxProps<Theme>;
  thumbnail?: boolean;
  onDelete?: () => void;
  onUpload?: () => void;
  // make the file to be optional
  onEdit?: (file?: File | string) => void;
  onRemoveAll?: () => void;
  helperText?: React.ReactNode;
  placeholder?: React.ReactNode;
  value?: FileUploadType | FilesUploadType;
  setValue?: React.Dispatch<React.SetStateAction<File[]>>
  onRemove?: (file: File | string) => void;
};
