import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./Login.css"
import Snackbar from '@mui/material/Snackbar';

import {
    Button,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormHelperText,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";

import { auth, provider } from "../firebase/Firebase";


const LoginSchema = z.object({
    email: z.string().email("Email is invalid"),
    password: z.string().min(8, "Password should be of 8 characters")
})

type LoginFormData = z.infer<typeof LoginSchema>

export default function Login() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<LoginFormData>(
        {
            resolver: zodResolver(LoginSchema),
            mode: "onChange",
        })
     const [snackbar, setSnackbar] = useState<{
  open: boolean;
  message: string;
}>({
  open: false,
  message: "",
});
   
  const showSnackbar = (
  message: string,
) => {
  setSnackbar({
    open: true,
    message,
  });
};


  const handleClose = (
  event?: React.SyntheticEvent | Event,
  reason?: string
) => {
  if (reason === "clickaway") return;
  setSnackbar({ ...snackbar, open: false });
};

    const handleLogin = async (data: LoginFormData) => {

        try {
            const { email, password } = data;
            await signInWithEmailAndPassword(auth, email, password);
            // alert("User Logged in successfully");
            showSnackbar("User Logged In Successfully")
            setTimeout(() => navigate("/dashboard"),500)

        }
        catch (error) {
            // alert("Invalid username or password")
            showSnackbar("Invalid Username Or Password")
            setTimeout(() => navigate("/register"),500)

        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            // alert("User Logged in successfully");
            showSnackbar("User Logged In Successfully")
            setTimeout(() => navigate("/dashboard"),500)

        }
        catch (error) {
            // alert("Google sign in failed")
            showSnackbar("User Logged In Successfully")
            setTimeout(() => navigate("/register"),500)
        }
    };
    
     return (
    <>
    <div className="DesignLogin">
      <Typography
        sx={{ fontFamily: '"Dancing Script", cursive' }}
        variant="h3"
      >
        Instagram
      </Typography>

      <p>Login to see photos and videos from your friends.</p>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleGoogleLogin}
      >
        Login with Google
      </Button>

      <form onSubmit={handleSubmit(handleLogin)} >
        
        
        <TextField
          sx={{ mb: 2 }}
          fullWidth
          label="Email Address"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <FormControl fullWidth error={!!errors.password}>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            sx={{ mb: 2 }}
            type={showPassword ? "text" : "password"}
            {...register("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>{errors.password?.message}</FormHelperText>
        </FormControl>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Don’t have an account? <Link to="/register">Sign up</Link>
        </Typography>
      </form>
      </div>
        <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
      />

    </>
  );
}

