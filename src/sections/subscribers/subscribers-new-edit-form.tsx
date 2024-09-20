/* eslint-disable spaced-comment */
import { z as zod } from 'zod';
import { useMemo, useEffect, Fragment } from 'react';
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
import { Button, Table, TableBody, TableCell, TableRow, TextField } from '@mui/material';
import { deleteBot } from 'src/utils/api/bots';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { TableHeadCustom } from 'src/components/table';

const CREDIT_TABLE_HEAD = [
  { id: '', label: '', width: 255 },
  { id: 'costPrice', label: 'Cost Price', width: 200 },
  { id: 'sellingPrice', label: 'Selling Price', width: 200 },
  { id: 'profit', label: 'Profit', width: 200 },
];

const CHARGE_TABLE_HEAD = [
  { id: '', label: '', width: 255 },
  { id: 'credits', label: 'Credits', width: 200 },
  { id: 'sellingCredits', label: 'Selling Credits', width: 200 },
  { id: 'profit', label: 'Profit', width: 200 },
];

export type NewBotSchemaType = zod.infer<typeof NewBotSchema>;

export const NewBotSchema = zod.object({
  planName: zod.string().min(1, { message: 'Plan name is required!' }),
  planDescription: zod.string().min(1, { message: 'Plan description is required!' }),
  creditSellingPrice: zod.number().min(0.01, { message: 'Credits sales price is required!' }),
  channelsSellingCredits: zod.number().min(1, { message: 'Channels selling credits is required!' }),
  consoleSellingCredits: zod.number().min(1, { message: 'Console selling credits is required!' }),
});

type Props = {
  currentPlan?: {
    _id: string;
    planName: string;
    planDescription: string;
    creditSellingPrice: number;
    channelsSellingCredits: number;
    consoleSellingCredits: number;
    username: string;
  };
  isUsed?: boolean;
};

export function SubscribersNewEditForm({ currentPlan, isUsed }: Props) {
  const router = useRouter();
  const alertDialog = useBoolean();
  // const actionDialog = useBoolean();
  const defaultValues = useMemo(
    () => ({
      planName: currentPlan?.planName || '',
      planDescription: currentPlan?.planDescription || '',
      creditSellingPrice: currentPlan?.creditSellingPrice || 0,
      channelsSellingCredits: currentPlan?.channelsSellingCredits || 0,
      consoleSellingCredits: currentPlan?.consoleSellingCredits || 0,
    }),
    [currentPlan]
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
    formState: { isSubmitting, errors },
    resetField,
    setValue,
    watch,
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPlan) {
      //@ts-ignore
      reset(defaultValues);
    }
  }, [currentPlan, defaultValues, reset]);

  // values.botLanguage = values.botLanguage || 'en';
  // console.log(values.botLanguage);
  const onSubmit = handleSubmit(async (data) => {
    try {
      // console.log(data);
      const url = currentPlan ? `/plans/${currentPlan._id}` : '/plans/create';
      const method = currentPlan ? API.put : API.post;
      await method(url, {
        ...data,
      });
      reset();
      toast.success(currentPlan ? 'Update success!' : 'Create success!');
      router.push('/bots');
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
      <CardHeader title="Details" subheader="Plan name, description" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Plan Name</Typography>
          <Field.Text name="planName" placeholder="Starter" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Plan Description</Typography>
          <Field.Text
            multiline
            rows={4}
            name="planDescription"
            placeholder="A starter plan for new users"
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderCreditCosts = (
    <Card>
      <CardHeader title="Credit Costs" subheader="Credit selling price" sx={{ mb: 3 }} />

      <Divider />
      <Box p={4}>
        <Card>
          <Table>
            <TableHeadCustom headLabel={CREDIT_TABLE_HEAD} />
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Credits</Typography>
                </TableCell>
                <TableCell>
                  {/* <Typography variant="subtitle2">$0.05</Typography> */}
                  <TextField value={0.05} disabled placeholder="0.15" />
                </TableCell>
                <TableCell>
                  <Field.Text name="creditSellingPrice" placeholder="0.15" />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{values.creditSellingPrice - 0.05}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Box>
    </Card>
  );

  const renderRecurringCharge = (
    <Card>
      <CardHeader
        title="Recurring Charge"
        subheader="Credits charge for channels, console, etc"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Box p={4}>
        <Card>
          <Table>
            <TableHeadCustom headLabel={CREDIT_TABLE_HEAD} />
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Channels</Typography>
                </TableCell>
                <TableCell>
                  <TextField value={15} disabled />
                </TableCell>
                <TableCell>
                  <Field.Text name="channelsSellingPrice" placeholder="1" />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{values.channelsSellingCredits - 15}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">Console</Typography>
                </TableCell>
                <TableCell>
                  <TextField value={20} disabled />
                </TableCell>
                <TableCell>
                  <Field.Text name="consoleSellingCredits" placeholder="1" />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{values.consoleSellingCredits - 20}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Box>
    </Card>
  );

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: '1100px' }}>
          {renderDetails}

          {renderCreditCosts}

          {renderRecurringCharge}

          <Box
            display="flex"
            alignItems="center"
            justifyContent={currentPlan ? 'space-between' : 'end'}
            flexWrap="wrap"
          >
            {currentPlan && (
              <Button
                onClick={async () => {
                  if (isUsed) {
                    alertDialog.setValue(true);
                  } else {
                    await deleteBot(currentPlan._id, () => {
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
              {!currentPlan ? 'Create Plan' : 'Update Plan'}
              {/* Ji */}
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
  );
}
