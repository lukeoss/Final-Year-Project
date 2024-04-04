import React, { useState } from 'react';
import { Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export default function CreateAccount() {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });

    const validateEmail = (email) => {
        if (!emailRegex.test(email)) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                email: 'Please enter a valid email address.'
            }));
            return false;
        }
        setFormErrors(prevErrors => ({
            ...prevErrors,
            email: ''
        }));
        return true;
    };

    const validateForm = (data) => {
        const isEmailValid = validateEmail(data.get('email'));
        const password = data.get('password');
        if (password.length < 8) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                password: 'Password must be at least 8 characters.'
            }));
            return false;
        } else {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                password: ''
            }));
        }
        return isEmailValid;
    };
    
    const checkEmailExists = async (email) => {
      try {
          const response = await fetch('http://localhost:8000/check-email-exists/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
          });
          const data = await response.json();
          return data.exists; // Assuming the backend returns { exists: true/false }
      } catch (error) {
          console.error('Error:', error);
          return false;
      }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if (!validateForm(data)) return;

        const emailExists = await checkEmailExists(data.get('email'));
        if (emailExists) {
            alert('Email is already in use.');
            return;
        }

        // Proceed with account creation
        // Replace fetch URL with your environment-specific URL
        fetch('http://localhost:8000/create-account/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: data.get('first_name'),
                last_name: data.get('last_name'),
                email: data.get('email'),
                password: data.get('password'),
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Account created successfully!');
                navigate('/');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Create Account
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                autoComplete="given-name"
                                name="first_name"
                                required
                                fullWidth
                                id="first_name"
                                label="First Name"
                                autoFocus
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                required
                                fullWidth
                                id="last_name"
                                label="Last Name"
                                name="last_name"
                                autoComplete="family-name"
                              />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    error={Boolean(formErrors.email)}
                                    helperText={formErrors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    error={Boolean(formErrors.password)}
                                    helperText={formErrors.password}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create Account
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Login
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
