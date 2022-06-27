import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Stack, Container, Typography, Grid, CardContent, Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import * as io from 'socket.io-client';
// components
import Page from '../components/Page';
import HTTPService from '../common/httpService';
import Iconify from '../components/Iconify';
import { getDeviceAPI } from '../common/api-endpoints';
import { API_URL, toastMessages, minMainVoltage, minBatteryVoltage } from '../common/constants';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(3, 0),
  marginTop: theme.spacing(3)
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.grey.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

const DEVICE_DATA = [
  {
    key: 'outputVoltage',
    label: 'Output Voltage',
    value: '0',
    measurement: 'V',
    icon: <Iconify icon="fluent:top-speed-24-filled" width={32} height={32} />
  },
  {
    key: 'currnetLoad',
    label: 'Currnet Load',
    value: '0',
    measurement: '%',
    icon: <Iconify icon="emojione-monotone:high-voltage" width={32} height={32} />
  },
  {
    key: 'mainVoltage',
    label: 'Main Voltage',
    value: '0',
    measurement: 'V',
    icon: <Iconify icon="fluent:top-speed-24-filled" width={32} height={32} />
  },
  {
    key: 'frequency',
    label: 'Frequency',
    value: '0',
    measurement: 'Hz',
    icon: <Box component="img" src="/static/icons/waves.svg" width={32} height={32} />
  },
  {
    key: 'batteryVoltage',
    label: 'Battery Voltage',
    value: '0',
    measurement: '%',
    icon: <Iconify icon="tabler:battery-charging" width={32} height={32} />
  },
  {
    key: 'currentBattery',
    label: 'Remain Battery',
    value: '0',
    measurement: '%',
    icon: <Iconify icon="tabler:battery-2" width={32} height={32} />
  },
  {
    key: 'dischargeBattery',
    label: 'Current Battery Discharge',
    value: '0',
    measurement: '%',
    icon: <Iconify icon="tabler:battery-charging-2" width={32} height={32} />
  }
];

function DeviceItem({ data }) {
  const { label, value, measurement, icon } = data;
  return (
    <Grid item xs={12} sm={6} md={3}>
      <RootStyle>
        <IconWrapperStyle>{icon}</IconWrapperStyle>
        <Typography variant="h4">{value + measurement} </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          {label}
        </Typography>
      </RootStyle>
    </Grid>
  );
}
// ----------------------------------------------------------------------

export default function DeviceInfo() {
  const [info, setInfo] = useState({});
  const [deviceData, setDeviceData] = useState(DEVICE_DATA);
  const { id } = useParams();
  let socket = io.io(API_URL || '', { path: '/socket.io' });

  const listenSocket = () => {
    socket.on('connect', () => {
      socket.on(`device_${id}`, (res) => {
        if (res.error) {
          showToastMessage('error', res.error);
        } else {
          let updatedData = deviceData.map((data) => {
            if (data.key in res) {
              return { ...data, value: res[data.key] };
            }
            return data;
          });
          if (parseFloat(res.mainVoltage) === minMainVoltage) {
            if (parseFloat(res.batteryVoltage) <= minBatteryVoltage) {
              showToastMessage('error', toastMessages.inputMainFailAndBatteryLow);
            } else {
              showToastMessage('info', toastMessages.inputMainFail);
            }
          }
          setDeviceData(updatedData);
        }
      });
    });
  };

  const showToastMessage = (type, message) => {
    if (type === 'info') {
      toast.info(message, {
        position: 'top-center',
        style: { background: '#74CAFF' },
        icon: <Iconify icon="fa:info-circle" />
      });
    } else {
      toast.error(message, {
        position: 'top-center',
        style: { background: '#FFA48D' },
        icon: <Iconify icon="fa:ban" />
      });
    }
  };

  useEffect(() => {
    HTTPService.get(getDeviceAPI, { id })
      .then((res) => {
        setInfo(res.data);
        if (res.data.data) {
          let updatedData = deviceData.map((data) => {
            if (data.key in res.data.data) {
              return { ...data, value: res.data.data[data.key] };
            }
            return data;
          });
          if (parseFloat(res.data.data.mainVoltage) === minMainVoltage) {
            if (parseFloat(res.data.data.batteryVoltage) <= minBatteryVoltage) {
              showToastMessage('error', toastMessages.inputMainFailAndBatteryLow);
            } else {
              showToastMessage('info', toastMessages.inputMainFail);
            }
          }
          setDeviceData(updatedData);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (id) {
      listenSocket();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      socket.close();
      toast.dismiss();
    };
  }, []);

  return (
    <Page title="Info | DATA MONITORING SYSTEM">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Info
          </Typography>
        </Stack>

        <Card>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item md={3}>
                <Typography variant="h6" padding="12px 12px 0px">
                  Device ID:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} padding="12px">
                  {info.deviceId}
                </Typography>
              </Grid>
              <Grid item md={3}>
                <Typography variant="h6" padding="12px 12px 0px">
                  Device Name:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} padding="12px">
                  {info.name}
                </Typography>
              </Grid>
              <Grid item md={3}>
                <Typography variant="h6" padding="12px 12px 0px">
                  Location:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} padding="12px">
                  {info.location}
                </Typography>
              </Grid>
              <Grid item md={3}>
                <Typography variant="h6" padding="12px 12px 0px">
                  Configuration:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} padding="12px">
                  {info.configuration ? `${info.configuration}KVA` : ''}
                </Typography>
              </Grid>
              <Grid item md={3}>
                <Typography variant="h6" padding="12px 12px 0px">
                  Phase:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} padding="12px">
                  {info.phase === 1 ? 'Single Phase' : 'Three Phase'}
                </Typography>
              </Grid>
              <Grid item md={3}>
                <Typography variant="h6" padding="12px 12px 0px">
                  Status:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} padding="12px">
                  {info.status === 1 ? 'Active' : 'Inactive'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Grid container spacing={3}>
          {deviceData.map((data) => (
            <DeviceItem key={data.key} data={data} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
