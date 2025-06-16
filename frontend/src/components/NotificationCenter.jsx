import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const NotificationCenter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // Join user's room
    if (user) {
      newSocket.emit('join', user.id);
    }

    // Listen for notifications
    newSocket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0); // Mark all as read when opening
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 360,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        <List sx={{ width: '100%', maxWidth: 360 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.message}
                        </Typography>
                        <br />
                        {formatDate(notification.timestamp)}
                      </>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Menu>
    </Box>
  );
};

export default NotificationCenter; 