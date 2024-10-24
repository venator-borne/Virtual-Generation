import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Container, Typography, Box, Link as MuiLink, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { login, publicKey } from "../lib/api.js";
import JSEncrypt from "jsencrypt";
import Swal from "sweetalert2";

const schema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters long'),
});

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const CONFIRM_BUTTON_COLOR = '#1976d2';

  const onSubmit = async (data) => {
    try {
      let key = await publicKey();
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(key);
      let res = await login(data.email, encrypt.encrypt(data.password));
      if (res) {
        window.location.href = "/app";
      } else {
        Swal.fire({
          title: "Login Failed",
          text: "Incorrect Email or Password",
          icon: "error",
          confirmButtonColor: CONFIRM_BUTTON_COLOR
        });
      }
    } catch (e) {
      Swal.fire({
        title: "Login Failed",
        text: "Internal Server Error",
        icon: "error",
        confirmButtonColor: CONFIRM_BUTTON_COLOR
      });
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
                Login
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
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
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    sx={{ mt: 2 }}
                >
                  Login
                </Button>
              </form>

              <Typography variant="body2" sx={{ mt: 2 }} align="center">
                Don&#39;t have an account?{' '}
                <MuiLink component={Link} to="/signup" underline="hover">
                  Sign up here
                </MuiLink>
              </Typography>

              <Typography variant="body2" sx={{ mt: 2 }} align="center">
                Or sign in using
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
  );
};

export default LoginPage;
