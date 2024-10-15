/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import { TableHeadCustom, useTable } from 'src/components/table';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Field, Form } from 'src/components/hook-form';
import { Button, CardHeader, Checkbox, Divider, Typography } from '@mui/material';
import { IKnowledgeBaseQaPairType, type IKnowledgeBaseItem } from 'src/types/knowledge-base';
import API from 'src/utils/API';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useDropzone } from 'react-dropzone';
import { RejectionFiles } from 'src/components/upload';
import { UploadPlaceholder } from 'src/components/upload/components/placeholder';
import { KbFilePreview } from 'src/components/knowledge-bases/kb-file-preview';
import axios from 'axios';
import { Scrollbar } from 'src/components/scrollbar';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { IconButton, MenuItem } from '@mui/material';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { MenuList } from '@mui/material';
import { Iconify } from 'src/components/iconify';


const TABLE_HEAD = [
  { id: 'question', label: 'Question', width: 200 },
  { id: 'answer', label: 'Answer', width: 290 },
  { id: '', width: 10  },
];

export type NewKbSchemaType = zod.infer<typeof NewKbSchema>;

export const NewKbSchema = zod.object({
  knowledgeBaseName: zod.string().min(1, { message: 'KnowledgeBase Name is required!' }),
  knowledgeBaseDescription: zod.string(),
  knowledgeBaseQaPairs: zod.array(
    zod.object({
      question: zod.string(),
      answer: zod.string(),
    })
  ),
  knowledgeBaseFiles: zod.array(
    zod.object({
      fileName: zod.string(),
      fileURL: zod.string(),
    })
  ),
});


type Props = {
  currentKb?: IKnowledgeBaseItem;
};

export function KnowledgeBaseNewEditForm({ currentKb }: Props) {
  const router = useRouter();

  const [isNewFileUploaded, setIsNewFileUploaded] = useState(false);

  const [qaPairs, setQaPairs] = useState<IKnowledgeBaseItem['knowledgeBaseQaPairs']>(
    currentKb?.knowledgeBaseQaPairs || []
  );
  
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
    formState: { isSubmitting, errors },
    setError,
  } = methods;

  useEffect(() => {
    if (currentKb) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentKb, defaultValues, reset]);

  const uploadFile = async (file: File, knowledgeBaseName: string, knowledgeBaseId: string) => {
    try {
      // knowledgeBaseId exists only when updating a knowledge base, so check in the backend
      console.log('knowledgeBaseId', knowledgeBaseId);
      const {
        data: { url, key },
      } = await API.post<{
        url: string;
        key: string;
      }>('/knowledgeBases/getUploadLink', {
        fileName: file.name,
        knowledgeBaseName,
        knowledgeBaseId
      });
      console.log('url', url);
      console.log('key', key);
      await axios.put(url, file, {
        headers: { 'Content-Type': 'application/pdf', withCredentials: true },
      });

      const fileURL = `https://foneai-knowledgebase-files.s3.us-east-1.amazonaws.com/${key}`;
      
      toast.success('File uploaded successfully');
      return fileURL;
    } catch (error) {
      // console.error(error);
      const messages = Object.values(error.response.data.errors || {}) as string[];
      messages.forEach((m: string) => {
        toast.error(m);
      });
      toast.error('Failed to upload file');
      throw new Error('Failed to upload file');
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      let fileURL = '';
      let fileName = '';

      if (
        // (currentKb?.knowledgeBaseFiles || []).length <= 0 && files.length <= 0 && // No files
        (currentKb?.knowledgeBaseQaPairs || []).length <= 0 && (qaPairs || []).length <= 0 // No QA Pairs
      ) {
        // setError('knowledgeBaseFiles', { message: 'Upload atleast one file or input a QA Pair' });
        setError('knowledgeBaseQaPairs', { message: 'Input atleast one QA Pair' });
        return; // Exit the submission if the condition is not met
      }

      let creationFlag = false;
      if(!currentKb || currentKb === undefined) {
        // If creating a new knowledge base, create a kb and then updaate the kb with the file, just like how it is done in the updating KB
        const { data: newKb } = await API.post('/knowledgeBases/create', {
          knowledgeBaseName: data.knowledgeBaseName,
          knowledgeBaseDescription: data.knowledgeBaseDescription,
          knowledgeBaseQaPairs: qaPairs
        });

        toast.success('Create knowledge base success!');
        router.push('/knowledge-bases');
        return;
      } else {
        const url = `/knowledgeBases/${currentKb?._id}`;

        // QA Pairs alone are different from the rest of the data, so directly assign it to the knowledgeBaseQaPairs
        await API.put(url, {
          knowledgeBaseName: data.knowledgeBaseName,
          knowledgeBaseDescription: data.knowledgeBaseDescription,
          knowledgeBaseQaPairs: qaPairs,
        });
        reset();
  
        toast.success('Update knowledge base success!');
        router.push('/knowledge-bases');
        return;
        // if there is no file uploaded, then return
      //   if(files.length <= 0) {
      //     toast.success('Create knowledge base success!');
      //     router.push('/knowledge-bases');
      //     return;
      //   } else {
      //     creationFlag = true;
      //     currentKb = newKb;
      //   }
      // }
      

      // if (isNewFileUploaded) {
      //   console.log('Entered isNewFileUploaded');
      //   fileURL = await uploadFile(files[0], data.knowledgeBaseName, currentKb?._id || '');
      //   console.log('fileURL@179', fileURL);
      //   fileName = files[0].name;
      //   console.log('fileName@181', fileName);
      // } else {
      //   fileURL = currentKb!.knowledgeBaseFiles![0].fileURL!;
      //   console.log('fileURL@183', fileURL);
      //   fileName = currentKb!.knowledgeBaseFiles![0].fileName!;
      //   console.log('fileName@186', fileName);
      // }

      // data.knowledgeBaseQaPairs = qaPairs || [];
      console.log('qaPairs', qaPairs);
      console.log('data', data);
      console.log('currentKb@190', currentKb);
    }
    } catch (error) {
      console.error('error', error);
      const messages = Object.values(error.response.data.errors || {}) as string[];
      messages.forEach((m: string) => {
        toast.error(m);
      });
      // console.error(error);
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
      setIsNewFileUploaded(true);
      showDropBox.onFalse();
    },
    [showDropBox]
  );

  const handleEdit = () => {
    if (inputRef.current) {
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
    // console.log('DELETE FILE');
    setFiles([]);
    confirm.onFalse();
  };

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
          <Field.Text fullWidth multiline rows={2} name="knowledgeBaseDescription" />
        </Stack>
      </Stack>
    </Card>
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
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
      return null;
    },
    onDrop: handleDrop,
    maxFiles: 1,
  });

  const renderFiles = (
    <Card>
      <CardHeader title="Files" subheader="Upload PDF files to the knowledge bases" sx={{ mb: 3 }} />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Knowledge Base Files</Typography>
          <>
            <input
              {...getInputProps()}
              ref={inputRef}
              accept="application/pdf"
              style={{ display: 'none' }}
            />
            {fileNames.length <= 0 && (
              <>
                <Box
                  {...getRootProps()}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 300,
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
          <KbFilePreview fileNames={fileNames} thumbnail={false} onEdit={handleEdit} />
          {fileNames.length > 0 && <RejectionFiles files={fileRejections} />}
        </Stack>
      </Stack>
    </Card>
  );

  const QACard: React.FC<{
    qaPairs: IKnowledgeBaseItem['knowledgeBaseQaPairs'];
    setQaPairs: React.Dispatch<React.SetStateAction<IKnowledgeBaseItem['knowledgeBaseQaPairs']>>;
    }> = ({ qaPairs, setQaPairs }) => {
      const table = useTable();
      const [qaPair, setQaPair] = useState<IKnowledgeBaseQaPairType>({
        question: '',
        answer: ''
      });
      const [qaPairErrors, setQaPairErrors] = useState<
        Record<keyof IKnowledgeBaseQaPairType, boolean>
      >({
        question: false,
        answer: false,
      });

      const shouldShowQaPairForm = useBoolean(false);


      return (
        <Card>
          <Stack p={3} direction="row" alignItems="start" justifyContent="space-between">
            <Stack>
              <Typography variant="h6">Q&A Pairs</Typography>
              <Typography mt="4px" color="var(--palette-text-secondary)" variant='body2'>
                Knowledge Base Question and Answer Pairs
              </Typography>
            </Stack>
            <Button
              onClick={() => {
                shouldShowQaPairForm.setValue(true);
              }}
              variant="contained"
            >
              Add New QA Pair
            </Button>
          </Stack>

          <Divider />
          <Box p={4}>
            {Boolean(qaPairs?.length) || shouldShowQaPairForm.value ? (
              <Card>
                <Scrollbar>
                  <Table>
                    <TableHeadCustom
                      order={table.order}
                      orderBy={table.orderBy}
                      headLabel={TABLE_HEAD}
                      numSelected={table.selected.length}
                    />
                    <TableBody>
                      {shouldShowQaPairForm.value && (
                        <TableRow>
                          <TableCell
                            sx={{
                              verticalAlign: 'top',
                            }}
                          >
                            <Field.Text
                              name="question"
                              value={qaPair.question}
                              onChange={(e) => {
                                setQaPair((prev) => ({
                                  ...prev,
                                  question: e.target.value,
                                }));
                              }}
                              placeholder="Question"
                              error={qaPairErrors.question}
                              multiline
                              minRows={2}
                              maxRows={4}
                            />
                          </TableCell>

                          <TableCell
                            sx={{
                              verticalAlign: 'top',
                            }}
                          >
                            <Field.Text
                              name="answer"
                              value={qaPair.answer}
                              onChange={(e) => {
                                setQaPair((prev) => ({
                                  ...prev,
                                  answer: e.target.value,
                                }));
                              }}
                              placeholder="Answer"
                              error={qaPairErrors.answer}
                              multiline
                              minRows={2}
                              maxRows={4}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Stack gap={2}>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  // Reset errors first
                                  setQaPairErrors({
                                    question: false,
                                    answer: false,
                                  });

                                  let isError = false;

                                  // Validation for question
                                  if (!qaPair.question || qaPair.question.trim().length < 1) {
                                    setQaPairErrors((prev) => ({
                                      ...prev,
                                      question: true,
                                    }));
                                    isError = true;
                                  }

                                  // Validation for answer
                                  if (!qaPair.answer || qaPair.answer.trim().length < 1) {
                                    setQaPairErrors((prev) => ({
                                      ...prev,
                                      answer: true,
                                    }));
                                    isError = true;
                                  }

                                  // If no error, add the qaPair to the list
                                  if (!isError) {
                                    setQaPairs((prevQaPairs=[]) => [...prevQaPairs, qaPair]); // Functional update to prevent race condition

                                    // Reset form state
                                    setQaPair({
                                      question: '',
                                      answer: '',
                                    });

                                    // Reset error state
                                    setQaPairErrors({
                                      question: false,
                                      answer: false,
                                    });

                                    // Hide the form
                                    shouldShowQaPairForm.setValue(false);
                                  }
                                }}
                                size="large"
                                color="primary"
                                startIcon={<Iconify icon="ic:round-check" />}
                              >
                                Submit
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Iconify icon="ic:round-close" />}
                                size="large"
                                onClick={() => {
                                  // Reset form and hide the form
                                  setQaPair({
                                    question: '',
                                    answer: '',
                                  });
                                  setQaPairErrors({
                                    question: false,
                                    answer: false,
                                  });
                                  shouldShowQaPairForm.setValue(false);
                                }}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      )}
                      {qaPairs && qaPairs.map((qa, index) => {
                        return (
                          <QaPairTableRow
                            key={index}
                            qaPair={qa}
                            changeQuestion={(val) => {
                              setQaPairs((prevQaPairs=[]) => {
                                const newQaPairs = [...prevQaPairs];
                                newQaPairs[index].question = val;
                                return newQaPairs;
                              });
                            }}
                            changeAnswer={(val) => {
                              setQaPairs((prevQaPairs=[]) => {
                                const newQaPairs = [...prevQaPairs];
                                newQaPairs[index].answer = val;
                                return newQaPairs;
                              });
                            }}
                            removeQaPair={() => {
                              setQaPairs((prevQaPairs=[]) => {
                                const newQaPairs = [...prevQaPairs];
                                newQaPairs.splice(index, 1);
                                return newQaPairs;
                              });
                            }}
                            updateQaPair={(qaPair: IKnowledgeBaseQaPairType) => {
                              setQaPairs((prevQaPairs=[]) => {
                                const newQaPairs = [...prevQaPairs];
                                newQaPairs[index] = qaPair;
                                return newQaPairs;
                              });
                            }}
                          />
                        );
                      })}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </Card>
            ) : (
              <Stack>
                <Typography variant="h5" align="center">
                  No Qa Pairs
                </Typography>
              </Stack>
            )}

            <Typography variant="body2" color="error">
              {errors.knowledgeBaseQaPairs?.message}
            </Typography>
          </Box>

        </Card>
      );
  };

  const QaPairTableRow: React.FC<{
    qaPair: IKnowledgeBaseQaPairType;
    changeQuestion: (val: string) => void;
    changeAnswer: (val: string) => void;
    removeQaPair: () => void;
    updateQaPair: (updatedQaPair: IKnowledgeBaseQaPairType) => void;
    }> = ({
      qaPair,
      changeQuestion,
      changeAnswer,
      removeQaPair,
      updateQaPair,
    }) => {

      const handleUpdate = () => {
        // Update the qaPair with the updated values
        const newQaPair: IKnowledgeBaseQaPairType = { ...qaPair, question: 'new question' };
        updateQaPair(newQaPair); // Use updatedQaPair instead of qaPair to avoid conflicts
      };

      const popover = usePopover();
      const editing = useBoolean();
      const [qaPairState, setQaPairState] = useState({ ...qaPair });
      const [qaPairErrors, setQaPairErrors] = useState<
        Record<keyof IKnowledgeBaseQaPairType, boolean>
      >({
        question: false,
        answer: false,
      });

      return (
        <>
          <TableRow>
            <TableCell
              sx={{
                verticalAlign: 'top',
              }}
            >
              <Field.Text
                name="name"
                value={qaPairState.question}
                onChange={(e) => {
                  console.log('e.target.value', e.target.value);
                  setQaPairState({ ...qaPairState, question: e.target.value });
                }}
                placeholder="Question"
                disabled={!editing.value}
                error={qaPairErrors.question}
                multiline
                minRows={2}
                maxRows={6}
              />
            </TableCell>
            
            <TableCell
              sx={{
                verticalAlign: 'top',
              }}
            >
              <Field.Text
                value={qaPairState.answer}
                onChange={(e) => {
                  setQaPairState({ ...qaPairState, answer: e.target.value });
                }}
                name="answer"
                placeholder="Answer"
                disabled={!editing.value}
                error={qaPairErrors.answer}
                multiline
                minRows={2}
                maxRows={6}
              />
            </TableCell>
            <TableCell align="right">
              {editing.value ? (
                <Stack gap={2}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      let isError = false;
                      if (!qaPairState.question || qaPairState.question.trim().length < 1) {
                        setQaPairErrors((prev) => ({
                          ...prev,
                          question: true,
                        }));
                        isError = true;
                      }
                      if (
                        !qaPairState.answer ||
                        qaPairState.answer.trim().length < 1
                      ) {
                        setQaPairErrors((prev) => ({
                          ...prev,
                          answer: true,
                        }));
                        isError = true;
                      }

                      if (!isError) {
                        updateQaPair(qaPairState);

                        setQaPairErrors({
                          question: false,
                          answer: false
                        });
                        editing.setValue(false);
                      }
                    }}
                    size="large"
                    color="primary"
                    startIcon={<Iconify icon="ic:round-check" />}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Iconify icon="ic:round-close" />}
                    size="large"
                    onClick={() => {
                      editing.setValue(false);
                      setQaPairState({
                        question: qaPairState.question,
                        answer: qaPairState.answer,
                      });
                      setQaPairErrors({
                        question: false,
                        answer: false
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              ) : (
                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
          <CustomPopover
            open={popover.open}
            anchorEl={popover.anchorEl}
            onClose={popover.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
          >
            <MenuList>
              <MenuItem
                onClick={() => {
                  editing.setValue(true);
                  popover.onClose();
                }}
              >
                <Iconify icon="solar:pen-bold" />
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  removeQaPair();
                  popover.onClose();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
                Delete
              </MenuItem>
            </MenuList>
          </CustomPopover>
        </>
      );
  };
  
  const renderCTA = (
    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{
          mr: 2,
          marginLeft: 'auto',
        }}
        onClick={onSubmit}
      >
        {!currentKb ? 'Create Knowledge Base' : 'Update Knowledge Base'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: '1100px' } }}>
        {renderDetails}
        {/* {renderFiles}  */}
        <QACard qaPairs={qaPairs} setQaPairs={setQaPairs} />
        {renderCTA}
      </Stack>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Confirm to delete File"
        content="Are you sure want to delete the file? This action cannot be undone!"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteFile}>
            Delete
          </Button>
        }
      />
    </Form>
  );
}
