import React, { useEffect, useState } from 'react';

function ConversationList({ userId, onSelectConversation, refreshKey = 0, searchQuery = '' }) {
  const [conversations, setConversations] = useState([]);
  const [allConversations, setAllConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchConversations = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    console.log('Fetching conversations for user:', userId);
    
    try {
      const response = await fetch(`https://chatservice.runasp.net/api/Conversations/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate and ensure data is an array
      const conversationsData = Array.isArray(data) ? data : [];
      
      // Validate each conversation object
      const validatedConversations = conversationsData.map(conv => ({
        conversationId: conv.conversationId || null,
        partnerId: conv.partnerId || null,
        partnerName: conv.partnerName || 'Unknown User',
        partnerPictureUrl: conv.partnerPictureUrl || null,
        lastMessageTime: conv.lastMessageTime || null,
        lastMessageContent: conv.lastMessageContent || '',
        unreadCount: typeof conv.unreadCount === 'number' ? conv.unreadCount : 0
      }));
      
      setAllConversations(validatedConversations);
      setConversations(validatedConversations);
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err.message);
      setConversations([]);
      setAllConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setConversations(allConversations);
      return;
    }

    const filtered = allConversations.filter(conv => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = conv.partnerName.toLowerCase().includes(searchLower);
      const messageMatch = conv.lastMessageContent.toLowerCase().includes(searchLower);
      return nameMatch || messageMatch;
    });

    setConversations(filtered);
  }, [searchQuery, allConversations]);

  useEffect(() => {
    fetchConversations();
  }, [userId, refreshKey]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchConversations();
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const diff = now - date;
      
      // Less than a day ago
      if (diff < 24 * 60 * 60 * 1000) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Less than a week ago
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        return date.toLocaleDateString([], { weekday: 'short' });
      }
      
      // Older
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (error) {
      return '';
    }
  };

  const truncateMessage = (message, maxLength = 30) => {
    if (!message) return 'No messages yet';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const getAvatarFallback = (name) => {
    if (!name) return '👤';
    return name.charAt(0).toUpperCase();
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-2">Error loading conversations</p>
          <p className="text-gray-400 text-xs mb-3">{error}</p>
          <button 
            onClick={handleRetry}
            disabled={isLoading}
            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Retrying...' : `Retry${retryCount > 0 ? ` (${retryCount})` : ''}`}
          </button>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    const noResultsMessage = searchQuery.trim() 
      ? `No conversations found for "${searchQuery}"`
      : 'No conversations yet';

    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-3xl text-gray-300 mb-2">
            {searchQuery.trim() ? '🔍' : '📝'}
          </div>
          <p className="text-gray-500 text-sm">{noResultsMessage}</p>
          {!searchQuery.trim() && (
            <p className="text-gray-400 text-xs">Start a new chat below</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      {conversations.map((conv) => (
        <div 
          key={conv.conversationId || `temp-${conv.partnerId}`} 
          className="flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors focus:bg-gray-50 focus:outline-none"
          onClick={() => onSelectConversation(conv)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectConversation(conv);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Chat with ${conv.partnerName}`}
        >
          <div className="relative w-11 h-11 mr-3 flex-shrink-0">
            {conv.partnerPictureUrl && (
              <img 
                src={conv.partnerPictureUrl}
                alt={`${conv.partnerName} avatar`}
                className="w-11 h-11 rounded-full object-cover"
                onError={handleImageError}
              />
            )}
            <div 
              className="w-11 h-11 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-medium text-sm absolute top-0 left-0"
              style={{ display: conv.partnerPictureUrl ? 'none' : 'flex' }}
            >
              {getAvatarFallback(conv.partnerName)}
            </div>
          </div>
          
          <div className="flex flex-col w-full min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium truncate">
                {conv.partnerName}
              </span>
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                {formatLastMessageTime(conv.lastMessageTime)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span className="truncate flex-1 pr-2">
                {truncateMessage(conv.lastMessageContent)}
              </span>
              {conv.unreadCount > 0 && (
                <span 
                  className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center flex-shrink-0"
                  aria-label={`${conv.unreadCount} unread messages`}
                >
                  {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConversationList;