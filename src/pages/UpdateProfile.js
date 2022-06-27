import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Stack, TextField, Card, Container, Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { profileAPI } from '../common/api-endpoints';
import Page from '../components/Page';
import HTTPService from '../common/httpService';
import toaster from '../common/toastMessage';
import { localStorageKeys } from '../common/constants';

// ----------------------------------------------------------------------

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({ firstName: '', lastName: '', email: '' });

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string()
      .trim()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Last name required'),
    email: Yup.string()
      .trim()
      .email('Email must be a valid email address')
      .required('Email is required')
  });

  useEffect(() => {
    HTTPService.get(profileAPI)
      .then((res) => {
        setInitialValues(res.data);
      })
      .catch((e) => console.log(e));
  }, [setInitialValues]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: RegisterSchema,
    onSubmit: (values, { setSubmitting }) => {
      const submitData = {
        firstName: values.firstName,
        lastName: values.lastName
      };
      handleOnSubmit(submitData, setSubmitting);
    }
  });

  const handleOnSubmit = (data, setSubmitting) => {
    HTTPService.put(profileAPI, data)
      .then((res) => {
        setSubmitting(false);
        toaster.success(res.message);
        let storage = JSON.parse(localStorage.getItem(localStorageKeys.isLoggedIn));
        storage.firstName = data.firstName;
        storage.lastName = data.lastName;
        localStorage.setItem(localStorageKeys.isLoggedIn, JSON.stringify(storage));
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Profile | DATA MONITORING SYSTEM">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
        </Stack>

        <Card>
          <Box sx={{ px: 4, py: 4 }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="First name"
                      {...getFieldProps('firstName')}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      fullWidth
                      label="Last name"
                      {...getFieldProps('lastName')}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>

                  <TextField
                    fullWidth
                    autoComplete="username"
                    type="email"
                    label="Email address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />

                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Submit
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
