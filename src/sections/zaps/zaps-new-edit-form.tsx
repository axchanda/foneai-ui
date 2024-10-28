/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
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
import { TableHeadCustom, useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import type { IZapAction, IZapItem, IZapParameterItem } from 'src/types/zap';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import type { IApiEndpointItem } from 'src/types/apiEndpoint';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import { IKnowledgeBaseItem } from 'src/types/knowledge-base';
import { I } from '@fullcalendar/core/internal-common';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'checkbox', width: '' },
  { id: 'required', label: 'Required', width: 80 },
  { id: 'name', label: 'Name', width: 220 },
  { id: 'type', label: 'Type', width: 180 },
  { id: 'description', label: 'Description', width: 270 },
  { id: '', width: 88 },
];

export type NewZapSchemaType = zod.infer<typeof NewZapSchema>;

export const NewZapSchema = zod.object({
  zapName: zod.string().min(1, 'Zap name is required'),
});

type Props = {
  currentZap?: IZapItem;
};

export function ZapsNewEditForm({ currentZap }: Props) {
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      zapName: currentZap?.zapName || '',
      zapDescription: currentZap?.zapDescription || '',
    }),
    [currentZap]
  );
  const methods = useForm<NewZapSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewZapSchema),
    //@ts-ignore
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const [parameters, setParameters] = useState<IZapItem['zapParameters']>(
    currentZap?.zapParameters || []
  );
  const [loaded, setLoaded] = useState(false);
  const [apiEndpoints, setApiEndpoints] = useState<IApiEndpointItem[]>([]);
  const [kbs, setKbs] = useState<IKnowledgeBaseItem[]>([]);
  const [action, setAction] = useState<IZapAction>(
    currentZap?.zapAction || {
      type: 'hangup',
      data: null
    }
  );

  const [payloadJsonData, setPayloadJsonData] = useState<any>(() => {
    if (action.type === 'apiEndpoint') {
      return action.data.payloadData || JSON.parse('{}');
    }
    return JSON.parse('{}');
  });
  
  const jsonEditorRef = useRef<any>(null);

  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

  const getApiEndpoints = useCallback(async () => {
    const apiEndpointPromise = API.get<{
      apiEndpoints: IApiEndpointItem[];
      count: number;
    }>('/apiEndpoints');
  
    const { data } = await apiEndpointPromise;
    setApiEndpoints(data.apiEndpoints);
  }, []);
  
  const getKbs = useCallback(async () => {
    const kbsPromise = API.get<{
      knowledgeBases: IKnowledgeBaseItem[];
      count: number;
    }>('/knowledgeBases');
  
    const { data } = await kbsPromise;
    setKbs(data.knowledgeBases);
  }, []);

  const processInputToJSX = (input: string, highlightVariables: string[]) => {
    const regex = /\{[^{}]*\}/g;

    const parts = input.split(regex);

    const matches = input.match(regex) || [];

    const combined: any[] = [];
    let matchIndex = 0;

    parts.forEach((part, index) => {
      if (part) {
        combined.push(<span key={`text-${index}`}>{part}</span>);
      }
      if (matchIndex < matches.length) {
        const variableName = matches[matchIndex].slice(1, -1); // Remove the braces

        const matchedParameter = highlightVariables.includes(variableName); 

        if (matchedParameter) {
          combined.push(
            <span className="header-variable" key={`variable-${index}`}>
              {matches[matchIndex]} {/* Display the matched variable */}
            </span>
          );
        } else {
          combined.push(
            <span className="header-variable-not-found" key={`variable-${index}`}>
              {matches[matchIndex]} {/* Or handle non-matched variable differently */}
            </span>
          );
        }

        matchIndex++;
      }
    });
    return <>{combined}</>;
  };

  const processResponseInstructionsToJSX = (input: string) => {
    // Regex to match {RESPONSE} or {RESPONSE.property} but not {RESPONSE1} or {RESPONSES.property}
    const regex = /\{RESPONSE(?:\.\w+|\[\d+\])*\}/g;
  
    const parts = input.split(regex);
    const matches = input.match(regex) || [];
  
    const combined: JSX.Element[] = [];
    let matchIndex = 0;
  
    parts.forEach((part, index) => {
      if (part) {
        combined.push(<span key={`text-${index}`}>{part}</span>);
      }
  
      if (matchIndex < matches.length) {
        combined.push(
          <span className="header-variable" key={`variable-${matchIndex}`}>
            {matches[matchIndex]} {/* Display the matched variable */}
          </span>
        );
        matchIndex++;
      }
    });
  
    return <>{combined}</>;
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([getApiEndpoints(), getKbs()]);
      setLoaded(true); // Only setLoaded(true) once both promises are fulfilled
    };
  
    loadData();
  }, [getApiEndpoints, getKbs]);

  useEffect(() => {
    if (currentZap) {
      reset(defaultValues);
    }
  }, [currentZap, defaultValues, reset]);

  useEffect(() => {
    const editorContainer = document.querySelector('.jsoneditor');

    if (!editorContainer) return;

    const targetElements = document.querySelectorAll(
      '.jsoneditor-value.jsoneditor-string:not(.jsoneditor-empty)'
    );
    const regex = /^\{([^{}]+)\}$/;

    targetElements.forEach((el: any) => {
      const textContent = el.textContent?.trim();
      if (!textContent) return;

      const match = regex.exec(textContent);
      if (match) {
        const variableName = match[1];
        const isValidVariable = parameters?.some(param => param.parameterName === variableName);

        if (isValidVariable) {
          el.style.backgroundColor = 'black';
          el.style.color = 'white';
          el.style.fontWeight = 'bold';
          el.style.padding = '2px 4px';
          el.style.borderRadius = '4px';
        } else {
          el.style.color = 'red';
          el.style.padding = '2px 4px';
          el.style.borderRadius = '4px';
        }
      }      
    });

  }, [payloadJsonData, parameters]);

  const ParametersCard: React.FC<{
    parameters: IZapItem['zapParameters'];
    setParameters: React.Dispatch<React.SetStateAction<IZapItem['zapParameters']>>;
    }> = ({ parameters, setParameters }) => {
      const table = useTable();
      const [parameter, setParameter] = useState<IZapParameterItem>({
        parameterDescription: '',
        parameterIsRequired: false,
        parameterName: '',
        parameterType: 'string',
      });
      const [parameterErrors, setParameterErrors] = useState<
        Record<keyof IZapParameterItem, boolean>
      >({
        parameterDescription: false,
        parameterIsRequired: false,
        parameterName: false,
        parameterType: false,
      });

      const shouldShowParameterForm = useBoolean(false);


      return (
        <Card>
          <Stack p={3} direction="row" alignItems="start" justifyContent="space-between">
            <Stack>
              <Typography variant="h6">Zap Parameters</Typography>
              <Typography mt="4px" color="var(--palette-text-secondary)" variant='body2'>
                Add parameters to the zap. These parameters will be used to pass data to the
                zap.
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
          {(parameters && parameters.length > 0) || shouldShowParameterForm.value ? (
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
                              minRows={4}
                              maxRows={4}
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
                                    setParameters((prev) => [...(prev ?? []), parameter]);
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
                      {(parameters || []).map((param, index) => {
                        return (
                          <ParameterTableRow
                            param={param}
                            key={index}
                            changeIsRequired={(val) => {
                              setParameters((prev) => {
                                const newParams = [...(prev ?? [])];
                                newParams[index].parameterIsRequired = val;
                                return newParams;
                              });
                            }}
                            changeName={(val) => {
                              setParameters((prev) => {
                                const newParams = [...(prev ?? [])];
                                newParams[index].parameterName = val;
                                return newParams;
                              });
                            }}
                            changeType={(val) => {
                              setParameters((prev) => {
                                const newParams = [...(prev ?? [])];
                                newParams[index].parameterType = val;
                                return newParams;
                              });
                            }}
                            changeDescription={(val) => {
                              setParameters((prev) => {
                                const newParams = [...(prev ?? [])];
                                newParams[index].parameterDescription = val;
                                return newParams;
                              });
                            }}
                            removeParameter={() => {
                              setParameters((prev) => (prev ?? []).filter((_, i) => i !== index));
                            }}
                            updateParameter={(params: IZapParameterItem) => {
                              // console.log(params);
                              setParameters((prev) => {
                                const newParams = [...(prev ?? [])];
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
    param: IZapParameterItem;
    changeIsRequired: (val: boolean) => void;
    changeName: (val: string) => void;
    changeType: (val: string) => void;
    changeDescription: (val: string) => void;
    removeParameter: () => void;
    updateParameter: (params: IZapParameterItem) => void;
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
        Record<keyof IZapParameterItem, boolean>
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
                placeholder="Zap name"
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
                minRows={4}
                maxRows={4}
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

  const onSubmit = handleSubmit(async (data: any) => {
    console.log('Form action data', action.data);


    if (action.type === 'apiEndpoint') {
      console.log('Action data', action.data);
      if (!action.data?.linkedApiEndpoint || action.data?.linkedApiEndpoint.trim().length < 1) {
        console.log(action.data?.linkedApiEndpoint.trim().length);
        setActionErrors((prev) => ({
          ...prev,
          linkedApiEndpoint: 'ApiEndpoint is required',
        }));
        return;
      }
    }

    if (action.type === 'knowledgeBase') {
      if (!action.data?.linkedKnowledgeBase || action.data?.linkedKnowledgeBase.trim().length < 1) {
        setActionErrors((prev) => ({
          ...prev,
          linkedKnowledgeBase: 'KnowledgeBase is required',
        }));
        return;
      }
    }
    
    try {
      const url = currentZap ? `/zaps/${currentZap._id}` : '/zaps/create';
      const method = currentZap ? API.put : API.post;
      await method(url, {
        zapName: data.zapName,
        zapDescription: data?.zapDescription,
        zapAction: action,
        zapParameters: parameters,
      });
      reset();
      toast.success(currentZap ? 'Update success!' : 'Create success!');
      router.push('/zaps');
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
      <CardHeader title="Details" subheader="Zap name and description" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Zap Name</Typography>
          <Field.Text name="zapName" placeholder="Name your zap" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Zap Description</Typography>
          <Field.Text name="zapDescription" placeholder="Describe your zap..."
            multiline
            minRows={4}
            maxRows={4}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Card>
      <CardHeader title="Action" subheader="Zap action settings" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <RadioGroup
          value={action.type}
          onChange={(e) => {
            const type = e.target.value as IZapAction['type'];
            if (type === 'apiEndpoint') {
              setAction({
                data: {
                  linkedApiEndpoint: action.data && action.type === 'apiEndpoint' ? action.data.linkedApiEndpoint : '',
                  path: action.data && action.type === 'apiEndpoint' ? action.data.path : '',
                  responseInstructions: action.data && action.type === 'apiEndpoint' ? action.data.responseInstructions : '',
                  payloadData: action.data && action.type === 'apiEndpoint' ? action.data.payloadData : JSON.parse('{}'),
                },
                type,
              });
            } else if (type === 'knowledgeBase') {
              setAction({
                data: {
                  linkedKnowledgeBase: action.data && action.type === 'knowledgeBase' ? action.data.linkedKnowledgeBase : '',
                  responseInstructions: action.data && action.type === 'knowledgeBase' ? action.data.responseInstructions : '',
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
            <FormControlLabel control={<Radio />} label="Search through a Knowledge base" value="knowledgeBase" />
            <FormControlLabel control={<Radio />} label="Call an API Endpoint" value="apiEndpoint" />
            {/* <FormControlLabel control={<Radio />} label="Transfer" value="transfer" /> */}
            <FormControlLabel control={<Radio />} label="Hangup the call" value="hangup" />
          </Stack>
        </RadioGroup>
        {action.type === 'apiEndpoint' && (
          <Box display="grid" gridTemplateColumns="0.5fr 1fr" gap={4}>
            <Typography alignSelf="center">API Endpoint</Typography>
            <Box>
              <Field.Select
                error={Boolean(actionErrors.linkedApiEndpoint)}
                key={action.data?.linkedApiEndpoint}
                value={action.data?.linkedApiEndpoint}
                onChange={(e) => {
                  setAction((pre) => ({
                    type: 'apiEndpoint',
                    data: {
                      linkedApiEndpoint: e.target.value,
                      responseInstructions: pre.data && pre.type === 'apiEndpoint' ? pre.data.responseInstructions : '',
                      path: pre.data && pre.type === 'apiEndpoint' ? pre.data.path : '',
                      payloadData: pre.data && pre.type === 'apiEndpoint' ? pre.data.payloadData : JSON.parse('{}'),
                    },
                  }));
                  setActionErrors((prev) => ({
                    ...prev,
                    linkedApiEndpoint: '',
                  }));
                }}
                capitalize={false}
                name="apiEndpoint"
                placeholder="Select apiEndpoint"
              >
                {apiEndpoints.map((apiEndpoint) => (
                  <MenuItem key={apiEndpoint._id} value={apiEndpoint._id}>
                    {apiEndpoint.apiEndpointName}
                  </MenuItem>
                ))}
              </Field.Select>
              {actionErrors.linkedApiEndpoint && (
                <Typography variant="caption" color="error" mt={1}>
                  {actionErrors.linkedApiEndpoint}
                </Typography>
              )}
            </Box>

            <Typography alignSelf="center">Additional Path</Typography>
            <Box
              border="1px solid"
              borderColor={
                actionErrors.path
                  ? 'var(--palette-error-main)'
                  : 'var(--palette-background-neutral)'
              }
              borderRadius="var(--shape-borderRadius)"
              sx={{
                ':hover': {
                  borderColor: actionErrors.path
                    ? 'var(--palette-error-main)'
                    : 'var(--palette-background-main)',
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
                <Typography>
                  {
                    processInputToJSX(
                      action.data?.path || '', 
                      parameters ? parameters.map((param) => param.parameterName) : []
                    ).props.children}
                </Typography>
              </Box>
              <Field.Text
                sx={{
                  opacity: 0,
                }}
                value={action.data?.path}
                onChange={(e) => {
                  setAction((pre) => ({
                    type: 'apiEndpoint',
                    data: {
                      linkedApiEndpoint: pre.data && pre.type === 'apiEndpoint' ? pre.data.linkedApiEndpoint : '',
                      responseInstructions: pre.data && pre.type === 'apiEndpoint' ? pre.data.responseInstructions : '',
                      path: e.target.value,
                      payloadData: pre.data && pre.type === 'apiEndpoint' ? pre.data.payloadData : JSON.parse('{}')
                    },
                  }));
                }}
                name="path"
                error={Boolean(actionErrors.path)}
              />
            </Box>

            
            <Typography alignSelf="center">Request JSON Body</Typography>
            <Box>
              <Editor 
                  ref={jsonEditorRef}
                  value={payloadJsonData} 
                  onChange={(updatedJson: any) => {
                    console.log('Updated JSON', updatedJson);
                    setPayloadJsonData(updatedJson);
                    setAction((pre) => ({
                      type: 'apiEndpoint',
                      data: {
                        linkedApiEndpoint: pre.data && pre.type === 'apiEndpoint' ? pre.data.linkedApiEndpoint : '',
                        responseInstructions: pre.data && pre.type === 'apiEndpoint' ? pre.data.responseInstructions : '',
                        path: pre.data && pre.type === 'apiEndpoint' ? pre.data.path || '' : '', // Ensure this is a string
                        payloadData: updatedJson,
                      },
                    }));
                    
                  }}
              />
              {actionErrors.payloadData && (
                <Typography variant="caption" color="error" mt={1}>
                  {actionErrors.payloadData}
                </Typography>
              )}
            </Box>
            
            <Typography alignSelf="center">Response Instructions</Typography>
            <Box
              border="1px solid"
              borderColor={
                actionErrors.responseInstructions
                  ? 'var(--palette-error-main)'
                  : 'var(--palette-background-neutral)'
              }
              borderRadius="var(--shape-borderRadius)"
              sx={{
                ':hover': {
                  borderColor: actionErrors.responseInstructions
                    ? 'var(--palette-error-main)'
                    : 'var(--palette-background-main)',
                },
                height: '125px', // Set height to accommodate more rows
                overflowY: 'auto', // Optional: allows scrolling if content exceeds height
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
                <Typography>
                  {
                    processResponseInstructionsToJSX(
                      action.data?.responseInstructions || ''  
                    ).props.children}
                </Typography>
              </Box>
              <Field.Text
                rows={4}
                sx={{
                  opacity: 0,
                }}
                value={action.data?.responseInstructions}
                onChange={(e) => {
                  setAction((pre) => ({
                    type: 'apiEndpoint',
                    data: {
                      linkedApiEndpoint: pre.data && pre.type === 'apiEndpoint' ? pre.data.linkedApiEndpoint : '',
                      responseInstructions: e.target.value,
                      path: pre.data && pre.type === 'apiEndpoint' ? pre.data.path || '' : '', // Ensure this is a string
                      payloadData: pre.data && pre.type === 'apiEndpoint' ? pre.data.payloadData : JSON.parse('{}'),
                    },
                  }));                  
                }}
                name="Response Instructions"
                error={Boolean(actionErrors.responseInstructions)}
              />
            </Box>
          </Box>
        )}

        {action.type === 'knowledgeBase' && (
          <Box display="grid" gridTemplateColumns="0.5fr 1fr" gap={4}>
            <Typography alignSelf="center">Knowledge Base</Typography>
            <Box>
              <Field.Select
                error={Boolean(actionErrors.linkedKnowledgeBase)}
                key={action.data?.linkedKnowledgeBase}
                value={action.data?.linkedKnowledgeBase}
                onChange={(e) => {
                  setAction((pre) => ({
                    type: 'knowledgeBase',
                    data: {
                      linkedKnowledgeBase: e.target.value,
                      responseInstructions: pre.data && pre.type === 'knowledgeBase' ? pre.data.responseInstructions : '',
                    },
                  }));
                  setActionErrors((prev) => ({
                    ...prev,
                    linkedKnowledgeBase: '',
                  }));
                }}
                capitalize={false}
                name="knowledgeBase"
                placeholder="Select a knowledge base"
              >
                {kbs.map((kb) => (
                  <MenuItem key={kb._id} value={kb._id}>
                    {kb.knowledgeBaseName}
                  </MenuItem>
                ))}
              </Field.Select>
              {actionErrors.linkedKnowledgeBase && (
                <Typography variant="caption" color="error" mt={1}>
                  {actionErrors.linkedKnowledgeBase}
                </Typography>
              )}
            </Box>

            <Typography alignSelf="center">Response Instructions</Typography>
            <Box
              border="1px solid"
              borderColor={
                actionErrors.responseInstructions
                  ? 'var(--palette-error-main)'
                  : 'var(--palette-background-neutral)'
              }
              borderRadius="var(--shape-borderRadius)"
              sx={{
                ':hover': {
                  borderColor: actionErrors.responseInstructions
                    ? 'var(--palette-error-main)'
                    : 'var(--palette-background-main)',
                },
                height: '125px', // Set height to accommodate more rows
                overflowY: 'auto', // Optional: allows scrolling if content exceeds height
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
                <Typography>
                  {
                    processResponseInstructionsToJSX(
                      action.data?.responseInstructions || ''  
                    ).props.children}
                </Typography>
              </Box>
              <Field.Text
                rows={4}
                sx={{
                  opacity: 0,
                }}
                value={action.data?.responseInstructions}
                onChange={(e) => {
                  setAction((pre) => ({
                    type: 'knowledgeBase',
                    data: {
                      linkedKnowledgeBase: pre.data && pre.type === 'knowledgeBase' ? pre.data.linkedKnowledgeBase : '',
                      responseInstructions: e.target.value
                    },
                  }));
                }}
                name="Response Instructions"
                error={Boolean(actionErrors.responseInstructions)}
              />
            </Box>
          </Box>
        )}
      </Stack>
    </Card>
  );

  const renderCTA = (
    <Box
      display="flex"
      alignItems="center"
      justifyContent='end'
      flexWrap="wrap"
    >
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!currentZap ? 'Create Zap' : 'Update Zap'}
      </LoadingButton>
    </Box>
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
              {renderCTA}
            </Stack>
          </Form>
        </>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
}