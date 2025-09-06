function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('http://127.0.0.1:5000/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  const handleCreate = async () => {
    setError("");
    const owner_id = 1; // Replace with actual user ID
    const res = await fetch("http://127.0.0.1:5000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, summary, owner_id })
    });
    const data = await res.json();
    if (res.ok) {
      setProjects(prev => [...prev, data]);
      setOpen(false);
      setName("");
      setSummary("");
    } else {
      setError(data.error || "Could not create project");
    }
  };

  if (loading) {
    return <Box sx={{ mt: 8, textAlign: 'center' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>SynergySphere Projects</Typography>
      <List>
        {projects.map(project => (
          <Paper key={project.id} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center', boxShadow: 2 }}>
            <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>{project.name ? project.name[0] : '?'}</Avatar>
            <ListItemText
              primary={<Typography variant="h6">{project.name}</Typography>}
              secondary={<Typography color="text.secondary">{project.summary || 'No summary'}</Typography>}
            />
          </Paper>
        ))}
      </List>
      <Button variant="contained" color="primary" sx={{ mt: 2, fontWeight: 600 }} onClick={() => setOpen(true)}>+ New Project</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField label="Project Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Summary" fullWidth margin="normal" value={summary} onChange={e => setSummary(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardPage;
