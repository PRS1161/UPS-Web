import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider, FieldArray, ErrorMessage } from 'formik';
import { Stack, TextField, Card, Container, Typography, Box, Button, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { configurationAPI } from '../common/api-endpoints';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import HTTPService from '../common/httpService';
import toaster from '../common/toastMessage';

export default function AddEditConfiguration() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({ attribute: '', settings: [{ key: '' }] });
  const errorClass = {
    color: '#FF4842',
    fontSize: '0.75rem',
    fontWeight: 400,
    textAlign: 'left',
    marginTop: '3px',
    marginRight: '14px',
    marginBottom: '0',
    marginLeft: '14px'
  };

  const configurationSchema = Yup.object().shape({
    attribute: Yup.number().integer().required('Attribute is required'),
    settings: Yup.array().of(
      Yup.object().shape({ key: Yup.number().integer().required('Setting is required') })
    )
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
      if (id) {
        const data = { attribute: values.attribute, settings: values.settings, id };
        values = data;
      }
      handleOnSubmit(values, setSubmitting);
    }
  });

  const handleOnSubmit = (data, setSubmitting) => {
    if (id) {
      HTTPService.put(configurationAPI, data)
        .then((res) => {
          setSubmitting(false);
          toaster.success(res.message);
          navigate('/configuration', { replace: true });
        })
        .catch(() => {
          setSubmitting(false);
        });
    } else {
      HTTPService.post(configurationAPI, data)
        .then((res) => {
          setSubmitting(false);
          toaster.success(res.message);
          navigate('/configuration', { replace: true });
        })
        .catch(() => {
          setSubmitting(false);
        });
    }
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values, setFieldValue } =
    formik;

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
                    type="number"
                    fullWidth
                    label="Attribute"
                    {...getFieldProps('attribute')}
                    error={Boolean(touched.attribute && errors.attribute)}
                    helperText={touched.attribute && errors.attribute}
                  />
                  <FieldArray
                    name="settings"
                    render={(arrayHelpers) => {
                      return values.settings.map((s, i) => {
                        return (
                          <Grid container key={i}>
                            <Grid item xs={12} md={10}>
                              <TextField
                                type="number"
                                fullWidth
                                name={`settings[${i}].key`}
                                key={i}
                                label="Settings"
                                value={s.key}
                                error={Boolean(touched.settings?.[i] && errors.settings?.[i])}
                                onChange={(e) =>
                                  setFieldValue(`settings[${i}].key`, e.target.value)
                                }
                              />
                              <ErrorMessage
                                name={`settings[${i}].key`}
                                render={(msg) => <p style={errorClass}> {msg}</p>}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              {values.settings.length !== 1 && (
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => arrayHelpers.remove(i)}
                                  sx={{ marginLeft: '10px' }}
                                >
                                  <Iconify icon="eva:minus-fill" width={24} height={24} />
                                </Button>
                              )}
                              {values.settings.length - 1 === i && (
                                <Button
                                  variant="contained"
                                  onClick={() => arrayHelpers.push({ key: '' })}
                                  sx={{ marginLeft: '10px' }}
                                  disabled={values.settings[values.settings.length - 1].key === ''}
                                >
                                  <Iconify icon="eva:plus-fill" width={24} height={24} />
                                </Button>
                              )}
                            </Grid>
                          </Grid>
                        );
                      });
                    }}
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
