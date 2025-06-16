import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  company: Yup.string().required('Company is required'),
  role: Yup.string().required('Role is required'),
  status: Yup.string().required('Status is required'),
  appliedDate: Yup.date().required('Applied Date is required'),
  notes: Yup.string(),
  location: Yup.string(),
  salary: Yup.string(),
  jobUrl: Yup.string().url('Invalid URL'),
});

const AddJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      company: '',
      role: '',
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
      location: '',
      salary: '',
      jobUrl: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/jobs', values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Job application added successfully!');
        navigate('/dashboard'); // Or /jobs, depending on your main listing page
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to add job application.');
        toast.error(err.response?.data?.message || 'Failed to add job application.');
      }
    },
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Add New Job Application
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="company"
              name="company"
              label="Company"
              value={formik.values.company}
              onChange={formik.handleChange}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              margin="normal"
            />

            <TextField
              fullWidth
              id="role"
              name="role"
              label="Role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                label="Status"
              >
                <MenuItem value="Applied">Applied</MenuItem>
                <MenuItem value="Interview">Interview</MenuItem>
                <MenuItem value="Offer">Offer</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
              </Select>
              {formik.touched.status && formik.errors.status && (
                <Typography color="error" variant="caption">
                  {formik.errors.status}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              id="appliedDate"
              name="appliedDate"
              label="Applied Date"
              type="date"
              value={formik.values.appliedDate}
              onChange={formik.handleChange}
              error={formik.touched.appliedDate && Boolean(formik.errors.appliedDate)}
              helperText={formik.touched.appliedDate && formik.errors.appliedDate}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              id="location"
              name="location"
              label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
              margin="normal"
            />

            <TextField
              fullWidth
              id="salary"
              name="salary"
              label="Salary"
              value={formik.values.salary}
              onChange={formik.handleChange}
              error={formik.touched.salary && Boolean(formik.errors.salary)}
              helperText={formik.touched.salary && formik.errors.salary}
              margin="normal"
            />

            <TextField
              fullWidth
              id="jobUrl"
              name="jobUrl"
              label="Job URL"
              value={formik.values.jobUrl}
              onChange={formik.handleChange}
              error={formik.touched.jobUrl && Boolean(formik.errors.jobUrl)}
              helperText={formik.touched.jobUrl && formik.errors.jobUrl}
              margin="normal"
            />

            <TextField
              fullWidth
              id="notes"
              name="notes"
              label="Notes"
              multiline
              rows={4}
              value={formik.values.notes}
              onChange={formik.handleChange}
              error={formik.touched.notes && Boolean(formik.errors.notes)}
              helperText={formik.touched.notes && formik.errors.notes}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Job
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddJob; 