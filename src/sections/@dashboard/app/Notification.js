import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Stack, Link, Card, Divider, Typography, CardHeader } from '@mui/material';
//
import Scrollbar from '../../../components/Scrollbar';
import Iconify from '../../../components/Iconify';
import { backgrounds } from '../../../common/constants';

// ----------------------------------------------------------------------

Notification.propTypes = {
  message: PropTypes.object.isRequired
};

function Notification({ message }) {
  const { title, description, type, deviceId, createdAt } = message;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box>
        <Iconify
          icon={type ? 'mdi:check' : 'mdi:exclamation'}
          width={40}
          height={40}
          color={type ? '#229A16' : '#FF4842'}
          sx={{
            borderRadius: 1.5,
            background: type ? backgrounds.success : backgrounds.error
          }}
        />
      </Box>
      <Box sx={{ minWidth: 240 }}>
        <Link to={`/info/${deviceId}`} color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle1" noWrap>
            {title}
          </Typography>
        </Link>
        <Typography variant="body1" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.primary' }}>
          {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function NotificationUpdate({ messages }) {
  return (
    <Card>
      <CardHeader title="Notifications" />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {messages.map((message, index) => (
            <Notification key={index} message={message} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />
    </Card>
  );
}
