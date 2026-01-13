import React from 'react'
import "./Main.css"

function Main() {
  return (
<div className="whatsapp-app">
      <div className="sidebar">
        <div className="sidebar-header">Users</div>
        <div className="user-list">
        </div>
      </div>

      <div className="chat-window">
        <div className="chat-header"></div>
        <div className="chat-messages">
          <p>Hello i am devang</p>
        </div>
        <div className="chat-input">
          <input type="text" placeholder="Type a message..." />
        </div>
      </div>
    </div>

  )
}

export default Main
