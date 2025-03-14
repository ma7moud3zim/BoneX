import React, { useEffect, useState } from 'react';

function ConversationList({ userId, onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  //http://chatservice.runasp.net/

  useEffect(() => {
    fetch(`http://chatservice.runasp.net/api/Conversations/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setConversations(data))
      .catch((err) => console.error("Error fetching conversations:", err));
  }, [userId]);

  return (
    <div className="overflow-y-auto">
      {conversations.map((conv) => (
        <div 
          key={conv.conversationId} 
          className="flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
          onClick={() => onSelectConversation(conv)}
        >
          <img 
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Avatar" 
            className="w-11 h-11 rounded-full object-cover mr-3"
          />
          <div className="flex flex-col w-full">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{conv.partnerId}</span>
              <span className="text-xs text-gray-500">
                {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleString() : ""}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                {conv.lastMessageContent || "No messages yet"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConversationList;
