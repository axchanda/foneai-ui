import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../iconify';
import { UploadPlaceholder } from './components/placeholder';
import { RejectionFiles } from './components/rejection-files';
import { MultiFilePreview } from './components/preview-multi-file';
import { DeleteButton, SingleFilePreview } from './components/preview-single-file';

import type { UploadProps } from './types';
import { useEffect, useRef, useState } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export function UploadSinglePDF({
  sx,
  value,
  setValue,
  error,
  disabled,
  onDelete,
  onUpload,
  onEdit,
  thumbnail,
  helperText,
  onRemoveAll,
  multiple = false,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const isArray = Array.isArray(value) && multiple;

  const hasFile = !isArray && !!value;

  const hasFiles = isArray && !!value.length;

  const hasError = isDragReject || !!error;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [showBox, setShowBox] = useState('block');

  const [fileDisplayNames, setFileDisplayNames] = useState<string[]>([]);

  const showDropBox = useBoolean(false);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if(value) {
      console.log(value);
      // let updateValue = value.slice(-1)
      // console.log(updateValue);
    }
  }, [value]);

  const handleEditLocally = () => {
    if(inputRef.current) {
      inputRef.current?.click();
    } else {
      console.log('inputRef.current is null')
    }
  }

  const renderMultiPreview = hasFiles && (
    <>
      <MultiFilePreview files={value} thumbnail={thumbnail} onEdit={handleEditLocally} sx={{ my: 3 }} />
    </>
  );

  const renderFileInput = ( 
    <>
      <input {...getInputProps()}
        ref={inputRef}
        accept="application/pdf"
        style={{ display: 'none' }}
      />  
      {!hasFiles && <>
        <Box
          {...getRootProps()}
          sx={{
            p: 5,
            outline: 'none',
            borderRadius: 1,
            cursor: 'pointer',
            display: showBox,
            overflow: 'hidden',
            position: 'relative',
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            border: (theme) => `1px dashed ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
            transition: (theme) => theme.transitions.create(['opacity', 'padding']),
            '&:hover': { opacity: 0.72 },
            ...(isDragActive && { opacity: 0.72 }),
            ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
            ...(hasError && {
              color: 'error.main',
              borderColor: 'error.main',
              bgcolor: (theme) => varAlpha(theme.vars.palette.error.mainChannel, 0.08),
            }),
            ...(hasFile && { padding: '28% 0' }),
          }}
        >
          {/* Single file */}
          {hasFile ? <SingleFilePreview file={value as File} /> : <UploadPlaceholder />}
        </Box>

        {/* Single file */}
        {hasFile && <DeleteButton onClick={onDelete} />}

        {helperText && (
          <FormHelperText error={!!error} sx={{ px: 2 }}>
            {helperText}
          </FormHelperText>
        )}

        <RejectionFiles files={fileRejections} />
      </>}
    </>
  )

  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <Stack spacing={2}>
        {renderFileInput}
        {renderMultiPreview}
      </Stack>
    </Box>
  );
}
