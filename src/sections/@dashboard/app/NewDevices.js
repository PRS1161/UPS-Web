import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { sentenceCase } from 'change-case';
// material
import {
  Stack,
  Card,
  CardHeader,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead
} from '@mui/material';
//
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'devicdId', label: 'ID', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'configuration', label: 'Configuration', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false }
];
// ----------------------------------------------------------------------
NewDevice.propTypes = {
  device: PropTypes.object.isRequired
};

function NewDevice({ device }) {
  const navigate = useNavigate();
  const { _id, deviceId, name, location, configuration, status } = device;
  return (
    <TableRow
      hover
      key={_id}
      tabIndex={-1}
      onClick={() => {
        navigate(`/info/${_id}`);
      }}
      style={{ cursor: 'pointer' }}
    >
      <TableCell align="left">{deviceId}</TableCell>
      <TableCell align="left">{name}</TableCell>
      <TableCell align="left">{configuration}KVA</TableCell>
      <TableCell align="left">{location}</TableCell>
      <TableCell align="left">
        <Label variant="ghost" color={(status === 0 && 'error') || 'success'}>
          {sentenceCase(status === 0 ? 'inactive' : 'active')}
        </Label>
      </TableCell>
    </TableRow>
  );
}

export default function NewDevices({ devices }) {
  return (
    <Card>
      <CardHeader title="Recent New Devices Added" />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((header) => (
                    <TableCell key={header.id} align={header.alignRight ? 'right' : 'left'}>
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((device, index) => (
                  <NewDevice key={index} device={device} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Scrollbar>
    </Card>
  );
}
