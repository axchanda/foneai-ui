/* eslint-disable react/prop-types */
/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import API from 'src/utils/API';
import {
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  MenuList,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { TableHeadCustom, useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import type { IFunctionAction, IFunctionItem, IFunctionParameterType } from 'src/types/function';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import type { IWebhookItem } from 'src/types/webhook';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'checkbox', width: '' },
  { id: 'required', label: 'Required', width: 80 },
  { id: 'name', label: 'Name', width: 220 },
  { id: 'type', label: 'Type', width: 180 },
  { id: 'description', label: 'Description', width: 270 },
  { id: '', width: 88 },
];

export type NewFunctionSchemaType = zod.infer<typeof NewFunctionSchema>;

export const NewFunctionSchema = zod.object({
  functionName: zod.string().min(1, 'Function name is required'),
});

type Props = {
  currentFunction?: IFunctionItem;
  isUsed?: boolean;
};

export function FunctionsNewEditForm({ currentFunction, isUsed }: Props) {
  const router = useRouter();
  const alertDialog = useBoolean();
  const defaultValues = useMemo(
    () => ({
      functionName: currentFunction?.functionName || '',
      functionDescription: currentFunction?.functionDescription || '',
    }),
    [currentFunction]
  );
  const methods = useForm<NewFunctionSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewFunctionSchema),
    //@ts-ignore
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const [parameters, setParameters] = useState<IFunctionItem['parameters']>(
    currentFunction?.parameters || []
  );
  const [loaded, setLoaded] = useState(false);
  const [webhooks, setWebhooks] = useState<IWebhookItem[]>([]);

  const [action, setAction] = useState<IFunctionAction>(
    currentFunction?.functionAction || {
      type: 'hangup',
      data: null,
    }
  );
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

  const getWebhooks = useCallback(async () => {
    const webhookPromise = API.get<{
      webhooks: IWebhookItem[];
      count: number;
    }>('/webhooks');

    const [{ data }] = await Promise.all([webhookPromise]);

    setWebhooks(data.webhooks);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getWebhooks();
  }, [getWebhooks]);

  useEffect(() => {
    if (currentFunction) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentFunction, defaultValues, reset]);

  // values.botLanguage = values.botLanguage || 'en';

  const onSubmit = handleSubmit(async (data) => {
    // console.log(data);
    if (action.type === 'webhook') {
      if (!action.data?.linkedWebhook) {
        setActionErrors({
          ...actionErrors,
          linkedWebhook: 'Webhook is required',
        });
        return;
      }
      if (!action.data?.slug) {
        setActionErrors({
          ...actionErrors,
          slug: 'Slug is required',
        });
        return;
      }
      if (!action.data?.responseInstructions) {
        setActionErrors({
          ...actionErrors,
          responseInstructions: 'Response instructions are required',
        });
        return;
      }
    }
    try {
      const url = currentFunction ? `/functions/${currentFunction._id}` : '/functions/create';
      const method = currentFunction ? API.put : API.post;
      await method(url, {
        functionName: data.functionName,
        // functionDescription: data.functionDescription,
        functionAction: action,
        parameters,
      });
      reset();
      toast.success(currentFunction ? 'Update success!' : 'Create success!');
      router.push('/functions');
    } catch (error) {
      // console.error(error);
      const messages = Object.values(error.response.data.errors || {}) as string[];
      messages.forEach((m: string) => {
        toast.error(m);
      });
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Function name and description" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Function Name</Typography>
          <Field.Text name="functionName" placeholder="Ex: Function 1..." />
        </Stack>

        {/* <Stack spacing={1.5}>
          <Typography variant="subtitle2">Function Description</Typography>
          <Field.Text
            name="functionDescription"
            placeholder="Describe the function..."
            multiline
            rows={4}
          />
        </Stack> */}
      </Stack>
    </Card>
  );

  const renderActions = (
    <Card>
      <CardHeader title="Action" subheader="Function action settings" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <RadioGroup
          value={action.type}
          onChange={(e) => {
            const type = e.target.value as IFunctionAction['type'];
            if (type === 'webhook') {
              setAction({
                data: {
                  linkedWebhook: action.data?.linkedWebhook || '',
                  slug: action.data?.slug || '',
                  responseInstructions: action.data?.responseInstructions || '',
                },
                type,
              });
            } else {
              setAction({
                data: null,
                type,
              });
            }
          }}
          name="action"
        >
          <Stack direction="row">
            <FormControlLabel control={<Radio />} label="Webhook" value="webhook" />
            <FormControlLabel control={<Radio />} label="Transfer" value="transfer" />
            <FormControlLabel control={<Radio />} label="Hangup" value="hangup" />
          </Stack>
        </RadioGroup>
        {action.type === 'webhook' && (
          <Box display="grid" gridTemplateColumns="0.5fr 1fr" gap={4}>
            <Typography alignSelf="center">Webhook</Typography>
            <Field.Select
              error={Boolean(actionErrors.linkedWebhook)}
              key={action.data?.linkedWebhook}
              value={action.data?.linkedWebhook}
              onChange={(e) => {
                setAction((pre) => ({
                  type: 'webhook',
                  data: {
                    linkedWebhook: e.target.value,
                    responseInstructions: pre.data!.responseInstructions,
                    slug: pre.data!.slug,
                  },
                }));
              }}
              capitalize={false}
              name="webhook"
              placeholder="Select webhook"
            >
              {webhooks.map((webhook) => (
                <MenuItem key={webhook._id} value={webhook._id}>
                  {webhook.webhookName}
                </MenuItem>
              ))}
            </Field.Select>

            <Typography alignSelf="center">Slug</Typography>
            <Box
              border="1px solid"
              borderColor="var(--palette-background-neutral)"
              borderRadius="var(--shape-borderRadius)"
              sx={{
                ':hover': {
                  borderColor: 'var(--palette-background-main)',
                },
              }}
              position="relative"
            >
              <Box
                sx={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  borderRadius: 'var(--shape-borderRadius)',
                  padding: '16.5px 14px',
                }}
              >
                <Typography>{action.data?.slug || ''}</Typography>
              </Box>
              <Field.Text
                sx={{
                  opacity: 0,
                }}
                value={action.data?.slug}
                onChange={(e) => {
                  setAction((pre) => ({
                    type: 'webhook',
                    data: {
                      linkedWebhook: pre.data!.linkedWebhook,
                      responseInstructions: pre.data!.responseInstructions,
                      slug: e.target.value,
                    },
                  }));
                }}
                name="slug"
                placeholder="Slug"
                error={Boolean(actionErrors.slug)}
              />
            </Box>

            <Typography alignSelf="center">Response Instructions</Typography>
            <Field.Text
              error={Boolean(actionErrors.responseInstructions)}
              value={action.data?.responseInstructions}
              name="responseInstruction"
              rows={2}
              minRows={2}
              multiline
              placeholder="Instructions to speak the response"
              onChange={(e) => {
                setAction((pre) => ({
                  type: 'webhook',
                  data: {
                    linkedWebhook: pre.data!.linkedWebhook,
                    responseInstructions: e.target.value,
                    slug: pre.data!.slug,
                  },
                }));
              }}
            />
          </Box>
        )}
      </Stack>
    </Card>
  );

  return (
    <>
      {loaded ? (
        <>
          <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: '1100px' }}>
              {renderDetails}

              <ParametersCard parameters={parameters} setParameters={setParameters} />

              {renderActions}

              <Box
                display="flex"
                alignItems="center"
                justifyContent={currentFunction ? 'space-between' : 'end'}
                flexWrap="wrap"
              >
                {currentFunction && (
                  <Button
                    onClick={async () => {
                      // if (isUsed) {
                      //   alertDialog.setValue(true);
                      // } else {
                      //   await deleteBot(currentFunction._id, () => {
                      //     router.push('/bots');
                      //   });
                      // }
                    }}
                    variant="contained"
                    size="large"
                    color="error"
                  >
                    Delete function
                  </Button>
                )}
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                  sx={{ ml: 2 }}
                >
                  {!currentFunction ? 'Create Function' : 'Update Function'}
                </LoadingButton>
              </Box>
            </Stack>
          </Form>
          <ConfirmDialog
            title="Unable to delete bot"
            content="This bot is currently being used in some campaign(s). Please remove it from the linked campaign(s) before deleting."
            open={alertDialog.value}
            action={<></>}
            onClose={() => {
              alertDialog.setValue(false);
            }}
          />
        </>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}

const ParametersCard: React.FC<{
  parameters: IFunctionItem['parameters'];
  setParameters: React.Dispatch<React.SetStateAction<IFunctionItem['parameters']>>;
}> = ({ parameters, setParameters }) => {
  const table = useTable();
  const [parameter, setParameter] = useState<IFunctionParameterType>({
    parameterDescription: '',
    parameterIsRequired: false,
    parameterName: '',
    parameterType: 'string',
  });
  const [parameterErrors, setParameterErrors] = useState<
    Record<keyof IFunctionParameterType, boolean>
  >({
    parameterDescription: false,
    parameterIsRequired: false,
    parameterName: false,
    parameterType: false,
  });

  const shouldShowParameterForm = useBoolean(false);

  // console.log({ parameters });

  return (
    <Card>
      {/* <CardHeader
    title="Function Parameters"
    subheader="Function parameters and settings"
    sx={{ mb: 3 }}
  /> */}
      <Stack p={3} direction="row" alignItems="start" justifyContent="space-between">
        <Stack>
          <Typography variant="h5">Function Parameters</Typography>
          <Typography mt="4px" color="var(--palette-text-secondary)" variant="subtitle2">
            Add parameters to the function. These parameters will be used to pass data to the
            function.
          </Typography>
        </Stack>
        <Button
          onClick={() => {
            shouldShowParameterForm.setValue(true);
          }}
          variant="contained"
        >
          Add New Parameter
        </Button>
      </Stack>

      <Divider />
      <Box p={4}>
        {Boolean(parameters.length) || shouldShowParameterForm.value ? (
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
                  {shouldShowParameterForm.value && (
                    <TableRow>
                      <TableCell
                        sx={{
                          verticalAlign: 'top',
                        }}
                      >
                        <Checkbox
                          value={parameter.parameterIsRequired}
                          onChange={(e) => {
                            //@ts-ignore
                            // console.log(e.target.checked);
                            setParameter((prev) => ({
                              ...prev,
                              //@ts-ignore
                              parameterIsRequired: e.target.checked,
                            }));
                          }}
                          name="required"
                          // label="controlled"
                          size="large"
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: 'top',
                        }}
                      >
                        <Field.Text
                          name="name"
                          value={parameter.parameterName}
                          onChange={(e) => {
                            setParameter((prev) => ({
                              ...prev,
                              parameterName: e.target.value,
                            }));
                          }}
                          placeholder="Parameter name"
                          error={parameterErrors.parameterName}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: 'top',
                        }}
                      >
                        <Field.Select
                          value={parameter.parameterType}
                          onChange={(e) => {
                            setParameter((prev) => ({
                              ...prev,
                              parameterType: e.target.value,
                            }));
                          }}
                          name="type"
                          error={parameterErrors.parameterType}
                        >
                          <MenuItem value="string">String</MenuItem>
                          <MenuItem value="number">Number</MenuItem>
                          <MenuItem value="boolean">Boolean</MenuItem>
                        </Field.Select>
                      </TableCell>
                      <TableCell>
                        <Field.Text
                          value={parameter.parameterDescription}
                          onChange={(e) => {
                            setParameter((prev) => ({
                              ...prev,
                              parameterDescription: e.target.value,
                            }));
                          }}
                          name="description"
                          placeholder="Parameter description"
                          error={parameterErrors.parameterDescription}
                          multiline
                          rows={4}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack gap={2}>
                          <Button
                            variant="contained"
                            onClick={() => {
                              let isError = false;
                              if (
                                !parameter.parameterName ||
                                parameter.parameterName.trim().length < 1
                              ) {
                                setParameterErrors((prev) => ({
                                  ...prev,
                                  parameterName: true,
                                }));
                                isError = true;
                              }
                              if (
                                !parameter.parameterDescription ||
                                parameter.parameterDescription.trim().length < 1
                              ) {
                                setParameterErrors((prev) => ({
                                  ...prev,
                                  parameterDescription: true,
                                }));
                                isError = true;
                              }
                              if (!parameter.parameterType) {
                                setParameterErrors((prev) => ({
                                  ...prev,
                                  parameterType: true,
                                }));
                                isError = true;
                              }

                              if (!isError) {
                                // console.log({ parameter });
                                setParameters((prev) => [...prev, parameter]);
                                setParameter({
                                  parameterDescription: '',
                                  parameterIsRequired: false,
                                  parameterName: '',
                                  parameterType: 'string',
                                });
                                setParameterErrors({
                                  parameterDescription: false,
                                  parameterIsRequired: false,
                                  parameterName: false,
                                  parameterType: false,
                                });
                                shouldShowParameterForm.setValue(false);
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
                              shouldShowParameterForm.setValue(false);
                              setParameter({
                                parameterDescription: '',
                                parameterIsRequired: false,
                                parameterName: '',
                                parameterType: 'string',
                              });
                              setParameterErrors({
                                parameterDescription: false,
                                parameterIsRequired: false,
                                parameterName: false,
                                parameterType: false,
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                  {parameters.map((param, index) => {
                    // console.log(param);
                    return (
                      <ParameterTableRow
                        param={param}
                        key={index}
                        changeIsRequired={(val) => {
                          setParameters((prev) => {
                            const newParams = [...prev];
                            newParams[index].parameterIsRequired = val;
                            return newParams;
                          });
                        }}
                        changeName={(val) => {
                          setParameters((prev) => {
                            const newParams = [...prev];
                            newParams[index].parameterName = val;
                            return newParams;
                          });
                        }}
                        changeType={(val) => {
                          setParameters((prev) => {
                            const newParams = [...prev];
                            newParams[index].parameterType = val;
                            return newParams;
                          });
                        }}
                        changeDescription={(val) => {
                          setParameters((prev) => {
                            const newParams = [...prev];
                            newParams[index].parameterDescription = val;
                            return newParams;
                          });
                        }}
                        removeParameter={() => {
                          setParameters((prev) => prev.filter((_, i) => i !== index));
                        }}
                        updateParameter={(params: IFunctionParameterType) => {
                          // console.log(params);
                          setParameters((prev) => {
                            const newParams = [...prev];
                            newParams[index] = params;
                            return newParams;
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
              No Parameters
            </Typography>
          </Stack>
        )}
      </Box>
    </Card>
  );
};

const ParameterTableRow: React.FC<{
  param: IFunctionParameterType;
  changeIsRequired: (val: boolean) => void;
  changeName: (val: string) => void;
  changeType: (val: string) => void;
  changeDescription: (val: string) => void;
  removeParameter: () => void;
  updateParameter: (params: IFunctionParameterType) => void;
}> = ({
  param,
  changeDescription,
  changeIsRequired,
  changeName,
  changeType,
  removeParameter,
  updateParameter,
}) => {
  const popover = usePopover();
  const editing = useBoolean();
  const [parameter, setParameter] = useState({ ...param });
  const [parameterErrors, setParameterErrors] = useState<
    Record<keyof IFunctionParameterType, boolean>
  >({
    parameterDescription: false,
    parameterIsRequired: false,
    parameterName: false,
    parameterType: false,
  });

  return (
    <>
      <TableRow>
        <TableCell
          sx={{
            verticalAlign: 'top',
          }}
        >
          <Checkbox
            value={parameter.parameterIsRequired}
            checked={parameter.parameterIsRequired}
            onChange={(e) => {
              // changeIsRequired(e.target.checked);
              setParameter({ ...param, parameterIsRequired: e.target.checked });
            }}
            // label=""
            size="large"
            inputProps={{ 'aria-label': 'controlled' }}
            disabled={!editing.value}
          />
        </TableCell>
        <TableCell
          sx={{
            verticalAlign: 'top',
          }}
        >
          <Field.Text
            name="name"
            value={parameter.parameterName}
            onChange={(e) => {
              // changeName(e.target.value);
              setParameter({ ...param, parameterName: e.target.value });
            }}
            placeholder="Function name"
            disabled={!editing.value}
            error={parameterErrors.parameterName}
          />
        </TableCell>
        <TableCell
          sx={{
            verticalAlign: 'top',
          }}
        >
          <Field.Select
            value={parameter.parameterType}
            onChange={(e) => {
              // changeType(e.target.value);
              setParameter({ ...param, parameterType: e.target.value });
            }}
            name="type"
            disabled={!editing.value}
            error={parameterErrors.parameterType}
          >
            <MenuItem value="string">String</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
          </Field.Select>
        </TableCell>
        <TableCell
          sx={{
            verticalAlign: 'top',
          }}
        >
          <Field.Text
            value={parameter.parameterDescription}
            onChange={(e) => {
              // changeDescription(e.target.value);
              setParameter({ ...param, parameterDescription: e.target.value });
            }}
            name="description"
            placeholder="Parameter description"
            disabled={!editing.value}
            error={parameterErrors.parameterDescription}
            multiline
            rows={4}
          />
        </TableCell>
        <TableCell align="right">
          {editing.value ? (
            <Stack gap={2}>
              <Button
                variant="contained"
                onClick={() => {
                  let isError = false;
                  if (!parameter.parameterName || parameter.parameterName.trim().length < 1) {
                    setParameterErrors((prev) => ({
                      ...prev,
                      parameterName: true,
                    }));
                    isError = true;
                  }
                  if (
                    !parameter.parameterDescription ||
                    parameter.parameterDescription.trim().length < 1
                  ) {
                    setParameterErrors((prev) => ({
                      ...prev,
                      parameterDescription: true,
                    }));
                    isError = true;
                  }
                  if (!parameter.parameterType) {
                    setParameterErrors((prev) => ({
                      ...prev,
                      parameterType: true,
                    }));
                    isError = true;
                  }

                  if (!isError) {
                    updateParameter(parameter);

                    setParameterErrors({
                      parameterDescription: false,
                      parameterIsRequired: false,
                      parameterName: false,
                      parameterType: false,
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
                  setParameter({
                    ...param,
                  });
                  setParameterErrors({
                    parameterDescription: false,
                    parameterIsRequired: false,
                    parameterName: false,
                    parameterType: false,
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
              removeParameter();
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
