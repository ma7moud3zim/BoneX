import React from 'react'
import './chatpage.css'
function Chatpage() {
  return (
    <div class="main-wrapper">
   
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>Message</h2>
        <p>Recent chat</p>
        <div class="search-container">
          <span class="material-icons">search</span>
          <input type="text" placeholder="Search..." oninput="filterChats(this.value)"/>
        </div>
      </div>
      <div class="chat-list" id="chatList">
        <div class="chat-item">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar" />
          <div class="chat-info">
            <div class="top-row">
              <span class="name">Jone martin</span>
              <span class="status">Ongoing call</span>
            </div>
            <div class="bottom-row">
              <span class="time">25:09</span>
            </div>
          </div>
        </div>
        <div class="chat-item">
          <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Avatar"/>
          <div class="chat-info">
            <div class="top-row">
              <span class="name">Marcelo</span>
              <span class="time">Yesterday</span>
            </div>
            <div class="bottom-row">
              <span class="snippet">I hope you get well soon</span>
              <span class="date">25:09</span>
            </div>
          </div>
        </div>
        <div class="chat-item">
          <img src="https://randomuser.me/api/portraits/men/77.jpg" alt="Avatar"/>
          <div class="chat-info">
            <div class="top-row">
              <span class="name">Nacho Fernández</span>
              <span class="time">01/17/25</span>
            </div>
            <div class="bottom-row">
              <span class="snippet">25:09</span>
            </div>
          </div>
        </div>
        <div class="chat-item">
          <img src="https://randomuser.me/api/portraits/men/12.jpg" alt="Avatar"/>
          <div class="chat-info">
            <div class="top-row">
              <span class="name">Luka Modrić </span>
              <span class="time">05/12/25</span>
            </div>
            <div class="bottom-row">
              <span class="snippet">25:09</span>
            </div>
          </div>
        </div>
        <div class="chat-item">
          <img src="https://randomuser.me/api/portraits/men/66.jpg" alt="Avatar"/>
          <div class="chat-info">
            <div class="top-row">
              <span class="name">Jude Bellingham</span>
              <span class="time">05/12/25</span>
            </div>
            <div class="bottom-row">
              <span class="snippet">25:09</span>
            </div>
          </div>
        </div>
        <div class="chat-item">
          <img src="https://randomuser.me/api/portraits/men/47.jpg" alt="Avatar"/>
          <div class="chat-info">
            <div class="top-row">
              <span class="name">Rodrygo</span>
              <span class="time">05/12/25</span>
            </div>
            <div class="bottom-row">
              <span class="snippet">25:09</span>
            </div>
          </div>
        </div>
      </div>
    </div>

   
    <div class="chat-container">
    
      <div class="chat-header">
        <div class="header-left">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Patient Avatar"/>
          <div class="name-status">
            <span class="name">Jone Martin</span>
            <span class="status">Online</span>
          </div>
        </div>
        <div class="header-right">
          <span class="material-icons">call</span>
          <span class="material-icons">favorite</span>
        </div>
      </div>

      
      <div class="chat-box" id="chat-box">
        
        <div class="chat-message received">
          <img class="avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar"/>
          <div class="message-content">
            <p class="text">Hi doctor</p>
            <div class="timestamp">Today 7:49 am</div>
          </div>
        </div>
       
        <div class="sent-row">
          <div class="chat-message sent">
            <img class="avatar" src="https://randomuser.me/api/portraits/men/86.jpg" alt="Doctor Avatar"/>
            <div class="message-content">
              <p class="text">Hi Jone, how can I help?</p>
              <div class="timestamp">Today 7:50 am</div>
            </div>
          </div>
        </div>
        
        <div class="sent-row">
          <div class="chat-message sent">
            <img class="avatar" src="https://randomuser.me/api/portraits/men/86.jpg" alt="Doctor Avatar"/>
            <div class="message-content">
              <p class="text">What’s the matter, Jone?</p>
              <div class="timestamp">Today 7:51 am</div>
            </div>
          </div>
        </div>
        
        <div class="chat-message received">
          <img class="avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar"/>
          <div class="message-content">
            <p class="text">I am fine. I am a cardio patient. I need your help immediately.</p>
            <div class="timestamp">Today 7:52 am</div>
          </div>
        </div>
       
        <div class="sent-row">
          <div class="chat-message sent">
            <img class="avatar" src="https://randomuser.me/api/portraits/men/86.jpg" alt="Doctor Avatar"/>
            <div class="message-content">
              <p class="text">Hey, don’t worry. Let me know your situation now.</p>
              <div class="timestamp">Today 7:53 am</div>
            </div>
          </div>
        </div>
      
      </div>

     
      <div class="chat-footer">
       
        <div class="emoji-panel" id="emojiPanel">
          <span>😀</span>
          <span>😂</span>
          <span>😍</span>
          <span>😢</span>
          <span>😡</span>
          <span>👍</span>
          <span>👎</span>
          <span>🤔</span>
        </div>
        <div class="input-container">
          <button id="emojiButton" class="icon-button" onclick="toggleEmojiPanel()">
            <span class="material-icons">emoji_emotions</span>
          </button>
       
          <button id="fileButton" class="icon-button" onclick="document.getElementById('fileInput').click()">
            <span class="material-icons">attach_file</span>
          </button>
          <input type="file" id="fileInput" style={{display: "none;"}} onchange="sendFile(this.files[0])" />
          <input type="text" id="messageInput" placeholder="Type a message..."/>
          <button id="voiceButton" class="icon-button" onclick="toggleRecording()">
            <span class="material-icons">mic</span>
          </button>
          <button onclick="sendMessage()">Send</button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Chatpage