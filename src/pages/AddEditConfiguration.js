import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Stack, TextField, Card, Container, Typography, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { configurationAPI } from '../common/api-endpoints';
import Page from '../components/Page';
import HTTPService from '../common/httpService';
import toaster from '../common/toastMessage';

export default function AddEditConfiguration() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({ attribute: '', settings: '' });

  const configurationSchema = Yup.object().shape({
    attribute: Yup.number().integer().required('Attribute is required'),
    settings: Yup.object().required('Settings is required')
  });

  useEffect(() => {
    if (id) {
      HTTPService.get(configurationAPI, { id })
        .then((res) => {
          setInitialValues(res.data);
        })
        .catch((e) => console.log(e));
    }
  }, [id]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: configurationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleOnSubmit(values, setSubmitting);
    }
  });

  const handleOnSubmit = (data, setSubmitting) => {
    HTTPService.post(configurationAPI, data)
      .then((res) => {
        setSubmitting(false);
        toaster.success(res.message);
        navigate('/configuration', { replace: true });
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title={`${id ? 'Edit' : 'Add'} Configuration | DATA MONITORING SYSTEM`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {id ? 'Edit' : 'Add'} Configuration
          </Typography>
        </Stack>
        <Card>
          <Box sx={{ px: 4, py: 4 }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Attribute"
                    {...getFieldProps('attribute')}
                    error={Boolean(touched.attribute && errors.attribute)}
                    helperText={touched.attribute && errors.attribute}
                  />
                  <TextField
                    fullWidth
                    label="Settings"
                    {...getFieldProps('settings')}
                    error={Boolean(touched.settings && errors.settings)}
                    helperText={touched.settings && errors.settings}
                  />
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Save
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
