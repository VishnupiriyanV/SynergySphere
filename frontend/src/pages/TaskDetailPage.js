import React, { useEffect, useState } from 'react';
import { Typography, Box, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';

function TaskDetailPage() {
  const { id: taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`)
      .then(res => res.json())
      .then(data => {
        setTask(data);
        setLoading(false);
      });
  }, [taskId]);

  if (loading) {
    return <Box sx={{ mt: 8, textAlign: 'center' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Task Details</Typography>
      <TextField label="Title" fullWidth margin="normal" value={task.title || ''} InputProps={{ readOnly: true }} />
      <TextField label="Description" fullWidth margin="normal" multiline rows={3} value={task.description || ''} InputProps={{ readOnly: true }} />
      <TextField label="Assignee ID" fullWidth margin="normal" value={task.assignee_id || ''} InputProps={{ readOnly: true }} />
      <TextField label="Due Date" type="date" fullWidth margin="normal" value={task.due_date || ''} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />
      <TextField label="Status" select fullWidth margin="normal" value={task.status || ''} InputProps={{ readOnly: true }}>
        <MenuItem value="Open">Open</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </TextField>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>Edit</Button>
    </Box>
  );
}

export default TaskDetailPage;
