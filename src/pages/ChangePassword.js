import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  TextField,
  Card,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { onUserLogOut } from '../store/auth/action';
import { changePasswordAPI } from '../common/api-endpoints';
import Page from '../components/Page';
import HTTPService from '../common/httpService';
import toaster from '../common/toastMessage';
import Iconify from '../components/Iconify';

export default function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const ChangePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .trim()
      .min(2, 'Too Short!')
      .max(15, 'Too Long!')
      .required('Current password is required'),
    newPassword: Yup.string()
      .trim()
      .min(2, 'Too Short!')
      .max(15, 'Too Long!')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .trim()
      .min(2, 'Too Short!')
      .max(15, 'Too Long!')
      .oneOf([Yup.ref('newPassword'), null], 'New password and confirm password must match')
      .required('Confirm password is required')
  });

  const handleShowOldPassword = () => {
    setShowOldPassword((show) => !show);
  };

  const handleShowNewPassword = () => {
    setShowNewPassword((show) => !show);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: (values, { setSubmitting }) => {
      const submitData = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      };
      handleOnSubmit(submitData, setSubmitting);
    }
  });

  const handleOnSubmit = (data, setSubmitting) => {
    HTTPService.put(changePasswordAPI, data)
      .then((res) => {
        setSubmitting(false);
        toaster.success(res.message);
        localStorage.clear();
        dispatch(onUserLogOut());
        navigate('/login', { replace: true });
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Change Password | DATA MONITORING SYSTEM">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Change Password
          </Typography>
        </Stack>

        <Card>
          <Box sx={{ px: 4, py: 4 }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    type={showOldPassword ? 'text' : 'password'}
                    fullWidth
                    label="Current Password"
                    {...getFieldProps('oldPassword')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowOldPassword} edge="end">
                            <Iconify icon={showOldPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.oldPassword && errors.oldPassword)}
                    helperText={touched.oldPassword && errors.oldPassword}
                  />

                  <TextField
                    type={showNewPassword ? 'text' : 'password'}
                    fullWidth
                    label="New Password"
                    {...getFieldProps('newPassword')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowNewPassword} edge="end">
                            <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.newPassword && errors.newPassword)}
                    helperText={touched.newPassword && errors.newPassword}
                  />

                  <TextField
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    label="Confirm Password"
                    {...getFieldProps('confirmPassword')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowConfirmPassword} edge="end">
                            <Iconify
                              icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                            />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />

                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Reset
                  </LoadingButton>
                </Stack>
              </Form>
            </FormikProvider>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
