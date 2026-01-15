import React, { useEffect, useState, useRef } from "react";
import "./Main.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import Avatar from '@mui/material/Avatar';
import TextField from "@mui/material/TextField";

// import { formatInTimeZone } from 'date-fns-tz'
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../../components/firebase/Firebase";
import { signOut } from "firebase/auth";
import { ref, onValue, onDisconnect, set } from 'firebase/database';
import { serverTimestamp } from 'firebase/database';
import { serverTimestamp as fsServerTimetamp } from "firebase/firestore";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { rtdb } from "../../components/firebase/Firebase";
import { any } from "zod";
import { text } from "stream/consumers";
import { useNavigate } from "react-router-dom";

type User = { id: string; username: string; email: string; photoURL?: string; };
type CurrentUser = { uid: string; email: string; };
type Message = { id: string; text: string; senderId: string; timestamp: any; createdAt: any; };

function Main() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [userStatus, setUserStatus] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email || "" });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);


  const displayedUsers = users.filter((user) =>
    user.username.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );


  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;

    const userStatusRef = ref(rtdb, `status/${uid}`);
    const connectedRef = ref(rtdb, ".info/connected");

    const onlineStatus = {
      state: "online",
      lastChanged: serverTimestamp(),
    };

    const offlineStatus = {
      state: "offline",
      lastChanged: serverTimestamp(),
    };

    const unsubscribe = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) return;

      // Set offline when user disconnects
      onDisconnect(userStatusRef).set(offlineStatus);

      // Set online when connected
      set(userStatusRef, onlineStatus);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "Users"));
      const currentUserId = auth.currentUser?.uid;
      const usersList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
        .filter((user) => user.id !== currentUserId);
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const uniqueChatId = [currentUser.uid, selectedUser.id].sort().join("_");
    const q = query(
      collection(db, "chatRoom", uniqueChatId, "messages"),
      orderBy("createdAt", "asc")
    );


    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMsgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMsgs);
    });

    return () => unsubscribe();
  }, [selectedUser, currentUser]);

  // const stringAvatar = (name: string) => {
  //   return {
  //     children: name ? name.charAt(0).toUpperCase() : "?",
  //   };
  // };

  useEffect(() => {
    const statusRef = ref(rtdb, "status");

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val() || {};
      const statuses: Record<string, string> = {};

      Object.keys(data).forEach((uid) => {
        statuses[uid] = data[uid].state;
      });

      setUserStatus(statuses);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser || !selectedUser) return;

    const uniqueChatId = [currentUser.uid, selectedUser.id].sort().join("_");

    try {
      const currentMsg = message;
      setMessage("");

      await addDoc(collection(db, "chatRoom", uniqueChatId, "messages"), {
        text: currentMsg,
        senderId: currentUser.uid,
        // timestamp: serverTimestamp(),
        time: fsServerTimetamp(),
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //  console.log(serverTimestamp)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleEmojiClick = (emojiData: EmojiClickData) => setMessage((prev) => prev + emojiData.emoji);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) { console.error(error); }
  };

  console.log(selectedUser);

  return (
    <div className="whatsapp-app">
      <div className="sidebar">
        <div className="sidebar-header" style={{ fontSize: "30px", fontFamily: "cursive" }}>Users</div>
        <input
          type="text"
          placeholder="🔍 Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            margin: "15px",
            padding: "6px",
            border: "2px solid green",
            borderRadius: "5px",
            fontSize: "18px",
            width: "90%",
          }}
        />


        <div className="user-list">
          {displayedUsers.map((user) => (
            <div
              key={user.id}
              className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="align">
                <Avatar sx={{ bgcolor: "#15e461" }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>

                <div>
                  <strong>{user.username}</strong>
                  <br />
                  <small>{user.email}</small>
                </div>

                <span
                  className={`status-dot ${userStatus[user.id] === "online" ? "online" : "offline"
                    }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-window">
        <AppBar position="static" sx={{ backgroundColor: "#178f6b" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" style={{ fontSize: "32px", fontFamily: "cursive", fontWeight:"bold" }}>
              {selectedUser ? selectedUser.username : " WhatsApp"}
            </Typography>
            <IconButton color="inherit" size="large" onClick={handleMenuOpen}>
              <AccountCircle fontSize="large" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
              <MenuItem disabled>{currentUser?.email}</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "red" }}>Logout</MenuItem>
              <MenuItem onClick={()=>navigate("/profile")}>  Profile</MenuItem>
              
               

            </Menu>
          </Toolbar>
        </AppBar>

        <div className="chat-messages">
          {selectedUser ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-bubble ${msg.senderId === currentUser?.uid ? "sent" : "received"}`}
                >
                  {msg.text}
                  <small className="message-time" style={{ marginLeft: "10px" }}>
                    {msg.createdAt &&
                      msg.createdAt.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </small>
                </div>
              ))}
              <div ref={scrollRef} />
            </>
          ) : (
            <div className="no-chat-selected" style={{ fontSize: "30px", textAlign: "center", marginTop: "10px" }}>Welcome !!! </div>
          )}
        </div>

        {selectedUser && (
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
        )}

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