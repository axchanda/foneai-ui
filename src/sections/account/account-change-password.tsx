import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import API from 'src/utils/API';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export type ChangePassWordSchemaType = zod.infer<typeof ChangePassWordSchema>;

export const ChangePassWordSchema = zod
  .object({
    oldPassword: zod
      .string()
      .min(1, { message: 'Password is required!' })
      .min(8, { message: 'Password must be at least 8 characters!' })
      .max(20, { message: 'Password must be at most 20 characters!' }),
    newPassword: zod
      .string().min(1, { message: 'New password is required!' })
      .min(8, { message: 'New Password must be at least 8 characters!' })
      .max(20, { message: 'New Password must be at most 20 characters!' }),
    confirmNewPassword: zod
      .string()
      .min(1, { message: 'Confirm New password is required!' })
      .min(8, { message: 'Confirm New Password must be at least 8 characters!' })
      .max(20, { message: 'Confirm New Password must be at most 20 characters!' })
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different than old password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match!',
    path: ['confirmNewPassword'],
  })
  .refine(
    (data) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.newPassword),
    {
      message:
        'Password must be minimum 8+ and must contain one uppercase, one number & one special character.',
    }
  );

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const password = useBoolean();
  const router = useRouter();

  const defaultValues = { oldPassword: '', newPassword: '', confirmNewPassword: '' };

  const methods = useForm<ChangePassWordSchemaType>({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const {data: changePasswordData} = await API.post('/auth/changePassword', data);
      reset();
      toast.success(changePasswordData.message);
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column', width: '60%', alignContent: 'center' }}>
        <Field.Text
          name="oldPassword"
          type={password.value ? 'text' : 'password'}
          label="Old password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Field.Text
          name="newPassword"
          label="New password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be minimum
              8+ and must contain one uppercase, one number & one special character.
            </Stack>
          }
        />

        <Field.Text
          name="confirmNewPassword"
          type={password.value ? 'text' : 'password'}
          label="Confirm new password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Change Password
        </LoadingButton>
      </Card>
    </Form>
  );
}
