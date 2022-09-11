import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import {
  Stack,
  TextField,
  Card,
  Container,
  Typography,
  Box,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { deviceAPI, configurationAPI } from '../common/api-endpoints';
import Page from '../components/Page';
import HTTPService from '../common/httpService';
import toaster from '../common/toastMessage';

export default function AddEditDevice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [phase, setPhase] = useState(1);
  const [initialValues, setInitialValues] = useState({
    deviceId: '',
    name: '',
    location: '',
    configuration: ''
  });
  const [configuration, setConfiguration] = useState([]);

  const addEditDeviceSchema = Yup.object().shape({
    deviceId: Yup.string().trim().required('Device ID is required'),
    name: Yup.string().trim().required('Device Name is required'),
    location: Yup.string().trim().required('Location is required'),
    configuration: Yup.string().required('Configuration is required')
  });

  useEffect(() => {
    if (id) {
      HTTPService.get(deviceAPI, { id })
        .then((res) => {
          setInitialValues(res.data);
          setPhase(res.data.phase);
        })
        .catch((e) => console.log(e));
    }
  }, [id]);

  useEffect(() => {
    HTTPService.get(configurationAPI, { pagination: false }).then((res) => {
      setConfiguration(res.data);
    });
  }, [setConfiguration]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addEditDeviceSchema,
    onSubmit: (values, { setSubmitting }) => {
      values.phase = phase;
      if (id) {
        const data = {
          name: values.name,
          location: values.location,
          configuration: values.configuration,
          phase: values.phase,
          id
        };
        values = data;
      }
      handleOnSubmit(values, setSubmitting);
    }
  });

  const handleOnSubmit = (data, setSubmitting) => {
    if (id) {
      HTTPService.put(deviceAPI, data)
        .then((res) => {
          setSubmitting(false);
          toaster.success(res.message);
          navigate('/devices', { replace: true });
        })
        .catch(() => {
          setSubmitting(false);
        });
    } else {
      HTTPService.post(deviceAPI, data)
        .then((res) => {
          setSubmitting(false);
          toaster.success(res.message);
          navigate('/devices', { replace: true });
        })
        .catch(() => {
          setSubmitting(false);
        });
    }
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title={`${id ? 'Edit' : 'Add'} Device | DATA MONITORING SYSTEM`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {id ? 'Edit' : 'Add'} Device
          </Typography>
        </Stack>
        <Card>
          <Box sx={{ px: 4, py: 4 }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Device ID"
                    {...getFieldProps('deviceId')}
                    error={Boolean(touched.deviceId && errors.deviceId)}
                    helperText={touched.deviceId && errors.deviceId}
                    disabled={Boolean(id) || false}
                  />
                  <TextField
                    fullWidth
                    label="Device Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Location"
                    {...getFieldProps('location')}
                    error={Boolean(touched.location && errors.location)}
                    helperText={touched.location && errors.location}
                  />
                  <TextField
                    fullWidth
                    select
                    label="Configuration"
                    {...getFieldProps('configuration')}
                    error={Boolean(touched.configuration && errors.configuration)}
                    helperText={touched.configuration && errors.configuration}
                  >
                    {configuration.map((config, index) => (
                      <MenuItem key={index} value={config._id}>
                        {config.attribute}KVA
                      </MenuItem>
                    ))}
                  </TextField>

                  <FormControl>
                    <FormLabel id="radio-button-group-label">Phase</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-button-group-label"
                      defaultValue={1}
                      name="phase-group"
                      value={phase}
                      onChange={(e) => setPhase(parseInt(e.target.value, 10))}
                    >
                      <FormControlLabel value={1} control={<Radio />} label="Single Phase" />
                      <FormControlLabel value={3} control={<Radio />} label="Three Phase" />
                    </RadioGroup>
                  </FormControl>

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
