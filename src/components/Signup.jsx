import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Container, Typography, Box, Link as MuiLink, Card, CardContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { publicKey, signup } from "../lib/api.js";
import JSEncrypt from "jsencrypt";
import Swal from "sweetalert2";

// Validation schema using Yup
const schema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters long'),
  confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
});

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const CONFIRM_BUTTON_COLOR = '#1976d2';

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    // Handle sign-up logic here
    try {
      let key = await publicKey();
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(key);
      let res = await signup({
        name: data.username,
        email: data.email,
        password: encrypt.encrypt(data.password),
      });
      console.log(res);
      if (res.status !== 200) {
        Swal.fire({
          title: 'Sign Up Failed',
          text: res.data,
          icon: "error",
          confirmButtonColor: CONFIRM_BUTTON_COLOR
        });
      } else {
        navigate('/');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
      <Container maxWidth="sm">
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
          <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom align="center">
                Sign Up
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    fullWidth
                    margin="normal"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    {...register('username')}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <TextField
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    sx={{ mt: 2 }}
                >
                  Sign Up
                </Button>
              </form>
              <Typography variant="body2" sx={{ mt: 2 }} align="center">
                Already have an account?{' '}
                <MuiLink component={Link} to="/" underline="hover">
                  Login here
                </MuiLink>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
  );
};

export default SignUpPage;
