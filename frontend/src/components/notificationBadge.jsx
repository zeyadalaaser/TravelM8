import React from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';

function notificationsLabel(count) {
  if (count === 0) {
    return 'no notifications';
  }
  if (count > 99) {
    return 'more than 99 notifications';
  }
  return `${count} notifications`;
}

export default function NotificationBadge() {
  return (
    <IconButton aria-label={notificationsLabel(100)}>
      <Badge badgeContent={100} color="info">
        <MailIcon sx={{ color: 'white' }} /> {/* Set the icon color to white */}
      </Badge>
    </IconButton>
  );
}
