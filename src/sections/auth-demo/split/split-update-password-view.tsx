import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { SentIcon } from 'src/assets/icons';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import API from 'src/utils/API';
import { toast } from 'sonner';
// urlparams search
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useRouter } from 'src/routes/hooks';
export function SplitUpdatePasswordView() {
  const [step, setStep] = useState<"enterOTP" | "updatePassword">("enterOTP");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordVisible = useBoolean(false);
  const [error, setError] = useState("");
  const searchParams = new URLSearchParams(window.location.search);
  const username =  searchParams.get('username');
  const router = useRouter();
  const isSubmittingOTP = useBoolean(false);
  const isSubmittingPassword = useBoolean(false);
  // Regex for password validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  // Mock API call for verifying code
  const verifyCode = async (code: string) => {
    try {
      isSubmittingOTP.onTrue();
      if(!username) {
        throw new Error('Username is required');
      }
      if(Number(code) < 100000 || Number(code) > 999999 || isNaN(Number(code))) {
        throw new Error('Invalid OTP');
      }

      const response = await API.post('/auth/verify-otp', {
        username,
        otp: Number(code)
      });

      console.log(response);
      if(response.data && response.status === 200) {
        toast.success('OTP verified successfully');
        isSubmittingOTP.onFalse();
        setStep("updatePassword");
      }
    } catch (error) {
      toast.error('Invalid OTP');
      isSubmittingOTP.onFalse();
    }
  };

  // Mock API call for updating password
  const updatePasswordAPI = async (password: string, confirmPassword: string) => {
    try {
      isSubmittingPassword.onTrue();
      if(!username) {
        throw new Error('Username is required');
      }
      if(!password) {
        throw new Error('Password is required');
      }
      if(!confirmPassword) {
        throw new Error('Confirm password is required');
      }
      if(password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const response = await API.post('/auth/update-password', {
        username,
        password,
        confirmPassword
      });

      console.log(response);
      if(response.data && response.status === 200) {
        isSubmittingPassword.onFalse();
        toast.success('Password updated successfully');
      } else {
        isSubmittingPassword.onFalse();
        toast.error('Failed to update password');
      }
    } catch (error) {
      isSubmittingPassword.onFalse();
      toast.error('Failed to update password');
      throw new Error('Failed to update password');
    }
  };

  // Handle code submission
  const handleOTPSubmit = async () => {
    setError("");
    try {
      await verifyCode(code);
    } catch (err) {
      setError(String(err));
    }
  };

  const handleCodeChange = (e: any) => {
    setCode(e);
  }

  // Handle password update
  const handlePasswordUpdate = async () => {
    setError("");
    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be 8-20 characters long, include at least 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await updatePasswordAPI(newPassword, confirmPassword);
      router.push('/auth/login');
    } catch (err) {
      setError("Failed to update password. Please try again.");
    }
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 600, margin: "auto" }}>
      <Form methods={useForm()}>
      {step === "enterOTP" && (

        <Stack spacing={3}>
          <SentIcon sx={{ mx: 'auto' }} />
          <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
            <Typography variant="h5">Request sent successfully!</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {`We've sent a 6-digit OTP to your email. \nPlease enter the OTP in below box to verify your email.`}
            </Typography>
          </Stack>
          <Field.Text
            name="username"
            label="Username"
            placeholder="Username"
            InputLabelProps={{ shrink: true }}
            value={username}
            disabled
          />
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            {`Please enter the 6-digit code sent to `}
            <br />
            <b>
            {username}
            </b>
          </Typography>
          <Field.Code name="code" value={code} onChange={handleCodeChange} />
          <LoadingButton
            fullWidth
            size="large"
            onClick={handleOTPSubmit}
            variant="contained"
            loading={isSubmittingOTP.value}
            loadingIndicator="Verifying OTP..."
          >
            Verify OTP
          </LoadingButton>
          {/* <Typography variant="body2" sx={{ mx: 'auto' }}>
            {`Don’t have a code? `}
            <Link variant="subtitle2" sx={{ cursor: 'pointer' }}>
              Resend code
            </Link>
          </Typography> */}
        </Stack>
      )}

      {step === "updatePassword" && (
        <Stack spacing={3} sx={{ minWidth: 500 }}>
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Reset your password
          </Typography>
          <Field.Text
            name="newPassword"
            label="New password"
            type={passwordVisible.value ? 'text' : 'password'}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            inputProps={{
              pattern: passwordRegex.source,
              title: "Password must be 8-20 characters long, include at least 1 uppercase letter, 1 number, and 1 special character."
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => passwordVisible.onToggle()}>
                    <Iconify icon={ passwordVisible.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Field.Text
            name="confirmPassword"
            label="Confirm password"
            type={passwordVisible.value ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            inputProps={{
              pattern: passwordRegex.source,
              title: "Password must be 8-20 characters long, include at least 1 uppercase letter, 1 number, and 1 special character."
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => passwordVisible.onToggle()}>
                    <Iconify icon={ passwordVisible.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center' }}>
            {error}
          </Typography>
          <LoadingButton
            fullWidth
            size="large"
            onClick={handlePasswordUpdate}
            variant="contained"
            loading={isSubmittingPassword.value}
            loadingIndicator="Updating password..."
          >

            Update password
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
      )}
      </Form>
    </Stack>
  );
};
