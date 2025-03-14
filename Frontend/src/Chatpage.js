import React, { useState } from 'react';
import ConversationList from './ConversationList';
import ChatConversation from './ChatConversation';

function ChatPage() {
  const currentUserId = JSON.parse(sessionStorage.getItem('userInfo')).email;
  console.log("Current User:", currentUserId);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newReceiverId, setNewReceiverId] = useState("");

  const handleStartChat = () => {
    if (newReceiverId.trim() === "") return;
    const newConversation = { conversationId: null, partnerId: newReceiverId.trim() };
    setSelectedConversation(newConversation);
    setNewReceiverId("");
  };

  // Callback to update selectedConversation
  const updateSelectedConversation = (newConv) => {
    setSelectedConversation(newConv);
  };

  return (
    <div className="flex w-full h-[calc(100vh-65px)]">
      {/* Left Pane: Conversation List and "Start Chat" section */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Message</h2>
          <p className="text-sm text-gray-500">Recent chat</p>
          <div className="mt-2 flex items-center bg-gray-100 rounded p-2">
            <span className="material-icons text-gray-400 mr-1">search</span>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none flex-1 text-sm"
              onInput={(e) => console.log(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList 
            userId={currentUserId} 
            onSelectConversation={(conv) => setSelectedConversation(conv)}
          />
        </div>
        <div className="p-4 border-t border-gray-200">
          <input 
            type="text"
            placeholder="Enter receiver id..."
            className="w-full p-2 border rounded"
            value={newReceiverId}
            onChange={(e) => setNewReceiverId(e.target.value)}
          />
          <button 
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
            onClick={handleStartChat}
          >
            Start Chat
          </button>
        </div>
      </div>

      {/* Right Pane: Chat Conversation */}
      <div className="flex-1 flex flex-col h-full bg-[#F2F5F7]">
        {selectedConversation ? (
          <ChatConversation 
            conversation={selectedConversation} 
            currentUserId={currentUserId}
            updateConversation={updateSelectedConversation}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Select a conversation or start a new chat</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;