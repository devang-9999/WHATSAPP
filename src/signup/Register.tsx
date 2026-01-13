import {
  // Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, provider, db } from "../firebase/Firebase"
import { FormEvent } from 'react';
import { setDoc, doc } from "firebase/firestore"
import { signInWithPopup } from "firebase/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "./Register.css"
import {
  FormControl, InputLabel, OutlinedInput, InputAdornment,
  IconButton, FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const registerUserSchema = z.object({
  username: z.string().min(5, "Username must be at least 5 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  cpassword: z.string().min(8, "Confirm Password is required")
});


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const navigate = useNavigate();
 

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      cpassword: ""
    }
  });


  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user)
      console.log("User registered successfully")
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          username: name,
          password: cpassword,
        })

      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleSignin = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("User Logged in successfully");
      alert("User Logged in successfully"   )
      navigate("/")

    }
    catch (error) {
      alert("Invalid username or password")
      navigate("/register")

    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: FormEvent) => {
    event.preventDefault(); 
  };

  return (
    <>
      <form action="submit" onSubmit={handleRegister} className="Design">
        <Container maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              // mt: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar> */}
            <Typography sx={{ fontFamily: '"Dancing Script", cursive' }} variant="h3">Instagram</Typography>
            <p >Sign up to see photos and videos from your friends.</p>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignin}
            >
              Sign up with google
            </Button>

            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    // name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                    value={name}
                    {...register("username")}
                    onChange={(e) => setName(e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username?.message}

                  />

                </Grid>

                <Grid size={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    // name="email"
                    {...register("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
                {/* <Grid size={12}>
  
                <TextField
                  required
                  fullWidth
                  // name="password"
                  {...register("password")}
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                
              </Grid> */}
                <Grid size={12}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!errors.password}
                  >
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      {...register("password")}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                        value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  
                    />

                    {errors.password && (
                      <FormHelperText>{errors.password.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>


                {/* <Grid size={12}>
                  <TextField
                    required
                    fullWidth
                    // name="Confirm Password"
                    {...register("cpassword")}
                    label="Confirm Password"
                    type="password"
                    id="cpassword"
                    //  onKeyDown={handleKeyDown}
                    value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                    error={!!errors.cpassword}
                    helperText={errors.cpassword?.message}
                  />
                </Grid>
              </Grid> */}

                    <Grid size={12}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!errors.password}
                  >
                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      {...register("cpassword")}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                       value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                    />

                    {errors.password && (
                      <FormHelperText>{errors.password.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>


              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                type="submit"
              >
                Register
              </Button>


              <Grid container justifyContent="flex-end">
                <Grid >
                  <Link style={{ textAlign: "center" }} to="/">Have a account? Log In</Link>
                </Grid>
              </Grid>
                 </Grid>
            </Box>
          </Box>

        </Container>
      </form>

    </>
  );
};

export default Register;