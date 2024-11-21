import React from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { Bell} from 'lucide-react'

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
      <Badge color="info">
         <Bell className="h-6 w-6 text-black" />
      </Badge>
    </IconButton>
  );
}