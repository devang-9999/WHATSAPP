import React, { useEffect, useState, useRef } from "react";
import "./Main.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import Avatar from '@mui/material/Avatar';
import { formatInTimeZone } from 'date-fns-tz'
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
import { ref, onValue, onDisconnect, set, serverTimestamp } from 'firebase/database';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { rtdb } from "../../components/firebase/Firebase";
import { any } from "zod";
import { text } from "stream/consumers";


type User = { id: string; username: string; email: string; };
type CurrentUser = { uid: string; email: string; };
type Message = { id: string; text: string; senderId: string; timestamp: any; };

function Main() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const currentDate = new Date();
  const timeZone = "asia/Kolkata";
  const indiaTime = formatInTimeZone(currentDate, timeZone, "HH:mm")
  console.log(indiaTime)
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuOpen = Boolean(anchorEl);
  // const [userStatus , setUserStatus] = useState();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email || "" });
      }
    });
    return () => unsub();
  }, []);

  // useEffect(()=>{
  //   if(!auth.currentUser) return;
  //   const uid = auth.currentUser.uid;
  //   const userStatusRef = ref(rtdb,`status/${uid}`);
  //   const isOnline={
  //     state : "online",
  //     lastChanged : serverTimestamp()
  //   };

  //   const isOffline={
  //     state : "offline",
  //     lastChanged : serverTimestamp()
  //   };

  //   onDisconnect(userStatusRef).set(isOffline);
  //   set(userStatusRef,isOnline)
  // },[])

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
      orderBy("timestamp", "asc")
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

  //   useEffect(()=>{
  //   const statusRef = ref(rtdb, "status");
  //   const unsub = onValue(statusRef,(snapshot)=>{
  //     const data = snapshot.val()||{};
  //     const statuses : Record<string,string>={};
  //     Object.keys(data).forEach((uid)=>{
  //       statuses[uid]=data[uid].state;
  //     });
  //     setUserStatus(statuses);
  //   });
  //   return ()=>unsub();
  // },[])


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
        timestamp: serverTimestamp(),
        time: indiaTime,
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
        <input type="text" style={{ margin: "15px", padding: "3px", border: "3px solid green", borderRadius: "5px", fontSize: "25px" }} placeholder="🔍" />
        <div className="user-list">
          {users.map((user) => (
            <div
              key={user.id}
              className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
              
              onClick={() => setSelectedUser(user)}
            >
              <div className="align">
                <Avatar>🧒</Avatar>
                <div>
                  <strong>{user.username}</strong>
                  <br />
                  <small>{user.email}</small>
                </div></div>


            </div>
          ))}
        </div>
      </div>

      <div className="chat-window">
        <AppBar position="static" sx={{ backgroundColor: "#178f6b" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" style={{fontSize:"30px", fontFamily:"cursive"}}>
              {selectedUser ? selectedUser.username : " WhatsApp"}
            </Typography>
            <IconButton color="inherit" size="large" onClick={handleMenuOpen}>
              <AccountCircle fontSize="large" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
              <MenuItem disabled>{currentUser?.email}</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "red" }}>Logout</MenuItem>
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
              
                  {/* {msg.timestamp.toDate()} */}

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