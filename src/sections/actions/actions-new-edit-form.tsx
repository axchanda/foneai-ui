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
import type { IActionOperation, IActionItem, IActionParameterItem } from 'src/types/action';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import type { IApiEndpointItem } from 'src/types/apiEndpoint';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import { IKnowledgeBaseItem } from 'src/types/knowledge-base';
import { I } from '@fullcalendar/core/internal-common';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'checkbox', width: '' },
  { id: 'required', label: 'Required', width: 80 },
  { id: 'name', label: 'Name', width: 220 },
  { id: 'type', label: 'Type', width: 180 },
  { id: 'description', label: 'Instructions', width: 270 },
  { id: '', width: 88 },
];

export type ActionSchemaType = zod.infer<ReturnType<typeof ActionSchema>>;

export const ActionSchema = (t: any) => zod.object({
  actionName: zod.string().min(1, t('Action name is required!'))
                  .regex(/^[a-zA-Z0-9]+$/, t('Action name should only contain letters and numbers without spaces or special characters!')),
  actionDescription: zod.string().optional(),
});

type Props = {
  currentAction?: IActionItem;
};

export function ActionsNewEditForm({ currentAction }: Props) {
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      actionName: currentAction?.actionName || '',
      actionDescription: currentAction?.actionDescription || '',
    }),
    [currentAction]
  );
  const {t} = useTranslate();
  const schema = ActionSchema(t);
  const methods = useForm<ActionSchemaType>({
    mode: 'all',
    resolver: zodResolver(schema),
    //@ts-ignore
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const [parameters, setParameters] = useState<IActionItem['actionParameters']>(
    currentAction?.actionParameters || []
  );
  const [loaded, setLoaded] = useState(false);
  const [apiEndpoints, setApiEndpoints] = useState<IApiEndpointItem[]>([]);
  const [kbs, setKbs] = useState<IKnowledgeBaseItem[]>([]);
  const [operation, setOperation] = useState<IActionOperation>(
    currentAction?.actionOperation || {
      type: 'hangup',
      data: null
    }
  );

  const [payloadJsonData, setPayloadJsonData] = useState<any>(() => {
    if (operation.type === 'apiEndpoint') {
      return operation.data.payloadData || JSON.parse('{}');
    }
    return JSON.parse('{}');
  });
  
  const jsonEditorRef = useRef<any>(null);

  const [operationErrors, setOperationErrors] = useState<Record<string, string>>({});

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
    if (currentAction) {
      reset(defaultValues);
    }
  }, [currentAction, defaultValues, reset]);

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
    parameters: IActionItem['actionParameters'];
    setParameters: React.Dispatch<React.SetStateAction<IActionItem['actionParameters']>>;
    }> = ({ parameters, setParameters }) => {
      const table = useTable();
      const [parameter, setParameter] = useState<IActionParameterItem>({
        parameterDescription: '',
        parameterIsRequired: false,
        parameterName: '',
        parameterType: 'string',
      });
      const [parameterErrors, setParameterErrors] = useState<
        Record<keyof IActionParameterItem, boolean>
      >({
        parameterDescription: false,
        parameterIsRequired: false,
        parameterName: false,
        parameterType: false,
      });

      const shouldShowParameterForm = useBoolean(false);
      const {t} = useTranslate();

      return (
        <Card>
          <Stack p={3} direction="row" alignItems="start" justifyContent="space-between">
            <Stack>
              <Typography variant="h6">
                {t('Action Parameters')}
              </Typography>
              <Typography mt="4px" color="var(--palette-text-secondary)" variant='body2'>
                {t('These parameters will be extracted as per instructions, and passed dynamically to the operation.')} <br/>
                {t('You can access these parameters by enclosing the parameter name in curly braces.')}
              </Typography>
            </Stack>
            <Button
              onClick={() => {
                shouldShowParameterForm.setValue(true);
              }}
              variant="contained"
            >
              {t('Add New Parameter')}
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
                              placeholder={t('Parameter name')}
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
                              <MenuItem value="string">
                                {t('Word')}
                              </MenuItem>
                              <MenuItem value="number">
                                {t('Number')}
                              </MenuItem>
                              <MenuItem value="boolean">
                                {t('True/False')}
                              </MenuItem>
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
                              placeholder={t("Instructions")}
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
                                {t('Add')}
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
                                {t('Cancel')}
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
                            updateParameter={(params: IActionParameterItem) => {
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
                  {t('No Parameters')}
                </Typography>
              </Stack>
            )}
          </Box>
        </Card>
      );
  };

  const ParameterTableRow: React.FC<{
    param: IActionParameterItem;
    changeIsRequired: (val: boolean) => void;
    changeName: (val: string) => void;
    changeType: (val: string) => void;
    changeDescription: (val: string) => void;
    removeParameter: () => void;
    updateParameter: (params: IActionParameterItem) => void;
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
        Record<keyof IActionParameterItem, boolean>
      >({
        parameterDescription: false,
        parameterIsRequired: false,
        parameterName: false,
        parameterType: false,
      });
      const {t} = useTranslate();
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
                placeholder={t('Parameter name')}
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
                <MenuItem value="string">
                  {t('Word')}
                </MenuItem>
                <MenuItem value="number">
                  {t('Number')}
                </MenuItem>
                <MenuItem value="boolean">
                  {t('True/False')}
                </MenuItem>
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
                  setParameter({ ...param, parameterDescription: e.target.value });
                }}
                name="description"
                placeholder={t('Instructions')}
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
                    {t('Update')}
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
                    {t('Cancel')}
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
                {t('Edit')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  removeParameter();
                  popover.onClose();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
                {t('Delete')}
              </MenuItem>
            </MenuList>
          </CustomPopover>
        </>
      );
  };

  const onSubmit = handleSubmit(async (data: any) => {

    if (operation.type === 'apiEndpoint') {
      console.log('Operation data', operation.data);
      if (!operation.data?.linkedApiEndpoint || operation.data?.linkedApiEndpoint.trim().length < 1) {
        console.log(operation.data?.linkedApiEndpoint.trim().length);
        setOperationErrors((prev) => ({
          ...prev,
          linkedApiEndpoint: 'ApiEndpoint is required',
        }));
        return;
      }
    }

    if (operation.type === 'knowledgeBase') {
      if (!operation.data?.linkedKnowledgeBase || operation.data?.linkedKnowledgeBase.trim().length < 1) {
        setOperationErrors((prev) => ({
          ...prev,
          linkedKnowledgeBase: 'KnowledgeBase is required',
        }));
        return;
      }
    }
    
    try {
      const url = currentAction ? `/actions/${currentAction._id}` : '/actions/create';
      const method = currentAction ? API.put : API.post;
      await method(url, {
        actionName: data.actionName,
        actionDescription: data?.actionDescription,
        actionOperation: operation,
        actionParameters: parameters,
      });
      reset();
      toast.success(currentAction ? t('Update success!') : t('Create success!')); 
      router.push('/actions');
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
      <CardHeader 
        title={t("Details" )}
        subheader={t("Action name and description")}
        sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {t('Action Name')}
          </Typography>
          <Field.Text name="actionName" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {t('Description')}
          </Typography>
          <Field.Text name="actionDescription" 
            multiline
            minRows={4}
            maxRows={4}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderOperations = (
    <Card>
      <CardHeader 
        title={t("Operation" )}
        subheader={t("Define the operation to be performed")}
        sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <RadioGroup
          value={operation.type}
          onChange={(e) => {
            const type = e.target.value as IActionOperation['type'];
            if (type === 'apiEndpoint') {
              setOperation({
                data: {
                  linkedApiEndpoint: operation.data && operation.type === 'apiEndpoint' ? operation.data.linkedApiEndpoint : '',
                  path: operation.data && operation.type === 'apiEndpoint' ? operation.data.path : '',
                  responseInstructions: operation.data && operation.type === 'apiEndpoint' ? operation.data.responseInstructions : '',
                  payloadData: operation.data && operation.type === 'apiEndpoint' ? operation.data.payloadData : JSON.parse('{}'),
                },
                type,
              });
            } else if (type === 'knowledgeBase') {
              setOperation({
                data: {
                  linkedKnowledgeBase: operation.data && operation.type === 'knowledgeBase' ? operation.data.linkedKnowledgeBase : '',
                  responseInstructions: operation.data && operation.type === 'knowledgeBase' ? operation.data.responseInstructions : '',
                },
                type,
              });
            } else {
              setOperation({
                data: null,
                type,
              });
            }
          }}
          name="operation"
        >
          <Stack direction="row">
            <FormControlLabel control={<Radio />} 
              label={t("Search through a Knowledge base")} 
              value="knowledgeBase" />
            <FormControlLabel control={<Radio />} 
            label={t("Invoke an API Endpoint")} 
            value="apiEndpoint" />
            {/* <FormControlLabel control={<Radio />} label="Transfer" value="transfer" /> */}
            <FormControlLabel control={<Radio />} label={t("Hangup the call")} value="hangup" />
          </Stack>
        </RadioGroup>
        {operation.type === 'apiEndpoint' && (
          <Box display="grid" gridTemplateColumns="0.5fr 1fr" gap={4}>
            <Typography alignSelf="center">
              {t("API Endpoint")}
            </Typography>
            <Box>
              <Field.Select
                error={Boolean(operationErrors.linkedApiEndpoint)}
                key={operation.data?.linkedApiEndpoint}
                value={operation.data?.linkedApiEndpoint}
                onChange={(e) => {
                  setOperation((pre) => ({
                    type: 'apiEndpoint',
                    data: {
                      linkedApiEndpoint: e.target.value,
                      responseInstructions: pre.data && pre.type === 'apiEndpoint' ? pre.data.responseInstructions : '',
                      path: pre.data && pre.type === 'apiEndpoint' ? pre.data.path : '',
                      payloadData: pre.data && pre.type === 'apiEndpoint' ? pre.data.payloadData : JSON.parse('{}'),
                    },
                  }));
                  setOperationErrors((prev) => ({
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
              {operationErrors.linkedApiEndpoint && (
                <Typography variant="caption" color="error" mt={1}>
                  {operationErrors.linkedApiEndpoint}
                </Typography>
              )}
            </Box>

            <Typography alignSelf="center">
              {t("Path")}
            </Typography>
            <Box
              border="1px solid"
              borderColor={
                operationErrors.path
                  ? 'var(--palette-error-main)'
                  : 'var(--palette-background-neutral)'
              }
              borderRadius="var(--shape-borderRadius)"
              sx={{
                ':hover': {
                  borderColor: operationErrors.path
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
                      operation.data?.path || '', 
                      parameters ? parameters.map((param) => param.parameterName) : []
                    ).props.children}
                </Typography>
              </Box>
              <Field.Text
                sx={{
                  opacity: 0,
                }}
                value={operation.data?.path}
                onChange={(e) => {
                  setOperation((pre) => ({
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
                error={Boolean(operationErrors.path)}
              />
            </Box>

            
            <Typography alignSelf="center">
              {t("Request JSON Body")}
            </Typography>
            <Box>
              <Editor 
                  ref={jsonEditorRef}
                  value={payloadJsonData} 
                  onChange={(updatedJson: any) => {
                    setPayloadJsonData(updatedJson);
                    setOperation((pre) => ({
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
              {operationErrors.payloadData && (
                <Typography variant="caption" color="error" mt={1}>
                  {operationErrors.payloadData}
                </Typography>
              )}
            </Box>
            
            <Typography alignSelf="center">
              {t("Response Instructions")}
            </Typography>
            <Box
              border="1px solid"
              borderColor={
                operationErrors.responseInstructions
                  ? 'var(--palette-error-main)'
                  : 'var(--palette-background-neutral)'
              }
              borderRadius="var(--shape-borderRadius)"
              sx={{
                ':hover': {
                  borderColor: operationErrors.responseInstructions
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
                      operation.data?.responseInstructions || ''  
                    ).props.children}
                </Typography>
              </Box>
              <Field.Text
                rows={4}
                sx={{
                  opacity: 0,
                }}
                value={operation.data?.responseInstructions}
                onChange={(e) => {
                  setOperation((pre) => ({
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
                error={Boolean(operationErrors.responseInstructions)}
              />
            </Box>
          </Box>
        )}

        {operation.type === 'knowledgeBase' && (
          <Box display="grid" gridTemplateColumns="0.5fr 1fr" gap={4}>
            <Typography alignSelf="center">
              {t("Knowledge Base")}
            </Typography>
            <Box>
              <Field.Select
                error={Boolean(operationErrors.linkedKnowledgeBase)}
                key={operation.data?.linkedKnowledgeBase}
                value={operation.data?.linkedKnowledgeBase}
                onChange={(e) => {
                  setOperation((pre) => ({
                    type: 'knowledgeBase',
                    data: {
                      linkedKnowledgeBase: e.target.value,
                      responseInstructions: pre.data && pre.type === 'knowledgeBase' ? pre.data.responseInstructions : '',
                    },
                  }));
                  setOperationErrors((prev) => ({
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
              {operationErrors.linkedKnowledgeBase && (
                <Typography variant="caption" color="error" mt={1}>
                  {operationErrors.linkedKnowledgeBase}
                </Typography>
              )}
            </Box>

            <Typography alignSelf="center">
              {t("Response Instructions")}
            </Typography>
            <Box
              border="1px solid"
              borderColor={
                operationErrors.responseInstructions
                  ? 'var(--palette-error-main)'
                  : 'var(--palette-background-neutral)'
              }
              borderRadius="var(--shape-borderRadius)"
              sx={{
                ':hover': {
                  borderColor: operationErrors.responseInstructions
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
                      operation.data?.responseInstructions || ''  
                    ).props.children}
                </Typography>
              </Box>
              <Field.Text
                rows={4}
                sx={{
                  opacity: 0,
                }}
                value={operation.data?.responseInstructions}
                onChange={(e) => {
                  setOperation((pre) => ({
                    type: 'knowledgeBase',
                    data: {
                      linkedKnowledgeBase: pre.data && pre.type === 'knowledgeBase' ? pre.data.linkedKnowledgeBase : '',
                      responseInstructions: e.target.value
                    },
                  }));
                }}
                name="Response Instructions"
                error={Boolean(operationErrors.responseInstructions)}
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
        {!currentAction ? t('Create') : t('Update')}
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
              {renderOperations}
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