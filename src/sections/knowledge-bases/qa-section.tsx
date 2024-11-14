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
import { LoadingScreen } from 'src/components/loading-screen';
import { set } from 'nprogress';

const TABLE_HEAD = [
  { id: 'question', label: 'Question', width: 200 },
  { id: 'answer', label: 'Answer', width: 290 },
  { id: '', width: 10  },
];

type Props = {
  currentKb?: IKnowledgeBaseItem;
  errors?: any;
  knowledgeBaseQaPairs?: any[];
  setKnowledgeBaseQaPairs: (qaPairs: any[]) => void;
  handleQaPairToDelete: (qaPair: any, index: number) => void;
  handleQaPairToUpdate: (qaPair: any, index: number) => void;
  handleQaPairToCreate: (qaPair: any) => void;
  loaded: any;
};

export function QaSection({ 
  currentKb, 
  knowledgeBaseQaPairs = [], 
  setKnowledgeBaseQaPairs, 
  loaded, 
  errors,
  handleQaPairToDelete,
  handleQaPairToUpdate,
  handleQaPairToCreate
}: Props) {
   
    const [qaPairs, setQaPairs] = useState<any[]>(knowledgeBaseQaPairs);

    const table = useTable();
    const [qaPair, setQaPair] = useState<IKnowledgeBaseQaPairType>({
      question: '',
      answer: ''
    });

    const [qaPairErrors, setQaPairErrors] = useState<
      Partial<Record<keyof IKnowledgeBaseQaPairType, boolean | undefined>>
    >({
      _id: undefined,
      question: false,
      answer: false,
    });

    const shouldShowQaPairForm = useBoolean(false);

    const getQaPairs = useCallback(async () => {
      if (!currentKb || currentKb === undefined) {
        loaded.onTrue();
        return;
      }

      if(knowledgeBaseQaPairs && knowledgeBaseQaPairs.length) {
        setQaPairs(knowledgeBaseQaPairs);
        loaded.onTrue();
        return;
      }

      if(loaded.value === false) {
        const { data } = await API.get<{
          qaPairs: IKnowledgeBaseQaPairType[];
        }>(`/knowledgeBaseQaPairs/${currentKb?._id}`);
        if(data.qaPairs) {
          setQaPairs(data.qaPairs);
        }
        loaded.onTrue();
        return;
      }

      loaded.onTrue();

    }, []);

    useEffect(() => {
      getQaPairs();
    }, [getQaPairs]);

    useEffect(() => {
      setKnowledgeBaseQaPairs(qaPairs);
    }, [setQaPairs, qaPairs]);

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
        {loaded.value ?
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

                                      setQaPairs((prevQaPairs=[]) => [
                                        ...prevQaPairs, 
                                        qaPair
                                      ]); // Functional update to prevent race condition

                                      handleQaPairToCreate(qaPair);
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
                        {qaPairs && qaPairs.map((qaPair, index) => (
                          <QaPairTableRow
                            key={qaPair._id || index} // Prefer using a unique key like `_id` if available
                            qaPair={qaPair}

                            changeQuestion={(val) => {
                              setQaPairs((prevQaPairs = []) => {
                                return prevQaPairs.map((pair, i) => (
                                  i === index ? { ...pair, question: val } : pair
                                ));
                              });
                            }}

                            changeAnswer={(val) => {
                              setQaPairs((prevQaPairs = []) => {
                                return prevQaPairs.map((pair, i) => (
                                  i === index ? { ...pair, answer: val } : pair
                                ));
                              });
                            }}

                            removeQaPair={() => {
                              setQaPairs((prevQaPairs = []) => {
                                console.log('Previous QA Pairs:', prevQaPairs);
                                console.log('Index to delete:', index);
                                console.log('QA Pair to delete:', qaPair);

                                // Call handleQaPairToDelete with the current QA pair and index
                                handleQaPairToDelete(qaPair, index);

                                // Safely create a new array without the item at the specified index
                                const newQaPairs = prevQaPairs.filter((_, i) => i !== index);
                                console.log('Updated QA Pairs after delete:', newQaPairs);
                                return newQaPairs;
                              });
                            }}

                            updateQaPair={(updatedQaPair) => {
                              setQaPairs((prevQaPairs = []) => {
                                return prevQaPairs.map((pair, i) => (
                                  i === index ? updatedQaPair : pair
                                ));
                              });

                              // Handle update outside the state function
                              handleQaPairToUpdate(updatedQaPair, index);
                            }}
                          />
                        ))}

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
                {errors?.knowledgeBaseQaPairs?.message}
            </Typography>
          </Box> :
          <Box p={4} height={200}>
            <LoadingScreen />
          </Box>
        }

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

      const popover = usePopover();
      const editing = useBoolean();
      const [qaPairState, setQaPairState] = useState({ ...qaPair });
      const [qaPairErrors, setQaPairErrors] = useState<
      Partial<Record<keyof IKnowledgeBaseQaPairType, boolean | undefined>>
      >({
        _id: undefined,
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