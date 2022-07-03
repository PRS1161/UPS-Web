import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { addDeviceAPI, configurationAPI } from '../common/api-endpoints';
import Page from '../components/Page';
import HTTPService from '../common/httpService';
import toaster from '../common/toastMessage';

export default function AddDevice() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1);
  const [configuration, setConfiguration] = useState([]);

  const addDeviceSchema = Yup.object().shape({
    deviceId: Yup.string().trim().required('Device ID is required'),
    name: Yup.string().trim().required('Device Name is required'),
    location: Yup.string().trim().required('Location is required'),
    configuration: Yup.string().required('Configuration is required')
  });

  useEffect(() => {
    HTTPService.get(configurationAPI, { pagination: false }).then((res) => {
      setConfiguration(res.data);
    });
  }, [setConfiguration]);

  const formik = useFormik({
    initialValues: {
      deviceId: '',
      name: '',
      location: '',
      configuration: ''
    },
    validationSchema: addDeviceSchema,
    onSubmit: (values, { setSubmitting }) => {
      values.phase = phase;
      handleOnSubmit(values, setSubmitting);
    }
  });

  const handleOnSubmit = (data, setSubmitting) => {
    HTTPService.post(addDeviceAPI, data)
      .then((res) => {
        setSubmitting(false);
        toaster.success(res.message);
        navigate('/devices', { replace: true });
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Add Device | DATA MONITORING SYSTEM">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add Device
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
