/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect, useState, useCallback, Fragment } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import type { IKnowledgeBaseItem } from 'src/types/knowledge-base';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import API from 'src/utils/API';
import type { IBotType } from 'src/types/bot';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  MenuList,
} from '@mui/material';
import { deleteBot } from 'src/utils/api/bots';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import type { IFunctionItem } from 'src/types/function';
import { LoadingScreen } from 'src/components/loading-screen';
import { TableHeadCustom, useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import { CustomPopover, usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------
const voiceIDs: Record<string, string[]> = {
  en: ['Joanna', 'Joey', 'Justin', 'Raveena'],
  es: ['Conchita', 'Lucia', 'Enrique'],
};

export type NewBotSchemaType = zod.infer<typeof NewBotSchema>;

export const NewBotSchema = zod.object({
  botName: zod.string().min(1, { message: 'Bot name is required!' }),
  botIntroduction: zod.string().min(1, { message: 'Bot Introduction is required!' }),
  botInstructions: zod.string(),
  botVoiceId: zod.string().min(1, { message: 'Voice ID is required!' }),
  botIsInterruptable: zod.boolean(),
  botKnowledgeBase: zod.string(),
  endpointing: zod
    .number()
    .min(0, { message: 'Endpointing must be a positive number!' })
    .max(3000, { message: 'Endpointing must be less than 3000!' })
    .refine((value) => value % 1 === 0, { message: 'Endpointing must be an integer!' }),
  botTimezone: zod.string().min(1, { message: 'Bot Timezone is required!' }),
  daylightSavings: zod.boolean(),
  botLanguage: zod.string().min(1, { message: 'Bot Language is required!' }),
});

type Props = {
  currentBot?: IBotType;
  isUsed?: boolean;
};

export function BotNewEditForm({ currentBot, isUsed }: Props) {
  const router = useRouter();
  const alertDialog = useBoolean();
  const actionDialog = useBoolean();
  const defaultValues = useMemo(
    () => ({
      botName: currentBot?.botName || '',
      botIntroduction: currentBot?.botIntroduction || '',
      botInstructions: currentBot?.botInstructions || '',
      botLanguage: currentBot?.botLanguage || 'en',
      botVoiceId: currentBot?.botVoiceId || '',
      botIsInterruptable: currentBot?.botIsInterruptable || false,
      endpointing: currentBot?.endpointing || 20,
      botKnowledgeBase: currentBot?.botKnowledgeBase || '',
      botTimezone: currentBot?.botTimezone || 'UTC-05:00',
      daylightSavings: currentBot?.daylightSavings || false,
    }),
    [currentBot]
  );
  const methods = useForm<NewBotSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewBotSchema),
    //@ts-ignore
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    resetField,
    setValue,
    watch,
  } = methods;

  const values = watch();

  const [loaded, setLoaded] = useState(false);
  const [kbs, setKbs] = useState<{ label: string; value: string }[]>([]);
  const [functions, setFunctions] = useState<IFunctionItem[]>([]);
  const [invocations, setInvocations] = useState<{ function: string; trigger: string }[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(currentBot?.botVoiceId || null);
  const [openVoiceDialog, setOpenVoiceDialog] = useState(false);

  const getData = useCallback(async () => {
    const kbPromise = API.get<{
      knowledgeBases: IKnowledgeBaseItem[];
      count: number;
    }>('/knowledgeBases');
    const functionPromise = API.get<{ functions: IFunctionItem[] }>('/functions');
    const [{ data }, funcRes] = await Promise.all([kbPromise, functionPromise]);
    const kbOptions = data.knowledgeBases.map((kb) => ({
      key: kb._id,
      label: kb.knowledgeBaseName,
      value: kb._id,
    }));

    setFunctions(funcRes.data.functions);
    setKbs(kbOptions);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (currentBot) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentBot, defaultValues, reset]);

  console.log(values.botVoiceId);

  useEffect(() => {
    getData();
  }, [getData]);

  // values.botLanguage = values.botLanguage || 'en';
  console.log(values.botLanguage);
  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      console.log(data);
      const url = currentBot ? `/bots/${currentBot._id}` : '/bots/create';
      const method = currentBot ? API.put : API.post;
      await method(url, {
        botName: data.botName,
        botIntroduction: data.botIntroduction,
        botInstructions: data.botInstructions,
        botLanguage: 'en',
        botVoiceId: data.botVoiceId,
        botKnowledgeBase: data.botKnowledgeBase,
        botIsInterruptable: data.botIsInterruptable,
        endpointing: data.endpointing,
        botTimezone: data.botTimezone,
        daylightSavings: data.daylightSavings,
      });
      reset();
      toast.success(currentBot ? 'Update success!' : 'Create success!');
      router.push('/bots');
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader
        title="Details"
        subheader="Bot name, introduction and prompt instructions"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Bot Name</Typography>
          <Field.Text name="botName" placeholder="Ex: Sales bot..." />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Introduction Line</Typography>
          <Field.Text
            name="botIntroduction"
            placeholder="Hi, I'm an AI assistant that would like to ..."
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Bot Instructions</Typography>
          <Field.TextareaWithMaximize
            // height={200}
            // showToolbar={false}
            // rows={6}
            name="botInstructions"
            placeholder="Enter detailed instructions..."
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Speech settings"
        subheader="Speech functions and attributes"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Voice</Typography>
          <Stack spacing={1.5} direction="row" sx={{ gap: 4, width: '100%' }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Language</Typography>
                  <Field.Select
                    onChange={(e) => {
                      setValue('botLanguage', e.target.value as 'en' | 'es');
                      setValue('botVoiceId', '');
                      setSelectedVoice(null);
                      // voiceRef.current?.focus();
                    }}
                    defaultValue={values.botLanguage}
                    name="language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                  </Field.Select>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Voice Id</Typography>

                    {/* <Field.Text
                      name="botVoiceId"
                      // label='Voice ID'
                      ref={voiceRef}
                      // options={voiceIDs[values.botLanguage || 'en']}
                      placeholder="Select a voice ID"
                      defaultValue=""
                      fullWidth
                      disabled
                    /> */}
                    <Button
                      disabled={!values.botLanguage}
                      onClick={() => {
                        setOpenVoiceDialog(true);
                      }}
                      sx={{ minHeight: '55.99px' }}
                      variant="contained"
                      size="large"
                    >
                      {values.botVoiceId || 'Select Voice'}
                      <Iconify icon="eva:arrow-ios-downward" />
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Interruptable</Typography>
          <Field.Switch
            name="botIsInterruptable"
            label={
              values.botIsInterruptable
                ? 'The bot stops speaking when the user interrupts the bot'
                : 'The bot continues to speak even when the user interrupts the bot'
            }
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Endpointing</Typography>
          <Field.Text
            name="endpointing"
            placeholder="Enter endpointing value"
            type="number"
            sx={{
              width: {
                xs: '100%',
                sm: 200,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>ms</Box>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderKnowledgeBase = (
    <Card>
      <CardHeader title="Knowledge Base" subheader="Knowledge base settings" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        {/* when the switch is active then a select should be present with 'x', 'y', 'z' as options */}
        <Stack spacing={1.5}>
          {/* <Field.Autocomplete
            name="botKnowledgeBase"
            autoHighlight
            options={kbs.map((option) => option)}
            getOptionLabel={(option) => option.label || ''}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {option.label}
              </li>
            )}
          /> */}
          <Field.Select name="botKnowledgeBase" label="Knowledge Base">
            {kbs.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select>
        </Stack>
      </Stack>
    </Card>
  );

  const renderMisc = (
    <Card>
      <CardHeader title="Misc." subheader="Miscellaneous settings" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Timezone</Typography>
          <Field.TimezoneSelect name="botTimezone" placeholder="Select a timezone" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Daylight Savings</Typography>
          <Field.Switch name="daylightSavings" label="Daylight Savings" />
        </Stack>
      </Stack>
    </Card>
  );

  // const renderActions = ();

  return (
    <>
      {loaded ? (
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
            {renderDetails}

            {renderProperties}

            {renderKnowledgeBase}

            {renderMisc}

            <InvokeFunction
              functions={functions}
              botInstructions={values.botInstructions}
              invocations={invocations}
              setInvocations={setInvocations}
            />

            <Box
              display="flex"
              alignItems="center"
              justifyContent={currentBot ? 'space-between' : 'end'}
              flexWrap="wrap"
            >
              {/* <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ flexGrow: 1, pl: 3 }}
      /> */}
              {currentBot && (
                <Button
                  onClick={async () => {
                    if (isUsed) {
                      alertDialog.setValue(true);
                    } else {
                      await deleteBot(currentBot._id, () => {
                        router.push('/bots');
                      });
                    }
                  }}
                  variant="contained"
                  size="large"
                  color="error"
                >
                  Delete bot
                </Button>
              )}
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
                sx={{ ml: 2 }}
              >
                {!currentBot ? 'Create Bot' : 'Update Bot'}
                {/* Ji */}
              </LoadingButton>
            </Box>
          </Stack>
        </Form>
      ) : (
        <LoadingScreen />
      )}
      <ConfirmDialog
        title="Unable to delete bot"
        content="This bot is currently being used in some campaign(s). Please remove it from the linked campaign(s) before deleting."
        open={alertDialog.value}
        action={<></>}
        onClose={() => {
          alertDialog.setValue(false);
        }}
      />
      <VoiceDialog
        open={openVoiceDialog}
        onClose={() => setOpenVoiceDialog(false)}
        // voices={voiceIDs[values.botLanguage || 'en']}
        onSelect={(voice) => {
          setSelectedVoice(voice);
          setValue('botVoiceId', voice);
          setOpenVoiceDialog(false);
        }}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        language={values.botLanguage}
        onConfirm={(voiceId: string) => {
          setValue('botVoiceId', voiceId);
          setOpenVoiceDialog(false);
        }}
      />
    </>
  );
}

const ActionTriggerDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  botInstrunctions: string;
  onSubmit: (action: string) => void;
}> = ({ open, onClose, botInstrunctions, onSubmit }) => {
  const actions = botInstrunctions.split('.').filter((line) => line.trim().length > 0);
  const [selectedAction, setSelectedAction] = useState<string | undefined>(undefined);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select trigger</DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          my={2}
          border="2px solid"
          borderRadius="12px"
          borderColor="background.neutral"
          sx={{
            '#action': {
              cursor: 'pointer',
              ':hover': {
                backgroundColor: 'primary.main',
              },
              '&.selected': {
                backgroundColor: 'primary.main',
              },
            },
          }}
          p={2}
        >
          <Typography variant="subtitle1">
            {actions.map((action, index) => (
              <Fragment key={index}>
                <Typography
                  component="span"
                  id="action"
                  className={selectedAction === action ? 'selected' : ''}
                  onClick={() =>
                    setSelectedAction((prev) => (prev === action ? undefined : action))
                  }
                >
                  {action}
                </Typography>
                <Typography component="span"> . </Typography>
              </Fragment>
            ))}
          </Typography>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">
          Close
        </Button>
        <Button
          disabled={!selectedAction}
          onClick={() => {
            if (!selectedAction) return;
            onSubmit(selectedAction);
          }}
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TABLE_HEAD = [
  // { id: 'checkbox', width: '' },
  { id: 'function', label: 'Function', width: 255 },
  { id: 'trigger', label: 'Trigger', width: 255 },
  { id: '', width: 200 },
];

const InvokeFunction: React.FC<{
  functions: IFunctionItem[];
  botInstructions: string;
  invocations: {
    function: string;
    trigger: string;
  }[];
  setInvocations: React.Dispatch<React.SetStateAction<{ function: string; trigger: string }[]>>;
}> = ({ botInstructions, functions, invocations, setInvocations }) => {
  const shouldShowForm = useBoolean();
  const table = useTable();
  const [invocation, setInvocation] = useState<{
    function: string;
    trigger: string;
  }>({
    function: '',
    trigger: '',
  });
  const [errors, setErrors] = useState<{
    function: boolean;
    trigger: boolean;
  }>({
    function: false,
    trigger: false,
  });

  const openActionDialog = useBoolean();

  return (
    <>
      <Card>
        <Stack p={3} direction="row" alignItems="start" justifyContent="space-between">
          <Stack>
            <Typography variant="h5">Invoke Function</Typography>
          </Stack>
          <Button
            onClick={() => {
              shouldShowForm.setValue(true);
            }}
            variant="contained"
          >
            Add New Invocation
          </Button>
        </Stack>
        <Divider />
        <Divider />
        <Box p={4}>
          {Boolean(invocations.length) || shouldShowForm.value ? (
            <Card>
              <Table>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  numSelected={table.selected.length}
                />
                <TableBody>
                  {shouldShowForm.value && (
                    <TableRow>
                      <TableCell
                        sx={{
                          verticalAlign: 'top',
                        }}
                      >
                        <Field.Select
                          name="key"
                          value={invocation.function}
                          onChange={(e) => {
                            setInvocation((prev) => ({
                              ...prev,
                              function: e.target.value,
                            }));
                          }}
                          placeholder="Header key"
                          error={errors.function}
                        >
                          {functions.map((func) => (
                            <MenuItem key={func._id} value={func._id}>
                              {func.functionName}
                            </MenuItem>
                          ))}
                        </Field.Select>
                      </TableCell>

                      <TableCell
                        sx={{
                          verticalAlign: 'top',
                        }}
                      >
                        {invocation.trigger ? (
                          <Typography>{invocation.trigger}</Typography>
                        ) : (
                          <Button
                            onClick={() => {
                              openActionDialog.setValue(true);
                            }}
                            fullWidth
                            size="large"
                            variant="contained"
                          >
                            Add Trigger
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack gap={2}>
                          <Button
                            variant="contained"
                            onClick={() => {
                              let isError = false;
                              if (!invocation.function) {
                                setErrors((prev) => ({
                                  ...prev,
                                  function: true,
                                }));
                                isError = true;
                              }
                              if (!invocation.trigger || invocation.trigger.trim().length < 1) {
                                setErrors((prev) => ({
                                  ...prev,
                                  trigger: true,
                                }));
                                isError = true;
                              }

                              if (!isError) {
                                setInvocations((prev) => [...prev, invocation]);
                                setInvocation({
                                  function: '',
                                  trigger: '',
                                });
                                setErrors({
                                  function: false,
                                  trigger: false,
                                });
                                shouldShowForm.setValue(false);
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
                              shouldShowForm.setValue(false);
                              setInvocation({
                                function: '',
                                trigger: '',
                              });
                              setErrors({
                                function: false,
                                trigger: false,
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                  {invocations.map((i, index) => {
                    return (
                      <InvocationsTableRow
                        key={JSON.stringify(i) + index}
                        currentInvocation={i}
                        removeInvocation={() => {
                          setInvocations((prev) => {
                            const newInvocations = [...prev];
                            newInvocations.splice(index, 1);
                            return newInvocations;
                          });
                        }}
                        updateInvocation={(newInvocation) => {
                          setInvocations((prev) => {
                            const newInvocations = [...prev];
                            newInvocations[index] = newInvocation;
                            return newInvocations;
                          });
                        }}
                        functions={functions}
                        botInstructions={botInstructions}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Stack>
              <Typography variant="h5" align="center">
                No Invocations
              </Typography>
            </Stack>
          )}
        </Box>
      </Card>
      <ActionTriggerDialog
        open={openActionDialog.value}
        onClose={() => openActionDialog.setValue(false)}
        botInstrunctions={botInstructions}
        onSubmit={(action) => {
          setInvocation((prev) => ({
            ...prev,
            trigger: action,
          }));
          openActionDialog.setValue(false);
        }}
      />
    </>
  );
};

const InvocationsTableRow: React.FC<{
  currentInvocation: {
    function: string;
    trigger: string;
  };
  removeInvocation: () => void;
  updateInvocation: (newInvocation: { function: string; trigger: string }) => void;
  functions: IFunctionItem[];
  botInstructions: string;
}> = ({ currentInvocation, removeInvocation, updateInvocation, functions, botInstructions }) => {
  const popover = usePopover();
  const editing = useBoolean();
  const [invocation, setInvocation] = useState<{
    function: string;
    trigger: string;
  }>(currentInvocation);
  const [errors, setErrors] = useState<{
    function: boolean;
    trigger: boolean;
  }>({
    function: false,
    trigger: false,
  });
  const openActionDialog = useBoolean();

  return (
    <>
      <TableRow>
        <TableCell
          sx={{
            verticalAlign: 'top',
          }}
        >
          <Field.Select
            name="key"
            disabled={!editing.value}
            value={invocation.function}
            onChange={(e) => {
              setInvocation((prev) => ({
                ...prev,
                function: e.target.value,
              }));
            }}
            placeholder="Header key"
            error={errors.function}
          >
            {functions.map((func) => (
              <MenuItem key={func._id} value={func._id}>
                {func.functionName}
              </MenuItem>
            ))}
          </Field.Select>
        </TableCell>

        <TableCell
          sx={{
            verticalAlign: 'top',
          }}
        >
          {!editing.value ? (
            <Typography>{invocation.trigger}</Typography>
          ) : (
            <Button
              size="large"
              fullWidth
              onClick={() => {
                openActionDialog.setValue(true);
              }}
              variant="contained"
            >
              Add Trigger
            </Button>
          )}
        </TableCell>
        <TableCell align="right">
          {editing.value ? (
            <Stack gap={2}>
              <Button
                variant="contained"
                onClick={() => {
                  let isError = false;
                  if (!invocation.function) {
                    setErrors((prev) => ({
                      ...prev,
                      function: true,
                    }));
                    isError = true;
                  }
                  if (!invocation.trigger || invocation.trigger.trim().length < 1) {
                    setErrors((prev) => ({
                      ...prev,
                      trigger: true,
                    }));
                    isError = true;
                  }

                  if (!isError) {
                    updateInvocation(invocation);
                    setErrors({
                      function: false,
                      trigger: false,
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
                  setInvocation({
                    ...currentInvocation,
                  });
                  setErrors({
                    function: false,
                    trigger: false,
                  });
                  editing.setValue(false);
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
              removeInvocation();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
      <ActionTriggerDialog
        open={openActionDialog.value}
        onClose={() => openActionDialog.setValue(false)}
        botInstrunctions={botInstructions}
        onSubmit={(action) => {
          setInvocation((prev) => ({
            ...prev,
            trigger: action,
          }));
          openActionDialog.setValue(false);
        }}
      />
    </>
  );
};

const voicesEn: {
  provider: 'AWS' | 'GCP' | 'Azure';
  gender: 'M' | 'F';
  accent: string;
  voice: string;
  price: 'free' | 'paid';
  file: string;
}[] = [
  {
    provider: 'AWS',
    gender: 'F',
    accent: 'us',
    voice: 'Joanna',
    price: 'free',
    file: '/voices/female_american.mp3',
  },
  {
    provider: 'GCP',
    gender: 'M',
    accent: 'us',
    voice: 'Mark',
    price: 'free',
    file: '/voices/male_american.mp3',
  },
  {
    provider: 'AWS',
    gender: 'F',
    accent: 'au',
    voice: 'Nicole',
    price: 'paid',
    file: '/voices/female_australian.mp3',
  },
];

const voicesEs: {
  provider: 'AWS' | 'GCP' | 'Azure';
  gender: 'M' | 'F';
  accent: string;
  voice: string;
  price: 'free' | 'paid';
  file: string;
}[] = [
  {
    provider: 'GCP',
    gender: 'M',
    accent: 'mx',
    voice: 'Miguel',
    price: 'free',
    file: '/voices/male_spanish.mp3',
  },
];

const voiceTableHead = [
  { id: 'provider', label: 'Provider', width: 80 },
  { id: 'gender', label: 'Gender', width: 80 },
  { id: 'accent', label: 'Accent', width: 80 },
  { id: 'voice', label: 'Voice ID', width: 180 },
  { id: 'price', label: 'Price', width: 120 },
  { id: 'file', label: 'File', width: 180 },
  { id: '', width: 80 },
];
const VoiceDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  // voices: string[];
  onSelect: (voice: string) => void;
  selectedVoice: string | null;
  setSelectedVoice: React.Dispatch<React.SetStateAction<string | null>>;
  language: string;
  onConfirm: (voice: string) => void;
}> = ({ open, onClose, onSelect, language, selectedVoice, setSelectedVoice }) => {
  const table = useTable();
  const [selected, setSelected] = useState<string | null>(selectedVoice);
  const voices = useMemo(() => {
    if (language === 'en') {
      return voicesEn;
    }
    return voicesEs;
  }, [language]);

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Voice</DialogTitle>
      <Divider />
      <DialogContent>
        <Card
          sx={{
            my: 2,
          }}
        >
          <Table>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={voiceTableHead}
              numSelected={table.selected.length}
            />
            <TableBody>
              {voices.map((voice) => (
                <VoicesTableRow
                  key={voice.voice}
                  voice={voice}
                  selected={selected}
                  setSelected={setSelected}
                  currentlyPlaying={currentlyPlaying}
                  setCurrentlyPlaying={setCurrentlyPlaying}
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={() => {
            setCurrentlyPlaying(null);
            onClose();
          }}
          variant="outlined"
          color="error"
        >
          Close
        </Button>
        <Button
          onClick={() => {
            if (selected) {
              onSelect(selected);
            }
          }}
          variant="contained"
          disabled={!selected}
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const VoicesTableRow: React.FC<{
  voice: {
    provider: 'AWS' | 'GCP' | 'Azure';
    gender: 'M' | 'F';
    accent: string;
    voice: string;
    price: 'free' | 'paid';
    file: string;
  };
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  currentlyPlaying: string | null;
  setCurrentlyPlaying: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ voice, selected, setSelected, currentlyPlaying, setCurrentlyPlaying }) => {
  const audio = useMemo(() => {
    return new Audio(voice.file);
  }, [voice.file]);

  useEffect(() => {
    if (currentlyPlaying === voice.file) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audio, currentlyPlaying, voice.file]);

  return (
    <TableRow
      sx={{
        '&:hover': {
          backgroundColor: 'background.neutral',
        },
        cursor: 'pointer',
      }}
      onClick={() => {
        setSelected(voice.voice);
      }}
      key={voice.voice}
    >
      <TableCell
        sx={{
          textTransform: 'capitalize',
        }}
        // width={80}
      >
        <Stack justifyContent="center" alignItems="center" spacing={1.5}>
          <Iconify
            icon={voice.provider === 'AWS' ? 'skill-icons:aws-dark' : 'skill-icons:gcp-dark'}
            width="2.5rem"
          />
          {/* <Typography variant="caption">{voice.provider}</Typography> */}
        </Stack>
      </TableCell>
      <TableCell>
        <Stack justifyContent="center" alignItems="center" spacing={1.5}>
          <Iconify
            icon={voice.gender === 'M' ? 'noto:male-sign' : 'noto:female-sign'}
            width="2.5rem"
          />
          {/* <Typography variant="caption" textAlign="center">
        {voice.gender}
      </Typography> */}
        </Stack>
      </TableCell>
      <TableCell>
        <Stack justifyContent="center" alignItems="center">
          <Iconify
            icon={voice.accent === 'us' ? 'twemoji:flag-united-states' : 'twemoji:flag-australia'}
            width="1.5rem"
          />
          <Typography variant="caption">{voice.accent}</Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack>
          <Typography>{voice.voice}</Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack>
          <Typography
            sx={{
              textTransform: 'capitalize',
            }}
          >
            {voice.price}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <IconButton
          onClick={() => {
            setCurrentlyPlaying((prev) => (prev === voice.file ? null : voice.file));
          }}
        >
          <Iconify
            icon={currentlyPlaying !== voice.voice ? 'gravity-ui:play-fill' : 'solar:pause-bold'}
          />
        </IconButton>
      </TableCell>
      <TableCell>
        <Iconify
          icon={
            selected === voice.voice
              ? 'mdi:checkbox-marked-circle'
              : 'ri:checkbox-blank-circle-line'
          }
        />
      </TableCell>
    </TableRow>
  );
};
