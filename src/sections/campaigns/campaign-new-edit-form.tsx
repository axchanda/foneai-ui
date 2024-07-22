import type { IUserItem } from 'src/types/user';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
    //   avatarUrl: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }),
    //   name: zod.string().min(1, { message: 'Name is required!' }),
    //   email: zod
    //     .string()
    //     .min(1, { message: 'Email is required!' })
    //     .email({ message: 'Email must be a valid email address!' }),
    //   phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    //   country: schemaHelper.objectOrNull<string | null>({
    //     message: { required_error: 'Country is required!' },
    //   }),
    //   address: zod.string().min(1, { message: 'Address is required!' }),
    //   company: zod.string().min(1, { message: 'Company is required!' }),
    //   state: zod.string().min(1, { message: 'State is required!' }),
    //   city: zod.string().min(1, { message: 'City is required!' }),
    //   role: zod.string().min(1, { message: 'Role is required!' }),
    //   zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
    //   // Not required
    //   status: zod.string(),
    //   isVerified: zod.boolean(),
    campaignName: zod.string().min(1),
    campaignDescription: zod.string().min(8, { message: 'Description must be at least 8 characters' }).max(32, { message: 'Description must be at most 32 characters' }),
    linkedBot: zod.string()
});

// ----------------------------------------------------------------------

type Props = {
    currentUser?: any;
};

export function CampaignNewEditForm({ currentUser }: Props) {
    const router = useRouter();

    // const defaultValues = useMemo(
    //     () => ({
    //         status: currentUser?.status || '',
    //         avatarUrl: currentUser?.avatarUrl || null,
    //         isVerified: currentUser?.isVerified || true,
    //         name: currentUser?.name || '',
    //         email: currentUser?.email || '',
    //         phoneNumber: currentUser?.phoneNumber || '',
    //         country: currentUser?.country || '',
    //         state: currentUser?.state || '',
    //         city: currentUser?.city || '',
    //         address: currentUser?.address || '',
    //         zipCode: currentUser?.zipCode || '',
    //         company: currentUser?.company || '',
    //         role: currentUser?.role || '',
    //     }),
    //     [currentUser]
    // );

    const methods = useForm<NewUserSchemaType>({
        mode: 'onSubmit',
        resolver: zodResolver(NewUserSchema),
    });

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            toast.success(currentUser ? 'Update success!' : 'Create success!');
            router.push(paths.dashboard.user.list);
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>


                <Grid xs={12} >
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{ xs: 'repeat(1, 1fr)' }}
                        >
                            <Field.Text name="campaignName" label="Campaign name" />
                            <Field.Editor name='campaignDescription' placeholder='Campaign Description' />

                            <Field.Autocomplete
                                fullWidth
                                name="linkedBot"
                                label="Linked Bot"
                                placeholder="Choose a bot to link"
                                autoHighlight
                                options={['bot1', 'bot2']}

                            >
                                {/* {[{ label: "Bot 1", value: 'bot1' }, { label: 'Bot 2', value: 'bot2' }].map(({ label, value }) => <option value={value} key={value}>
                                    {label}
                                </option>)} */}
                            </Field.Autocomplete>


                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Create campaign' : 'Save changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    );
}
