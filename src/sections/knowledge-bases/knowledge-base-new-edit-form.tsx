/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { varAlpha } from 'src/theme/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Field, Form } from 'src/components/hook-form';
import { Button, CardHeader, Divider, MenuItem, Typography } from '@mui/material';
import type { IKnowledgeBaseItem, IKnowledgeBaseFilters } from 'src/types/knowledge-base';
import API from 'src/utils/API';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { UploadSinglePDF } from 'src/components/upload/upload-single-pdf';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { knowledgeBasesRoutes } from 'src/routes/sections/knowledge-base';
import { cu } from '@fullcalendar/core/internal-common';
import { useDropzone } from 'react-dropzone';
import { MultiFilePreview, RejectionFiles, SingleFilePreview } from 'src/components/upload';
import { UploadPlaceholder } from 'src/components/upload/components/placeholder';
import { KbFilePreview } from 'src/components/knowledge-bases/kb-file-preview';
import { set } from 'nprogress';

export type NewKbSchemaType = zod.infer<typeof NewKbSchema>;

export const NewKbSchema = zod.object({
  knowledgeBaseName: zod.string().min(1, { message: 'KnowledgeBase Name is required!' }),
  knowledgeBaseDescription: zod.string(),
  knowledgeBaseQaPairs: zod.array(zod.object({
    question: zod.string(),
    answer: zod.string(),
  })),
  knowledgeBaseFiles: zod.array(zod.object({
    fileName: zod.string(),
    fileURL: zod.string(),

  }))
});

type Props = {
  currentKb?: IKnowledgeBaseItem;
};

export function KnowledgeBaseNewEditForm({ currentKb }: Props) {
  const router = useRouter();

  console.log(currentKb?.knowledgeBaseFiles)

  const confirm = useBoolean();
  const defaultValues = useMemo(
    () => ({
      knowledgeBaseName: currentKb?.knowledgeBaseName || '',
      knowledgeBaseDescription: currentKb?.knowledgeBaseDescription || '',
      knowledgeBaseQaPairs: currentKb?.knowledgeBaseQaPairs || [],
      knowledgeBaseFiles: currentKb?.knowledgeBaseFiles || [],
    }),
    [currentKb]
  );

  const methods = useForm<NewKbSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewKbSchema),
    //@ts-ignore
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentKb) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentKb, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const url = currentKb ? `/webhooks/${currentKb._id}` : '/webhooks/create';
      const method = currentKb ? API.put : API.post;
      await method(url, {
        knowledgeBaseName: data.knowledgeBaseName,
        knowledgeBaseDescription: data.knowledgeBaseDescription,
        knowledgeBaseQaPairs: data.knowledgeBaseQaPairs,
        knowledgeBaseFiles: data.knowledgeBaseFiles,
      });
      reset();
      toast.success(currentKb ? 'Update Webhook success!' : 'Create Webhook success!');
      router.push('/webhooks');
    } catch (error) {
      console.error(error);
    }
  });

  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const showDropBox = useBoolean(true);
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      // setFiles([...files, ...acceptedFiles]);
      setFiles(acceptedFiles);
      showDropBox.onFalse();
    },
    [files]
  );

  const handleEdit = () => {

    if(inputRef.current) {
      inputRef.current.click();
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      const names = files.map((file) => file.name);
      setFileNames(names);
    }
  }, [files]);

  useEffect(() => {
    if (currentKb && currentKb.knowledgeBaseFiles && currentKb.knowledgeBaseFiles.length > 0) {
      const names = currentKb.knowledgeBaseFiles.map((file) => file.fileName);
      setFileNames(names);
    }
  }, [currentKb]);

  const handleDeleteFile = () => {
    // TODO: handle multiple files deletion
    // const filtered = files.filter((file) => file !== inputFile);
    // setFiles(filtered);
    console.log('DELETE FILE');
    setFiles([]);
    confirm.onFalse();
  }

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Knowledge Base name and description" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Knowledge Base Name</Typography>
          <Field.Text name="knowledgeBaseName" />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Knowledge Base Description</Typography>
          <Field.Text fullWidth multiline rows={4} name="knowledgeBaseDescription" />
        </Stack>
      </Stack>
    </Card>
  );
 
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    validator: (file) => {
      // file name character limit should be less than 255
      if (file.name.length > 255) {
        return {
          code: 'file-name-too-long',
          message: 'File name should be less than 255 characters',
        };
      }
      // file size should be less than 2MB
      if (file.size > 2 * 1024 * 1024) {
        return {
          code: 'file-too-large',
          message: 'File should be less than 2MB',
        };
      }
      return null
    },
    onDrop: handleDrop,
    maxFiles: 1,
  });
  
  const renderFiles = (
    <Card>
      <CardHeader title="Files" subheader="Knowledge Base name and description" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Knowledge Base Files</Typography>
          <>
            <input {...getInputProps()}
                ref={inputRef}
                accept="application/pdf"
                style={{ display: 'none' }}
              />
            { fileNames.length <= 0 && (<>
              <Box {...getRootProps()}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 300,
                  border: '1px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.500',
                  borderRadius: 1,
                  cursor: 'pointer',
                  backgroundColor: isDragReject ? 'error.light' : 'transparent',
                }}
              >
                <UploadPlaceholder />
              </Box>
              <RejectionFiles files={fileRejections} /> </>) }
          </>
          <KbFilePreview fileNames={fileNames} thumbnail={false} onEdit={handleEdit} />
          { fileNames.length > 0 && (
            <RejectionFiles files={fileRejections} /> ) }
        </Stack>
      </Stack>
    </Card>    
  )


  const renderActions = (
    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ 
          mr: 2,
          // make the button to appear on the right side
          marginLeft: 'auto',
        }}
      >
        {!currentKb ? 'Create Knowledge Base' : 'Update Knowledge Base'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {renderFiles}
        {renderActions}
      </Stack>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Confirm to delete File"
        content={`Are you sure want to delete the file? This action cannot be undone!`}
        action={
          <Button variant="contained" color="error" onClick={handleDeleteFile} >
            Delete
          </Button>
        }
      />
    </Form>
  );
}
