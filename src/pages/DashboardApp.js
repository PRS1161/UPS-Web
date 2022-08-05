import { useEffect, useState } from 'react';
// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  OverallStatus,
  // TotalDevices,
  NewDevices,
  Notification
} from '../sections/@dashboard/app';
import { dashboardAPI } from '../common/api-endpoints';
import HTTPService from '../common/httpService';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [dashboarData, setDashboarData] = useState({
    active: 0,
    inActive: 0,
    messages: [],
    devices: []
  });

  useEffect(() => {
    HTTPService.get(dashboardAPI)
      .then((res) => {
        setDashboarData(res.data);
      })
      .catch((e) => console.log(e));
  }, [setDashboarData]);

  return (
    <Page title="Dashboard | DATA MONITORING SYSTEM">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <OverallStatus status={dashboarData} />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <NewDevices devices={dashboarData.devices} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Notification messages={dashboarData.messages} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
