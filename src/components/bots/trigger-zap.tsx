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
import { IZapItem } from 'src/types/zap';
import { set } from 'nprogress';
import { Scrollbar } from '../scrollbar';

const TABLE_HEAD = [
  { id: 'zap', label: 'Zap', width: 255 },
  { id: 'trigger', label: 'Trigger', width: 255 },
  { id: '', width: 200 },
];


const ActionTriggerDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    botInstructions: string;
    onSubmit: (action: string) => void;
  }> = ({ open, onClose, botInstructions, onSubmit }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const instructionLines = botInstructions.split('.').filter((line) => line.trim().length > 0);
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
            '.action': {
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
                  className={`action ${selectedAction === instructionLine.trim() ? 'selected' : ''}`}
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
          placeholder="Write instructions to trigger the zap"
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
            <Typography>Highlighting Bot Instructions</Typography>
          </Box>
        </Card>
      </Box>
    );
  
    const isDisabled = tab === 1 ? !selected : !selectedAction;
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Trigger the Zap by: </DialogTitle>
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

const TriggerZap: React.FC<{
  zaps: any[];
  botInstructions: string;
  zapTriggers: {
      zapId: string;
      trigger: string;
  }[];
  setZapTriggers: React.Dispatch<
      React.SetStateAction<{ zapId: string; trigger: string }[]>
  >;
}> = ({ botInstructions, zaps, zapTriggers, setZapTriggers }) => {
  const shouldShowForm = useBoolean();
  const table = useTable();
  const [triggerEditingInProgress, setTriggerEditingInProgress] = useState(false);
  const [zapTrigger, setZapTrigger] = useState<{
      zap: string;
      trigger: string;
  }>({
      zap: '',
      trigger: '',
  });
  const [errors, setErrors] = useState<{
      zap: boolean;
      trigger: boolean;
  }>({
      zap: false,
      trigger: false,
  });

  const [openActionDialog, setOpenActionDialog] = useState(false);

  useEffect(() => {
      if (zapTrigger) {
      setOpenActionDialog(false);
      }
  }, [zapTrigger]);

  return (
      <>
      <Card>
          <Stack p={3} direction="row" alignItems="start" justifyContent="space-between">
          <Stack>
              <Typography variant="h5">Trigger Zaps</Typography>
          </Stack>
          <Button
              onClick={() => {
                shouldShowForm.setValue(true);
                setTriggerEditingInProgress(true);
              }}
              variant="contained"
              disabled={triggerEditingInProgress}
          >
              Add New Zap Trigger
          </Button>
          </Stack>
          <Divider />
          <Divider />
          <Box p={4}>
          {Boolean(zapTriggers.length) || shouldShowForm.value ? (
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
                              value={zapTrigger.zap}
                              onChange={(e) => {
                                  setZapTrigger((prev) => ({
                                  ...prev,
                                  zap: e.target.value,
                                  }));
                              }}
                              placeholder="Select a Zap"
                              error={errors.zap}
                              >
                              {zaps.map((zapItem) => (
                                  <MenuItem key={zapItem._id} value={zapItem._id}>
                                  {zapItem.zapName}
                                  </MenuItem>
                              ))}
                              </Field.Select>
                          </TableCell>

                          <TableCell
                              sx={{
                              verticalAlign: 'top',
                              }}
                          >
                              {zapTrigger.trigger ? (
                              <Typography>{zapTrigger.trigger}</Typography>
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
                                  console.log('New Zap Trigger:', zapTrigger);
                                  let isError = false;
                                  if (!zapTrigger.zap) {
                                      setErrors((prev) => ({
                                      ...prev,
                                      zap: true,
                                      }));
                                      isError = true;
                                  }
                                  if (!zapTrigger.trigger || zapTrigger.trigger.trim().length < 1) {
                                      setErrors((prev) => ({
                                      ...prev,
                                      trigger: true,
                                      }));
                                      isError = true;
                                  }
                                  if (!isError) {
                                      setZapTriggers((prev) => [
                                      ...prev,
                                      {
                                          zapId: zapTrigger.zap,
                                          trigger: zapTrigger.trigger,
                                      },
                                      ]);
                                      setZapTrigger({
                                      zap: '',
                                      trigger: '',
                                      });
                                      setErrors({
                                      zap: false,
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
                                    setZapTrigger({
                                        zap: '',
                                        trigger: '',
                                    });
                                    setErrors({
                                        zap: false,
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
                      {zapTriggers.map((i: any, index: number) => {
                          return (
                          <ZapTriggersTableRow
                              key={JSON.stringify(i) + index}
                              currentZapTrigger={{
                              zap: i.zapId,
                              trigger: i.trigger,
                              }}
                              removeZapTrigger={() => {
                                setZapTriggers((prev) => {
                                    const newZapTriggers = [...prev];
                                    newZapTriggers.splice(index, 1);
                                    return newZapTriggers;
                                });
                              }}
                              updateZapTrigger={(newZapTrigger) => {
                                setZapTriggers((prev) => {
                                    const newZapTriggers = [...prev];
                                    newZapTriggers[index] = {
                                    zapId: newZapTrigger.zap,
                                    trigger: newZapTrigger.trigger,
                                    };
                                    return newZapTriggers;
                                });
                                setTriggerEditingInProgress(false);
                              }}
                              zaps={zaps}
                              botInstructions={botInstructions}
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
                  No Zap Triggers
              </Typography>
              </Stack>
          )}
          </Box>
      </Card>
      <ActionTriggerDialog
          open={openActionDialog}
          onClose={() => setOpenActionDialog(false)}
          botInstructions={botInstructions}
          onSubmit={(action) => {
            console.log(455)
            setZapTrigger((prev) => ({
                ...prev,
                trigger: action,
            }));
          }}
      />
      </>
  );
  };

const ZapTriggersTableRow: React.FC<{
currentZapTrigger: {
    zap: string;
    trigger: string;
};
removeZapTrigger: () => void;
updateZapTrigger: (newZapTrigger: { zap: string; trigger: string }) => void;
triggerEditingInProgress: boolean;
setTriggerEditingInProgress: React.Dispatch<React.SetStateAction<boolean>>;
zaps: IZapItem[];
botInstructions: string;
}> = ({ currentZapTrigger, removeZapTrigger, updateZapTrigger, triggerEditingInProgress, setTriggerEditingInProgress, zaps, botInstructions }) => {
const popover = usePopover();
const zapEditing = useBoolean();
const [zapTrigger, setZapTrigger] = useState<{
    zap: string;
    trigger: string;
}>(currentZapTrigger);
const [errors, setErrors] = useState<{
    zap: boolean;
    trigger: boolean;
}>({
    zap: false,
    trigger: false,
});


const [openActionDialog, setOpenActionDialog] = useState(false);

useEffect(() => {
    if (zapTrigger && zapTrigger?.trigger.trim().length > 0) {
      updateZapTrigger(zapTrigger); 
      setOpenActionDialog(false);
    }
}, [zapTrigger]);

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
            disabled={!zapEditing.value}
            value={zapTrigger.zap}
            onChange={(e) => {
            setZapTrigger((prev) => ({
                ...prev,
                zap: e.target.value,
            }));
            }}
            placeholder="Select a Zap"
            error={errors.zap}
        >
            {zaps.map((zapItem) => (
            <MenuItem key={zapItem._id} value={zapItem._id}>
                {zapItem.zapName}
            </MenuItem>
            ))}
        </Field.Select>
        </TableCell>

        <TableCell
        sx={{
            verticalAlign: 'top',
        }}
        >
        {!zapEditing.value ? (
            <Typography>{zapTrigger.trigger}</Typography>
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
        {zapEditing.value ? (
            <Stack gap={2}>
            <Button
                variant="contained"
                onClick={() => {
                  let isError = false;
                  if (!zapTrigger.zap) {
                      setErrors((prev) => ({
                      ...prev,
                      zap: true,
                      }));
                      isError = true;
                  }
                  if (!zapTrigger.trigger || zapTrigger.trigger.trim().length < 1) {
                      setErrors((prev) => ({
                      ...prev,
                      trigger: true,
                      }));
                      isError = true;
                  }

                  if (!isError) {
                      updateZapTrigger(zapTrigger);
                      setErrors({
                      zap: false,
                      trigger: false,
                      });
                      zapEditing.setValue(false);
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
                  setZapTrigger({
                      ...currentZapTrigger,
                  });
                  setErrors({
                      zap: false,
                      trigger: false,
                  });
                  zapEditing.setValue(false);
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
                  zapEditing.setValue(true);
                  popover.onClose();
                  setTriggerEditingInProgress(true);
                }}
            >
                <Iconify icon="solar:pen-bold" />
                Edit
            </MenuItem>
            <MenuItem
                onClick={() => {
                removeZapTrigger();
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
        botInstructions={botInstructions}
        onSubmit={(action) => {
          console.log(653)
          setZapTrigger((prev) => ({
              ...prev,
              trigger: action,
          }));
          zapEditing.setValue(false);
        }}
    />
    </>
);
};

export default TriggerZap;