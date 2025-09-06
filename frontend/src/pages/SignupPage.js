import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Alert, Link } from '@mui/material';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    setError('');
    setSuccess(false);
    const res = await fetch('http://127.0.0.1:5000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
      // TODO: Redirect to login or dashboard
    } else {
      setError(data.error || 'Signup failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>Sign Up</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Registration successful!</Alert>}
      <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSignup}>Sign Up</Button>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Link href="/">Back to Login</Link>
      </Box>
    </Box>
  );
}

export default SignupPage;
