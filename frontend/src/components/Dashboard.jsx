import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    accepted: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/jobs/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, color }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: `${color}.light`,
        color: `${color}.dark`
      }}
    >
      <Typography variant="h4" component="div">
        {value}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Here's an overview of your job applications
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Total Applications" value={stats.total} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Applied" value={stats.applied} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Interviews" value={stats.interview} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Offers" value={stats.offer} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Rejected" value={stats.rejected} color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Accepted" value={stats.accepted} color="success" />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 