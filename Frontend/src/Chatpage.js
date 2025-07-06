import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import ChatConversation from './ChatConversation';

function ChatPage() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newReceiverId, setNewReceiverId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [userLoadError, setUserLoadError] = useState(null);
  const [allConversations, setAllConversations] = useState([]);

  // Initialize currentUserId from sessionStorage with proper validation
  useEffect(() => {
    try {
      const userInfo = sessionStorage.getItem('userInfo');
      if (!userInfo) {
        setUserLoadError("No user information found. Please log in again.");
        return;
      }

      let parsedUserInfo;
      try {
        parsedUserInfo = JSON.parse(userInfo);
      } catch (parseError) {
        setUserLoadError("Invalid user information format. Please log in again.");
        return;
      }

      // Validate the structure of parsed user info
      if (!parsedUserInfo || typeof parsedUserInfo !== 'object') {
        setUserLoadError("Invalid user information structure. Please log in again.");
        return;
      }

      const userId = parsedUserInfo.id;
      if (!userId) {
        setUserLoadError("User ID not found. Please log in again.");
        return;
      }

      setCurrentUserId(userId);
      console.log("Current User:", userId);
      
    } catch (error) {
      console.error("Error parsing user info from sessionStorage:", error);
      setUserLoadError("Error loading user information. Please log in again.");
    }
  }, []);

  // Check if conversation already exists with the given partner
  const findExistingConversation = (partnerId) => {
    return allConversations.find(conv => 
      conv.partnerId === partnerId || 
      (conv.partnerEmail && conv.partnerEmail === partnerId)
    );
  };

  const handleStartChat = async () => {
    const trimmedReceiverId = newReceiverId.trim();
    if (!trimmedReceiverId || !currentUserId) return;
    
    setIsStartingChat(true);
    
    try {
      // Check if we already have a conversation with this user
      const existingConv = findExistingConversation(trimmedReceiverId);
      
      if (existingConv) {
        setSelectedConversation(existingConv);
        setSearchQuery(""); // Clear search when selecting conversation
      } else {
        // Create new conversation object
        const newConversation = { 
          conversationId: null, 
          partnerId: trimmedReceiverId,
          partnerName: trimmedReceiverId, // Will be updated when conversation is created
          partnerPictureUrl: null,
          lastMessageTime: null,
          lastMessageContent: '',
          unreadCount: 0
        };
        setSelectedConversation(newConversation);
      }
      
      setNewReceiverId("");
      
    } catch (error) {
      console.error("Error starting chat:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsStartingChat(false);
    }
  };

  // Callback to update selectedConversation and refresh list
  const updateSelectedConversation = (newConv) => {
    setSelectedConversation(newConv);
    // Refresh conversation list when a new conversation is created
    if (newConv.conversationId && !selectedConversation?.conversationId) {
      setRefreshKey(prev => prev + 1);
    }
  };

  // Update conversations list for duplicate checking
  const updateConversationsList = (conversations) => {
    setAllConversations(conversations);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleStartChat();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Handle user load error
  if (userLoadError) {
    return (
      <div className="flex w-full h-[calc(100vh-65px)] items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Authentication Error</h3>
          <p className="text-red-600 mb-4">{userLoadError}</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Don't render until we have currentUserId
  if (!currentUserId) {
    return (
      <div className="flex w-full h-[calc(100vh-65px)] items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-lg">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-65px)]">
      {/* Left Pane: Conversation List and "Start Chat" section */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Messages</h2>
          <p className="text-sm text-gray-500 mb-3">Recent chats</p>
          
          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center bg-gray-100 rounded p-2">
              <svg 
                className="w-4 h-4 text-gray-400 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <input
                type="text"
                placeholder="Search conversations..."
                className="bg-transparent outline-none flex-1 text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search conversations"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path 
                      fillRule="evenodd" 
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ConversationList 
            userId={currentUserId} 
            onSelectConversation={(conv) => {
              setSelectedConversation(conv);
              setSearchQuery(""); // Clear search when selecting conversation
            }}
            refreshKey={refreshKey}
            searchQuery={searchQuery}
            onConversationsUpdate={updateConversationsList}
          />
        </div>
        
        {/* Start New Chat Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start New Chat
            </label>
            <input 
              type="text"
              placeholder="Enter user email or ID..."
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
              value={newReceiverId}
              onChange={(e) => setNewReceiverId(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isStartingChat}
              aria-label="Enter user email or ID to start new chat"
            />
          </div>
          <button 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            onClick={handleStartChat}
            disabled={newReceiverId.trim() === "" || isStartingChat}
            aria-label="Start new chat"
          >
            {isStartingChat ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Starting Chat...
              </>
            ) : (
              'Start Chat'
            )}
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
            <div className="text-center">
              <div className="text-6xl text-gray-300 mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Welcome to Chat
              </h3>
              <p className="text-gray-500 mb-4">
                Select a conversation from the list or start a new chat
              </p>
              {searchQuery && (
                <p className="text-sm text-gray-400">
                  Currently searching for: "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;