import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Switch, FormControlLabel, Avatar, Divider, CircularProgress } from '@mui/material';

function ProfilePage() {
  const userId = 1; // Replace with actual logged-in user ID
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setNotifications(data.notifications);
        setLoading(false);
      });
  }, [userId]);

  const handleToggle = () => {
    const newPref = !notifications;
    setNotifications(newPref);
    fetch(`http://127.0.0.1:5000/users/${userId}/notifications`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notifications: newPref })
    });
  };

  if (loading) {
    return <Box sx={{ mt: 8, textAlign: 'center' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, boxShadow: 4, borderRadius: 3, bgcolor: '#f9f9f9' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mr: 2 }}>{profile.name ? profile.name[0] : '?'}</Avatar>
        <Box>
          <Typography variant="h6">{profile.name}</Typography>
          <Typography color="text.secondary">{profile.email}</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <FormControlLabel
        control={<Switch checked={notifications} onChange={handleToggle} color="primary" />}
        label="Enable Notifications"
        sx={{ mt: 2 }}
      />
      <Button variant="contained" color="secondary" fullWidth sx={{ mt: 3 }}>Logout</Button>
    </Box>
  );
}

export default ProfilePage;
