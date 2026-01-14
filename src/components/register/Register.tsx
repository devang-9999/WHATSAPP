import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./Register.css";

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
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, provider, db } from "../firebase/Firebase";
import { setDoc, doc } from "firebase/firestore";
import Snackbar from '@mui/material/Snackbar';

const RegisterUserSchema = z
  .object({
    username: z.string().min(4, "Username should be of minimum 4 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters").refine((val) => !val.includes(" "), {
    message: "Password must not contain spaces",
  }),
    cpassword: z.string().min(8, "Confirm Password not matches the above password"),
  })
  .refine((data) => data.password === data.cpassword, {
    path: ["cpassword"],
    message: "Confirm Password and Password doesn't match",
  });

type RegisterFormData = z.infer<typeof RegisterUserSchema>;


export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
    mode: "onChange",
  });

 
  const handleRegister = async (data: RegisterFormData) => {
    try {
      const { email, password, username } = data;

      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email,
          username,
        });
      }

      reset();
      // alert("Registration Successfull")
      showSnackbar("Registration successful");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      showSnackbar("User Already Signed In");
      console.error(error);
    }
  };


  const handleSignin = async () => {
    try {
      await signInWithPopup(auth, provider);
      showSnackbar("Registration successful");
      navigate("/");
    } catch (error) {
      alert("Invalid login");
      showSnackbar("Not able to sign in with google");
      navigate("/register");
    }
  };

 
  return (
    <>
    <div className="Design">
      <Typography
        sx={{ fontFamily: '"Dancing Script", cursive' }}
        variant="h3"
      >
        Instagram
      </Typography>

      <p>Sign up to see photos and videos from your friends.</p>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleSignin}
      >
        Sign up with Google
      </Button>

      <form onSubmit={handleSubmit(handleRegister)} >
        <TextField
          sx={{ mb: 2 }}
          fullWidth
          label="Name"
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        
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

        <FormControl fullWidth error={!!errors.cpassword}>
          <InputLabel>Confirm Password</InputLabel>
          <OutlinedInput
            sx={{ mb: 2 }}
            type={showPassword ? "text" : "password"}
            {...register("cpassword")}
          />
          <FormHelperText>{errors.cpassword?.message}</FormHelperText>
        </FormControl>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Register
        </Button>

        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account? <Link to="/">Login</Link>
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
