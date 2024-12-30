import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { RouterLink } from 'src/routes/components';

import { PasswordIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import API from 'src/utils/API';
import { toast } from 'sonner';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = zod.object({
  username: zod.string().min(1, { message: 'Username is required!' }),
  // .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function SplitResetPasswordView() {
  const defaultValues = { username: '' };
  const router = useRouter();

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      await API.post('/auth/forgotPassword', {
        username: data.username,
      });
      toast.success('An email has been sent to you');
      reset();
      router.push('/auth/update-password?username=' + data.username);
    } catch (error) {
      toast.error('Something went wrong');
    }
  });

  const renderHead = (
    <>
      <PasswordIcon sx={{ mx: 'auto' }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
        <Typography variant="h5">Forgot your password ?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`Please enter your username and we will email you an otp`}
        </Typography>
      </Stack>
    </>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text
        autoFocus
        name="username"
        label="Username"
        InputLabelProps={{ shrink: true }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sending OTP..."
      >
        Send OTP
      </LoadingButton>

      <Link
        component={RouterLink}
        href="/auth/login"
        color="inherit"
        variant="subtitle2"
        sx={{ mx: 'auto', alignItems: 'center', display: 'inline-flex' }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} sx={{ mr: 0.5 }} />
        Return to sign in
      </Link>
    </Stack>
  );

  return (
    <>
      {renderHead}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
