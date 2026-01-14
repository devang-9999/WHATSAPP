import React, { useEffect, useState } from "react";
import "./Main.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../components/firebase/Firebase";
import { signOut } from "firebase/auth";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

type User = {
  id: string;
  username: string;
  email: string;
};

type CurrentUser = {
  uid: string;
  email: string;
};

function Main() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (auth.currentUser) {
      setCurrentUser({
        uid: auth.currentUser.uid,
        email: auth.currentUser.email || "",
      });
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "Users"));
      const currentUserId = auth.currentUser?.uid;

      const usersList: User[] = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">),
        }))

        .filter((user) => user.id !== currentUserId);

      setUsers(usersList);
    };

    fetchUsers();
  }, []);


  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    console.log("Message sent:", message);
    setMessage("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <div className="whatsapp-app">

      <div className="sidebar">
        <div className="sidebar-header">Users</div>

        <div className="user-list">
          {users.map((user) => (
            <div
              key={user.id}
              className={`user-item ${selectedUser?.id === user.id ? "active" : ""
                }`}
              onClick={() => setSelectedUser(user)}
            >
              <strong>{user.username}</strong>
              <br />
              <small>{user.email}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-window">
        <AppBar position="static" sx={{ backgroundColor: "#178f6b" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

            <Typography variant="h6">
              {selectedUser ? selectedUser.username : "Select a user"}
            </Typography>


            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <AccountCircle />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                <strong>My Account</strong>
              </MenuItem>

              <MenuItem disabled>{currentUser?.email}</MenuItem>

              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleLogout();
                }}
                sx={{ color: "red" }}
              >
                Logout
              </MenuItem>
            </Menu>

          </Toolbar>
        </AppBar>

        <div className="chat-messages">
          {selectedUser ? (
            <p>Hello </p>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>

        <div className="chat-input">

          <IconButton onClick={() => setShowEmojiPicker((prev) => !prev)}>
            <SentimentSatisfiedAltIcon />
          </IconButton>


          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />


          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </div>


        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

      </div>
    </div>
  );
}

export default Main;
