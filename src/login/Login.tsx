import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent } from 'react'; 
import {auth , db, provider} from "../firebase/Firebase"
import {setDoc,doc} from "firebase/firestore"
import "./Login.css"

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate=useNavigate();

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    try{
        await signInWithEmailAndPassword(auth,email,password);
        console.log("User Logged in successfully");
        navigate("/dashboard")

    }
    catch(error){
        alert("Invalid username or password")
            navigate("/register")
            
    }
  };

  const handleSignin = async () => {
    try{
        await signInWithPopup(auth, provider);
        console.log("User Logged in successfully");
        navigate("/dashboard")

    }
    catch(error){
        alert("Invalid username or password")
            navigate("/register")
            
    }
  };

  return (
    <>
    <form action="" className="DesignLogin">
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            // mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar> */}
              <Typography sx={{ fontFamily: '"Dancing Script", cursive' }} variant="h3">Instagram</Typography>
          <p >Login to see photos and videos from your friends.</p>

           <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignin}
            >
              Sign in with google
            </Button>

        
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Login
            </Button>
           
            <Grid container justifyContent={"flex-end"}>
              <Grid >
                <Link to="/register">Don't have an account? Register</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      </form>
    </>
  );
};

export default Login;