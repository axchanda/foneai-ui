import { Fragment, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    Typography,
    TextField,
    TableRow,
    MenuList
  } from '@mui/material';
  import { Form, Field } from 'src/components/hook-form';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { TableHeadCustom, useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { IActionItem } from 'src/types/action';
import { set } from 'nprogress';
import { Scrollbar } from '../scrollbar';

const TABLE_HEAD = [
  { id: 'action', label: 'Action', width: 255 },
  { id: 'trigger', label: 'Trigger', width: 255 },
  { id: '', width: 200 },
];


const ActionTriggerDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    instructions: string;
    onSubmit: (trigger: string) => void;
  }> = ({ open, onClose, instructions, onSubmit }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const instructionLines = instructions.split('.').filter((line) => line.trim().length > 0);
    const [selectedAction, setSelectedAction] = useState<string | undefined>(undefined);
    const [tab, setTab] = useState(1);
  
    const renderTriggerByBotInstructions = (
      <Box>
        <Button
          sx={{
            mt: 2,
          }}
          fullWidth={false}
          variant="outlined"
          color="info"
          onClick={() => {
            setTab(1);
          }}
        >
          Go Back
        </Button>
        <Box
          my={2}
          minWidth={400}
          border="2px solid"
          borderRadius="12px"
          borderColor="background.neutral"
          sx={{
            '.trigger': {
              cursor: 'pointer',
              ':hover': {
                backgroundColor: 'primary.main',
              },
            },
            '.selected': {
              backgroundColor: 'primary.main',
              color: 'white', // You can add color changes for better visibility
              paddingX: 1,
              paddingY: 0.5,
              borderRadius: 1,
            },
          }}
          p={2}
        >
          <Typography variant="subtitle1">
            {instructionLines.map((instructionLine, index) => (
              <Fragment key={index}>
                {instructionLine.startsWith('\n') && <br />}
                <Typography
                  component="span"
                  className={`trigger ${selectedAction === instructionLine.trim() ? 'selected' : ''}`}
                  onClick={() => setSelectedAction(
                    instructionLine.trim()
                  )}
                >
                  {instructionLine.trim()}
                </Typography>
                <Typography component="span"> . </Typography>
              </Fragment>
            ))}
          </Typography>
        </Box>
  
      </Box>
    );
  
    const renderCustomInstructions = (
      <Box minWidth={400}>
        <Button
          sx={{
            mt: 2,
            display: 'block',
          }}
          fullWidth={false}
          variant="outlined"
          color="info"
          onClick={() => {
            setSelectedAction(undefined);
            setTab(1);
          }}
        >
          Go Back
        </Button>
        <TextField
          sx={{
            my: 2,
          }}
          multiline
          rows={10}
          fullWidth
          placeholder="Write instructions to trigger the action"
          onChange={(e) => setSelectedAction(e.target.value.trim())}
        />
      </Box>
    );
  
    const renderRadios = (
      <Box py={2} display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
        <Card
          sx={{
            border: '1px solid',
            borderColor: selected === 'custom' ? 'primary.main' : 'background.neutral',
            backgroundColor: selected === 'custom' ? 'primary.main' : 'background.neutral',
            color: selected === 'custom' ? 'white' : 'text.primary',
          }}
        >
          <Box
            sx={{
              cursor: 'pointer',
              textAlign: 'center',
            }}
            onClick={() => setSelected('custom')}
            px={2}
            py={4}
          >
            <Typography>Custom Instructions</Typography>
          </Box>
        </Card>
        <Card
          sx={{
            border: '1px solid',
            borderColor: selected === 'highlight' ? 'primary.main' : 'background.neutral',
            backgroundColor: selected === 'highlight' ? 'primary.main' : 'background.neutral',
            color: selected === 'highlight' ? 'white' : 'text.primary',
          }}
        >
          <Box
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => setSelected('highlight')}
            px={2}
            py={4}
          >
            <Typography>Highlight Agent Instructions</Typography>
          </Box>
        </Card>
      </Box>
    );
  
    const isDisabled = tab === 1 ? !selected : !selectedAction;
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Trigger the Action by: </DialogTitle>
        <Divider />
        <DialogContent>
          {tab === 1 ? renderRadios : selected === 'highlight' ? renderTriggerByBotInstructions : renderCustomInstructions}
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Close
          </Button>
          <Button
            disabled={isDisabled}
            onClick={() => {
              if (tab === 1) {
                setTab(2);
              } else {
                if (!selectedAction) return;
                const sa = selectedAction;
                setTab(1);
                setSelectedAction(undefined);
                onSubmit(sa);
              }
            }}
            variant="contained"
          >
            {tab === 1 ? 'Next' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    );
};

const TriggerAction: React.FC<{
  actions: any[];
  instructions: string;
  actionTriggers: {
      actionId: string;
      trigger: string;
  }[];
  setActionTriggers: React.Dispatch<
      React.SetStateAction<{ actionId: string; trigger: string }[]>
  >;
}> = ({ instructions, actions, actionTriggers, setActionTriggers }) => {
  const shouldShowForm = useBoolean();
  const table = useTable();
  const [triggerEditingInProgress, setTriggerEditingInProgress] = useState(false);
  const [actionTrigger, setActionTrigger] = useState<{
      action: string;
      trigger: string;
  }>({
      action: '',
      trigger: '',
  });
  const [errors, setErrors] = useState<{
      action: boolean;
      trigger: boolean;
  }>({
      action: false,
      trigger: false,
  });

  const [openActionDialog, setOpenActionDialog] = useState(false);

  useEffect(() => {
      if (actionTrigger) {
      setOpenActionDialog(false);
      }
  }, [actionTrigger]);

  return (
      <>
      <Card>
          <Stack p={3} direction="row" alignItems="start" justifyContent="space-between">
          <Stack>
              <Typography variant="h5">Trigger Actions</Typography>
          </Stack>
          <Button
              onClick={() => {
                shouldShowForm.setValue(true);
                setTriggerEditingInProgress(true);
              }}
              variant="contained"
              disabled={triggerEditingInProgress}
          >
              Add New Action Trigger
          </Button>
          </Stack>
          <Divider />
          <Divider />
          <Box p={4}>
          {Boolean(actionTriggers.length) || shouldShowForm.value ? (
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
                      {shouldShowForm.value && (
                          <TableRow>
                          <TableCell
                              sx={{
                              verticalAlign: 'top',
                              }}
                          >
                              <Field.Select
                              name="key"
                              value={actionTrigger.action}
                              onChange={(e) => {
                                  setActionTrigger((prev) => ({
                                  ...prev,
                                  action: e.target.value,
                                  }));
                              }}
                              placeholder="Select a Action"
                              error={errors.action}
                              >
                              {actions.map((actionItem) => (
                                  <MenuItem key={actionItem._id} value={actionItem._id}>
                                  {actionItem.actionName}
                                  </MenuItem>
                              ))}
                              </Field.Select>
                          </TableCell>

                          <TableCell
                              sx={{
                              verticalAlign: 'top',
                              }}
                          >
                              {actionTrigger.trigger ? (
                              <Typography>{actionTrigger.trigger}</Typography>
                              ) : (
                              <Button
                                  onClick={() => {
                                    setOpenActionDialog(true);
                                  }}
                                  fullWidth
                                  size="large"
                                  variant="contained"
                              >
                                  Set Trigger event
                              </Button>
                              )}
                          </TableCell>
                          <TableCell>
                              <Stack gap={2}>
                              <Button
                                  variant="contained"
                                  onClick={() => {
                                  console.log('New Action Trigger:', actionTrigger);
                                  let isError = false;
                                  if (!actionTrigger.action) {
                                      setErrors((prev) => ({
                                      ...prev,
                                      action: true,
                                      }));
                                      isError = true;
                                  }
                                  if (!actionTrigger.trigger || actionTrigger.trigger.trim().length < 1) {
                                      setErrors((prev) => ({
                                      ...prev,
                                      trigger: true,
                                      }));
                                      isError = true;
                                  }
                                  if (!isError) {
                                      setActionTriggers((prev) => [
                                      ...prev,
                                      {
                                          actionId: actionTrigger.action,
                                          trigger: actionTrigger.trigger,
                                      },
                                      ]);
                                      setActionTrigger({
                                      action: '',
                                      trigger: '',
                                      });
                                      setErrors({
                                      action: false,
                                      trigger: false,
                                      });
                                      shouldShowForm.setValue(false);
                                      setTriggerEditingInProgress(false);
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
                                    setTriggerEditingInProgress(false);
                                    setActionTrigger({
                                        action: '',
                                        trigger: '',
                                    });
                                    setErrors({
                                        action: false,
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
                      {actionTriggers.map((i: any, index: number) => {
                          return (
                          <ActionTriggersTableRow
                              key={JSON.stringify(i) + index}
                              currentActionTrigger={{
                              action: i.actionId,
                              trigger: i.trigger,
                              }}
                              removeActionTrigger={() => {
                                setActionTriggers((prev) => {
                                    const newActionTriggers = [...prev];
                                    newActionTriggers.splice(index, 1);
                                    return newActionTriggers;
                                });
                              }}
                              updateActionTrigger={(newActionTrigger) => {
                                setActionTriggers((prev) => {
                                    const newActionTriggers = [...prev];
                                    newActionTriggers[index] = {
                                    actionId: newActionTrigger.action,
                                    trigger: newActionTrigger.trigger,
                                    };
                                    return newActionTriggers;
                                });
                                setTriggerEditingInProgress(false);
                              }}
                              actions={actions}
                              instructions={instructions}
                              triggerEditingInProgress={triggerEditingInProgress}
                              setTriggerEditingInProgress={setTriggerEditingInProgress}
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
                  No Action Triggers
              </Typography>
              </Stack>
          )}
          </Box>
      </Card>
      <ActionTriggerDialog
          open={openActionDialog}
          onClose={() => setOpenActionDialog(false)}
          instructions={instructions}
          onSubmit={(trigger) => {
            console.log(455)
            setActionTrigger((prev) => ({
                ...prev,
                trigger
            }));
          }}
      />
      </>
  );
  };

const ActionTriggersTableRow: React.FC<{
currentActionTrigger: {
    action: string;
    trigger: string;
};
removeActionTrigger: () => void;
updateActionTrigger: (newActionTrigger: { action: string; trigger: string }) => void;
triggerEditingInProgress: boolean;
setTriggerEditingInProgress: React.Dispatch<React.SetStateAction<boolean>>;
actions: IActionItem[];
instructions: string;
}> = ({ currentActionTrigger, removeActionTrigger, updateActionTrigger, triggerEditingInProgress, setTriggerEditingInProgress, actions, instructions }) => {
const popover = usePopover();
const actionEditing = useBoolean();
const [actionTrigger, setActionTrigger] = useState<{
    action: string;
    trigger: string;
}>(currentActionTrigger);
const [errors, setErrors] = useState<{
    action: boolean;
    trigger: boolean;
}>({
    action: false,
    trigger: false,
});


const [openActionDialog, setOpenActionDialog] = useState(false);

useEffect(() => {
    if (actionTrigger && actionTrigger?.trigger.trim().length > 0) {
      updateActionTrigger(actionTrigger); 
      setOpenActionDialog(false);
    }
}, [actionTrigger]);

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
            disabled={!actionEditing.value}
            value={actionTrigger.action}
            onChange={(e) => {
            setActionTrigger((prev) => ({
                ...prev,
                action: e.target.value,
            }));
            }}
            placeholder="Select a Action"
            error={errors.action}
        >
            {actions.map((actionItem) => (
            <MenuItem key={actionItem._id} value={actionItem._id}>
                {actionItem.actionName}
            </MenuItem>
            ))}
        </Field.Select>
        </TableCell>

        <TableCell
        sx={{
            verticalAlign: 'top',
        }}
        >
        {!actionEditing.value ? (
            <Typography>{actionTrigger.trigger}</Typography>
        ) : (
            <Button
            size="large"
            fullWidth
            onClick={() => {
                setOpenActionDialog(true);
            }}
            variant="contained"
            >
            Set Trigger event
            </Button>
        )}
        </TableCell>
        <TableCell align="right"> 
        {actionEditing.value ? (
            <Stack gap={2}>
            <Button
                variant="contained"
                onClick={() => {
                  let isError = false;
                  if (!actionTrigger.action) {
                      setErrors((prev) => ({
                      ...prev,
                      action: true,
                      }));
                      isError = true;
                  }
                  if (!actionTrigger.trigger || actionTrigger.trigger.trim().length < 1) {
                      setErrors((prev) => ({
                      ...prev,
                      trigger: true,
                      }));
                      isError = true;
                  }

                  if (!isError) {
                      updateActionTrigger(actionTrigger);
                      setErrors({
                      action: false,
                      trigger: false,
                      });
                      actionEditing.setValue(false);
                      setTriggerEditingInProgress(false);
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
                  setActionTrigger({
                      ...currentActionTrigger,
                  });
                  setErrors({
                      action: false,
                      trigger: false,
                  });
                  actionEditing.setValue(false);
                  setTriggerEditingInProgress(false);
                }}
            >
                Cancel
            </Button>
            </Stack>
        ) : (
            !triggerEditingInProgress && <IconButton
            onClick={(event) => {
                popover.onOpen(event);
            }}
            >
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
                  actionEditing.setValue(true);
                  popover.onClose();
                  setTriggerEditingInProgress(true);
                }}
            >
                <Iconify icon="solar:pen-bold" />
                Edit
            </MenuItem>
            <MenuItem
                onClick={() => {
                removeActionTrigger();
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
        open={openActionDialog}
        onClose={() => setOpenActionDialog(false)}
        instructions={instructions}
        onSubmit={(trigger) => {
          console.log(653)
          setActionTrigger((prev) => ({
              ...prev,
              trigger
          }));
          actionEditing.setValue(false);
        }}
    />
    </>
);
};

export default TriggerAction;