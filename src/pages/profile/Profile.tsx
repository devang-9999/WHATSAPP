import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { auth, db } from "../../components/firebase/Firebase";
import { doc, getDoc, updateDoc,setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch existing profile
  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "Users", auth.currentUser!.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.username || "");
        setBio(data.bio || "");
        setPhotoURL(data.photoURL || "");
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
  if (!auth.currentUser) return;

  try {
    setLoading(true);

    await setDoc(
      doc(db, "Users", auth.currentUser.uid),
      {
        username,
        bio,
        photoURL,
        email: auth.currentUser.email,
      },
      { merge: true }
    );

    setLoading(false);
    navigate("/dashboard");
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: 360,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2}>
          Edit Profile
        </Typography>

        {/* Avatar */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            src={photoURL}
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#25D366",
              fontSize: 40,
            }}
          >
            {!photoURL && username.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        {/* Image URL */}
        <TextField
          fullWidth
          label="Profile Image URL"
          variant="outlined"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          margin="normal"
        />

        {/* Username */}
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />

        {/* Bio */}
        <TextField
          fullWidth
          label="About you"
          multiline
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          margin="normal"
        />

        {/* Save Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#25D366",
            "&:hover": { backgroundColor: "#1da851" },
          }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </Paper>
    </Box>
  );
}

export default Profile;
