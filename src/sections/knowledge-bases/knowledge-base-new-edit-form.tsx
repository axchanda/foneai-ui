/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'src/routes/hooks';
import { toast } from 'src/components/snackbar';
import { Field, Form } from 'src/components/hook-form';
import { CardHeader, Divider, Typography } from '@mui/material';
import { IKnowledgeBaseQaPairType, type IKnowledgeBaseItem } from 'src/types/knowledge-base';
import API from 'src/utils/API';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDropzone } from 'react-dropzone';
import { RejectionFiles } from 'src/components/upload';
import { UploadPlaceholder } from 'src/components/upload/components/placeholder';
import { KbFilePreview } from 'src/components/knowledge-bases/kb-file-preview';

import { Iconify } from 'src/components/iconify';
import { Tabs } from '@mui/material';
import { Tab } from '@mui/material';
import { QaSection } from './qa-section';
import { LoadingScreen } from 'src/components/loading-screen';
import { useTranslate } from 'src/locales';

const icon = (name: string) => (
  <Iconify width={24} icon={name} color="primary" sx={{ flexShrink: 0 }} />
);

const ICONS = {
  files: icon('tabler:files'),
  qa: icon('ic:round-question-answer'),
  scrape: icon('gg:website')
};


export type KbSchemaType = zod.infer<ReturnType<typeof KbSchema>>;


export const KbSchema =  (t: any) => zod
  .object({
    knowledgeBaseName: zod.string().min(1, { message: t('Knowledge Base Name is required!') }),
    knowledgeBaseDescription: zod.string().optional(),
    knowledgeBaseFiles: zod.array(zod.string()).optional(),
    knowledgeBaseQaPairs: zod.array(zod.object({
      question: zod.string().min(1, { message: t('Question is required!') }),
      answer: zod.string().min(1, { message: t('Answer is required!') }),
    })).optional(),
  });

type Props = {
  currentKb?: IKnowledgeBaseItem;
};

export function KnowledgeBaseNewEditForm({ currentKb }: Props) {
  const router = useRouter();
  const {t} = useTranslate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const showDropBox = useBoolean(true);

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };

  const [knowledgeBaseFiles, setKnowledgeBaseFiles] = useState<any[]>([]);

  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  const knowledgeBaseFilesLoaded = useBoolean();

  const [knowledgeBaseQaPairs, setKnowledgeBaseQaPairs] = useState<IKnowledgeBaseQaPairType[]>([]);

  const [qaPairsToDelete, setQaPairsToDelete] = useState<string[]>([]);
  const [qaPairsToUpdate, setQaPairsToUpdate] = useState<IKnowledgeBaseQaPairType[]>([]);
  const [qaPairsToCreate, setQaPairsToCreate] = useState<IKnowledgeBaseQaPairType[]>([]);

  const knowledgeBaseQaPairsLoaded = useBoolean();


  const TABLE_HEAD = [
    { id: 'question', label: t('Question'), width: 200 },
    { id: 'answer', label: t('Answer'), width: 290 },
    { id: '', width: 10  },
  ];
  const defaultValues = useMemo(
    () => ({
      knowledgeBaseName: currentKb?.knowledgeBaseName || '',
      knowledgeBaseDescription: currentKb?.knowledgeBaseDescription || '',
      knowledgeBaseFiles,
      knowledgeBaseQaPairs
    }),
    [currentKb]
  );
  const schema = KbSchema(t);
  const methods = useForm<KbSchemaType>({
    mode: 'all',
    resolver: zodResolver(schema),
    //@ts-ignore
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = methods;

  useEffect(() => {
    if (currentKb) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentKb, defaultValues, reset]);
  
  const getFileNames = useCallback(async () => {
    if (!currentKb || currentKb === undefined) {
      knowledgeBaseFilesLoaded.onTrue();
      return;
    }

    if(knowledgeBaseFiles && knowledgeBaseFiles.length > 0) {
      setKnowledgeBaseFiles(knowledgeBaseFiles);
      knowledgeBaseFilesLoaded.onTrue();
      return;
    }
    if(knowledgeBaseFilesLoaded.value === false) {
      const { data } = await API.get<{
        knowledgeBaseFiles: string[];
      }>(`/knowledgeBaseFilesList/${currentKb?._id}`);

      if (data.knowledgeBaseFiles) {
        // add a field "new" to the fileNames array to differentiate between existing and new knowledgeBaseFiles
        // all the data.knowledgeBaseFiles are existing knowledgeBaseFiles, i.e. the new field is false
        setKnowledgeBaseFiles(data.knowledgeBaseFiles.map((file) => ({ name: file, new: false })));
      }
      knowledgeBaseFilesLoaded.onTrue();
      return;
    }

    setKnowledgeBaseFiles([]);
    knowledgeBaseFilesLoaded.onTrue();

  }, [currentKb]);

  useEffect(() => {
    getFileNames();
  }, [getFileNames]);

  useEffect(() => {
    // get the last update element of the knowledgeBaseFiles array, and discard the rest
    setKnowledgeBaseFiles((prev) => {
      const lastUpdate = prev[prev.length - 1];
      return lastUpdate ? [lastUpdate] : [];
    });
  }, [setKnowledgeBaseFiles]); 

  useEffect(() => {
    setFilesToDelete((prev) => {
      const lastUpdate = prev[prev.length - 1];
      return lastUpdate ? [lastUpdate] : [];
    });
  }, [setFilesToDelete]);

  useEffect(() => {
    setFilesToUpload((prev) => {
      const lastUpdate = prev[prev.length - 1];
      return lastUpdate ? [lastUpdate] : [];
    });
  }, [setFilesToUpload]);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    // console.log('Accepted files:', acceptedFiles);
    setKnowledgeBaseFiles([{
      name: acceptedFiles[0].name,
      new: true,
    }]);
    // TODO: handle multiple knowledgeBaseFiles
    setFilesToUpload([acceptedFiles[0]]);
    showDropBox.onFalse();
  }, [showDropBox]);

  const handleDeleteFile = useCallback((fileName: string | File) => {
    if (!fileName) return;

    // If fileName is an object, extract the name property.
    if (typeof fileName !== 'string') {
      fileName = fileName?.name;
    }

    // Check if the file is new.
    const isFileNew = knowledgeBaseFiles.find((file) => file.name === fileName)?.new || false;
    // console.log('File to delete:', fileName, isFileNew);

    // Call the appropriate delete handler based on the file's status.
    if (isFileNew) {
      setFilesToUpload([]);
      setKnowledgeBaseFiles([]);
    } else {
      setFilesToDelete([fileName]);
      setKnowledgeBaseFiles([]);
    }
  }, [knowledgeBaseFiles]);
    
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },    
    validator: (file) => {
      // file name character limit should be less than 255
      if (file.name.length > 255) {
        return {
          code: 'file-name-too-long',
          message: t('File name should be less than 255 characters!')
        };
      }
      if(knowledgeBaseFiles.find((f) => f.name === file.name)) {
        return {
          code: 'file-already-exists',
          message: t('File already exists!')
        };
      }
      // file size should be less than 2MB
      if (file.size > 2 * 1024 * 1024) {
        return {
          code: 'file-too-large',
          message: t('File size should be less than 2MB!')
        };
      }
      return null;
    },
    onDrop: handleDrop,
    maxFiles: 1,
  });

  // wrong since we need to filter based on index and not on teh question of the qaPair
  const handleQaPairToDelete = (qaPair: any, index: number) => {
    // console.log('Deleting QA pair:', qaPair);
    if (!qaPair._id) {
      // console.log('QA pair is new, removing from QA create list:', qaPair);
      // Remove the item from the list using the index
      setQaPairsToCreate((prev) => prev.filter((_, i) => i !== index));
    } else {
      // console.log('QA pair is existing, adding to delete list:', qaPair);
      // remove from update list if it exists
      setQaPairsToUpdate((prev) => prev.filter((item) => item._id !== qaPair._id));
      setQaPairsToDelete((prev) => [...prev, qaPair._id]);
    }
  };
  
  const handleQaPairToUpdate = (qaPair: any, index: number) => {
    // console.log('Updating QA pair:', qaPair);
    if (!qaPair._id) {
      // Update the item in the list using the index
      setQaPairsToCreate((prev) => 
        prev.map((pair, i) => (i === index ? qaPair : pair))
      );
    } else {
      // Add to update list if it's an existing QA pair
      setQaPairsToUpdate((prev) => {
        // Check if it already exists in the update list to avoid duplicates
        const existingIndex = prev.findIndex((item) => item._id === qaPair._id);
        if (existingIndex !== -1) {
          return prev.map((item, i) => (i === existingIndex ? qaPair : item));
        }
        return [...prev, qaPair];
      });
    }
  };

  const handleQaPairToCreate = (qaPair: any) => {
    // console.log('Creating QA pair:', qaPair);
    if(!qaPair._id) {
      setQaPairsToCreate((prev) => [...prev, qaPair]);
      return;
    }
  }

  // const onSubmit1 = handleSubmit(async (data) => {
  //   console.log('Submitting data:', data);
  //   console.log('Current KB:', currentKb);
  //   console.log('Files to delete:', filesToDelete);
  //   console.log('Files to upload:', filesToUpload);
  //   console.log('QA pairs to delete:', qaPairsToDelete);
  //   console.log('QA pairs to update:', qaPairsToUpdate);
  //   console.log('QA pairs to create:', qaPairsToCreate);
  // });

  const onSubmit = handleSubmit(async (data) => {
    // console.log('Submitting data:', data);
    // console.log('Current KB:', currentKb);
    try {

      if(!currentKb || currentKb === undefined) {
        if(filesToUpload.length <= 0 && qaPairsToCreate.length <= 0) {
          setError('knowledgeBaseFiles', {
            type: 'manual',
            message: 'Please upload at least one file or add at least one QA pair',
          });
          setError('knowledgeBaseQaPairs', {
            type: 'manual',
            message: 'Please upload at least one file or add at least one QA pair',
          });
          throw new Error('Please upload at least one file or add at least one QA pair');
        }
        const { data: newKb } = await API.post('/knowledgeBases/create', {
          knowledgeBaseName: data.knowledgeBaseName,
          knowledgeBaseDescription: data.knowledgeBaseDescription,
          qaPairsToCreate,
          filesToCreate: filesToUpload.length > 0 ? true : false,
          status: 'pending'
        });

        const newKbId = newKb._id;
        if (!newKbId) throw new Error(t('Create failed'));

        if(filesToUpload.length > 0) {
          const { data: signedUrlsData } = await API.post(`/knowledgeBases/generatePreSignedUrls`, {
            knowledgeBaseId: newKbId,
            fileNames: filesToUpload.map((file) => file.name)
          });

          const uploadFilePromises = filesToUpload.map((file, index) =>
            fetch(signedUrlsData.urls[index].url, {
              method: 'PUT',
              body: file,
              headers: {
                'Content-Type': file.type,
              },
            })
          );

          let fileNames: any[] = [];

          try {
            const responses = await Promise.all(uploadFilePromises);
            responses.forEach((response, index) => {
              console.log('Response:', response);
              console.log('Index:', index);

              if (!response.ok) {
                throw new Error(`Failed to upload file ${filesToUpload[index].name}`);
              }
              console.log(filesToUpload[index])
              console.log(filesToUpload[index].name)
              fileNames.push(filesToUpload[index].name);
            })
            await API.put(`/knowledgeBases/${newKbId}/updateCreatedFiles`, {
              fileNames
            });
          } catch (error) {
            console.error('Error uploading files:', error);
            throw new Error(t('Upload failed!'));
          }
        }

        toast.success(t('Upload success!'));
        toast.success('Create success!');
        router.push('/knowledge-bases');
        return;
      } 
      else {
        const { data: nonEmptyKb } = await API.post(`/validateNonEmptyKnowledgeBase/${currentKb._id}`, {
          qaPairsToDelete,
          qaPairsToUpdate,
          qaPairsToCreate,
          filesToDelete,
          filesToCreate: (filesToUpload.length > 0) ? true : false,
        });
        
        if(nonEmptyKb.valid === false) {
          setError('knowledgeBaseFiles', {
            type: 'manual',
            message: t('Please upload at least one file or add at least one QA pair!'),
          });
          setError('knowledgeBaseQaPairs', {
            type: 'manual',
            message: t('Please upload at least one file or add at least one QA pair!'),
          });
          throw new Error(t('Please upload at least one file or add at least one QA pair!'));
        } else {
          // If updating an existing knowledge base, update the kb with the new data
          const { data: updatedKb } = await API.put(`/knowledgeBases/${currentKb._id}`, {
            knowledgeBaseName: data.knowledgeBaseName,
            knowledgeBaseDescription: data.knowledgeBaseDescription,
            qaPairsToDelete,
            qaPairsToUpdate,
            qaPairsToCreate,
            filesToDelete,
            filesToCreate: (filesToUpload.length > 0) ? true : false,
          });

          if (!updatedKb) throw new Error('Failed to update Knowledge Base');
          
          if(filesToUpload.length > 0) {
            const { data: signedUrlsData } = await API.post(`/knowledgeBases/generatePreSignedUrls`, {
              knowledgeBaseId: currentKb._id,
              fileNames: filesToUpload.map((file) => file.name)
            });

            const uploadFilePromises = filesToUpload.map((file, index) =>
              fetch(signedUrlsData.urls[index].url, {
                method: 'PUT',
                body: file,
                headers: {
                  'Content-Type': file.type,
                },
              })
            );

            try {
              const responses = await Promise.all(uploadFilePromises);
              let fileNames: any[] = [];
              responses.forEach((response, index) => {
                if (!response.ok) {
                  // throw new Error(`Failed to upload file ${filesToUpload[index].name}`);
                  throw new Error(t('Upload failed!'));
                }
                fileNames.push(filesToUpload[index].name);
              })
              await API.put(`/knowledgeBases/${currentKb._id}/updateCreatedFiles`, {
                fileNames
              });
            } catch (error) {
              console.error('Error uploading files:', error);
              throw new Error(t('Upload failed!'));
            }
          }
          
          toast.success('Update success!');
          router.push('/knowledge-bases');
          return;
        }
      }
    } catch (error) {
      console.error('error', error);
      // send a error trigger message and set the status to error
      if(error.response) {
        const messages = Object.values(error.response.data.errors || {}) as string[];
        messages.forEach((m: string) => {
          toast.error(m);
        });
      } else {
        console.error(error.message);
        toast.error(error.message);
      }
    }
  });


  const renderDetails = (
    <Card>
      <CardHeader title={t("Details")} subheader={t("Knowledge Base name and description")} sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {t('Knowledge Base Name')}
          </Typography>
          <Field.Text name="knowledgeBaseName" />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {t('Description')}
          </Typography>
          <Field.Text fullWidth multiline rows={3} name="knowledgeBaseDescription" />
        </Stack>
      </Stack>
    </Card>
  );

  const renderCTA = (
    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
      <LoadingButton
        type='submit'
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{
          mr: 2,
          marginLeft: 'auto',
        }}
        // disabled={currentKb?.status === 'pending'}
      >
        {!currentKb ? t('Create') : t('Update')}
      </LoadingButton>
    </Box>
  );

  const renderFiles = <Card>
      <Stack p={3} direction="row" alignItems="start" justifyContent="space-between">
      <Stack>
          <Typography variant="h6">
            {t('Files')}
          </Typography>
          <Typography mt="4px" color="var(--palette-text-secondary)" variant='body2'>
            {t('Upload PDF / DOCX / TXT file upto 2MB')}
          </Typography>
      </Stack>
      {/* <Button
        onClick={() => {
        }}
        variant='contained'
      >
        <Iconify icon="clarity:upload-line" width={18} />
          Upload File
      </Button> */}
      </Stack>
      <Divider />

      <Stack spacing={3} sx={{ p: 3, minH: 250 }}>
        <Stack spacing={1.5}>

          { knowledgeBaseFilesLoaded.value ? (<>
            <>
              <input
                {...getInputProps()}
                ref={inputRef}
                accept="application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,text/plain,.txt"
                style={{ display: 'none' }}
              />
              {knowledgeBaseFiles.length <= 0 && (
                <>
                  <Box
                    {...getRootProps()}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: { xs: 200, md: 125 },
                      border: '1px dashed',
                      // borderColor: isDragActive ? 'primary.main' : 'grey.500',
                      borderColor: errors.knowledgeBaseFiles
                        ? 'error.dark'
                        : isDragActive
                          ? 'primary.main'
                          : 'grey.500',
                      borderRadius: 1,
                      cursor: 'pointer',
                      backgroundColor: isDragReject ? 'error.light' : 'transparent',
                    }}
                  >
                    <UploadPlaceholder />
                  </Box>
                  <Typography variant="body2" color="error">
                    {errors.knowledgeBaseFiles?.message}
                  </Typography>
                  <RejectionFiles files={fileRejections} />{' '}
                </>
              )}
            </>
            <KbFilePreview fileNames={knowledgeBaseFiles.map((file) => file.name)}
              thumbnail={false} onRemove={(fileName) => handleDeleteFile(fileName)} />
            {knowledgeBaseFiles.length > 0 && <RejectionFiles files={fileRejections} />}
            </>
          ) : (
            <Box p={4} height={150}>
              <LoadingScreen />
            </Box>
          )}
        </Stack>
      </Stack> 
    </Card>

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: '1100px' } }}>
        {renderDetails}
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{pl: '18px'}}>
          <Tab icon={ICONS.files} label={t("Files")} />
          <Tab icon={ICONS.qa} label={t("Q&A")} />
        </Tabs>
        <Box>
          {selectedTab === 0 && renderFiles}

          {selectedTab === 1 && <QaSection 
            currentKb={currentKb}
            loaded={knowledgeBaseQaPairsLoaded}
            knowledgeBaseQaPairs={knowledgeBaseQaPairs} 
            setKnowledgeBaseQaPairs={setKnowledgeBaseQaPairs}
            handleQaPairToDelete={handleQaPairToDelete}
            handleQaPairToUpdate={handleQaPairToUpdate}
            handleQaPairToCreate={handleQaPairToCreate}
            errors={errors} />}
        </Box>
        {renderCTA}
      </Stack>
    </Form>
  );
}
