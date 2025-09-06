import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, List, Paper, ListItemText, Avatar, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';

function ProjectDetailPage() {
  const { id: projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/tasks`)
      .then(res => res.json())
      .then(data => {
        // Filter tasks by projectId
        setTasks(data.filter(task => String(task.project_id) === String(projectId)));
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return <Box sx={{ mt: 8, textAlign: 'center' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>Project Tasks</Typography>
      <List>
        {tasks.map(task => (
          <Paper key={task.id} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center', boxShadow: 2 }}>
            <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>{task.assignee_id ? String(task.assignee_id) : '?'}</Avatar>
            <ListItemText
              primary={<Typography variant="h6">{task.title}</Typography>}
              secondary={<Typography color="text.secondary">Due: {task.due_date || 'N/A'} | Status: {task.status}</Typography>}
            />
          </Paper>
        ))}
      </List>
      <Button variant="contained" color="primary" sx={{ mt: 2, fontWeight: 600 }}>+ Add Task</Button>
    </Box>
  );
}

export default ProjectDetailPage;
