import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';

function LinkTab(props) {
  return <Tab component={Link} to={props.href} {...props} />;
}

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`
  };
}

export default function NavbarTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
      <LinkTab label="Dashboard" iconPosition="start" href="/dashboard" {...a11yProps(0)} />
      <LinkTab label="Device" iconPosition="start" href="/devices" {...a11yProps(1)} />
    </Tabs>
  );
}
