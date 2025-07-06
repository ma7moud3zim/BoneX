import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as signalR from '@microsoft/signalr';

function ChatConversation({ conversation, currentUserId, updateConversation }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState({
    pictureUrl: conversation.partnerPictureUrl || '',
    name: conversation.partnerName || 'Unknown User',
    id: conversation.partnerId
  });
  const [sendError, setSendError] = useState(null);
  
  const chatBoxRef = useRef(null);
  const connectionRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Safely get user profile picture
  const profilePicture = useMemo(() => {
    try {
      const userInfo = sessionStorage.getItem('userInfo');
      if (!userInfo) return null;
      
      const parsedUserInfo = JSON.parse(userInfo);
      if (!parsedUserInfo?.profilePicture) return null;
      
      return `http://bonex.runasp.net${parsedUserInfo.profilePicture}`;
    } catch (error) {
      console.error('Error getting profile picture:', error);
      return null;
    }
  }, []);

  // Get avatar fallback
  const getAvatarFallback = useCallback((name) => {
    if (!name) return '👤';
    return name.charAt(0).toUpperCase();
  }, []);

  // Handle image errors
  const handleImageError = useCallback((e, isPartner = false) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextSibling;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  }, []);

  // Fetch conversation messages and partner info
  useEffect(() => {
    if (!conversation.conversationId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    setConnectionError(null);

    const fetchConversation = async () => {
      try {
        const response = await fetch(`https://chatservice.runasp.net/api/Conversations/${conversation.conversationId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Conversation data:', data);

        // Safely extract partner information
        let partnerData = { pictureUrl: conversation.partnerPictureUrl, name: 'Unknown User', id: conversation.partnerId };
        
        if (data) {
          // Determine which user is the partner
          if (data.userAid && data.userAid !== currentUserId) {
            partnerData = {
              pictureUrl: data.userApictureUrl || '',
              name: data.userAname || 'Unknown User',
              id: data.userAid
            };
          } else if (data.userBid && data.userBid !== currentUserId) {
            partnerData = {
              pictureUrl: data.userBpictureUrl || '',
              name: data.userBname || 'Unknown User', 
              id: data.userBid
            };
          }
        }

        setPartnerInfo(partnerData);
        
        // Validate and set messages
        const messagesData = Array.isArray(data.chatMessages) ? data.chatMessages : [];
        const validatedMessages = messagesData.map((msg, index) => ({
          id: msg.id || `temp-${index}`,
          senderId: msg.senderId || '',
          messageContent: msg.messageContent || '',
          messageType: msg.messageType || 'text',
          conversationId: msg.conversationId || conversation.conversationId,
          createdAt: msg.createdAt || new Date().toISOString()
        }));
        
        setMessages(validatedMessages);
        
      } catch (error) {
        console.error('Error fetching conversation:', error);
        setConnectionError(`Failed to load conversation: ${error.message}`);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [conversation.conversationId, currentUserId, conversation.partnerId]);

  // SignalR connection management
  useEffect(() => {
    if (!currentUserId) return;

    const createConnection = () => {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`https://chatservice.runasp.net/chathub?userId=${currentUserId}`)
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Connection event handlers
      newConnection.onreconnecting(() => {
        console.log('SignalR reconnecting...');
        setIsConnected(false);
        setConnectionError('Reconnecting...');
      });

      newConnection.onreconnected(() => {
        console.log('SignalR reconnected');
        setIsConnected(true);
        setConnectionError(null);
      });

      newConnection.onclose((error) => {
        console.log('SignalR connection closed', error);
        setIsConnected(false);
        setConnectionError('Connection lost. Attempting to reconnect...');
        
        // Retry connection after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          if (connectionRef.current?.state === signalR.HubConnectionState.Disconnected) {
            startConnection();
          }
        }, 5000);
      });

      return newConnection;
    };

    const startConnection = async () => {
      if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
        return;
      }

      try {
        const connection = createConnection();
        connectionRef.current = connection;
        
        await connection.start();
        console.log('ChatConversation connected');
        setIsConnected(true);
        setConnectionError(null);
        
      } catch (error) {
        console.error('SignalR connection error:', error);
        setIsConnected(false);
        setConnectionError(`Connection failed: ${error.message}`);
        
        // Retry after delay
        reconnectTimeoutRef.current = setTimeout(startConnection, 10000);
      }
    };

    startConnection();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [currentUserId]);

  // Message handler
  const messageHandler = useCallback((sender, message, type, convId, timestamp, messageId) => {
    console.log('Received message:', { sender, message, type, convId, timestamp, messageId });
    
    // Handle both existing and new conversations
    if (conversation.conversationId === null || convId === conversation.conversationId) {
      const newMessage = {
        id: messageId || `temp-${Date.now()}-${Math.random()}`,
        senderId: sender,
        messageContent: message || '',
        messageType: type || 'text',
        conversationId: convId,
        createdAt: timestamp || new Date().toISOString(),
      };
      
      setMessages((prev) => {
        // Check for duplicates using message ID first, then content + timestamp
        const exists = prev.some(msg => {
          if (messageId && msg.id === messageId) return true;
          
          return msg.senderId === sender && 
                 msg.messageContent === message &&
                 Math.abs(new Date(msg.createdAt) - new Date(newMessage.createdAt)) < 2000;
        });
        
        if (exists) {
          return prev;
        }
        
        return [...prev, newMessage];
      });
      
      // Update conversationId if it was null (new conversation)
      if (conversation.conversationId === null && convId) {
        updateConversation({ ...conversation, conversationId: convId });
      }
    }
  }, [conversation, updateConversation]);

  // Register SignalR message handler
  useEffect(() => {
    const connection = connectionRef.current;
    
    if (connection && isConnected) {
      connection.on('ReceiveMessage', messageHandler);

      return () => {
        connection.off('ReceiveMessage', messageHandler);
      };
    }
  }, [isConnected, messageHandler]);

  // Auto-scroll chat box
  useEffect(() => {
    if (chatBoxRef.current) {
      const scrollElement = chatBoxRef.current;
      const isNearBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 100;
      
      if (isNearBottom) {
        setTimeout(() => {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }, 100);
      }
    }
  }, [messages]);

  // Send message function
  const handleSendMessage = async () => {
    const connection = connectionRef.current;
    
    if (!connection || !isConnected || messageInput.trim() === '') {
      console.warn('Cannot send message: connection not ready or empty message');
      return;
    }

    const messageToSend = messageInput.trim();
    const tempMessageId = `temp-${Date.now()}-${Math.random()}`;
    
    // Clear input and show sending state
    setMessageInput('');
    setIsSending(true);
    setSendError(null);

    // Optimistically add message to UI
    const optimisticMessage = {
      id: tempMessageId,
      senderId: currentUserId,
      messageContent: messageToSend,
      messageType: 'text',
      conversationId: conversation.conversationId,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      await connection.invoke('SendMessage', currentUserId, partnerInfo.id, messageToSend, 'text');
      console.log('Message sent successfully');
      
      // Update message status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessageId 
          ? { ...msg, status: 'sent' }
          : msg
      ));
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSendError('Failed to send message. Please try again.');
      
      // Remove optimistic message and restore input
      setMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
      setMessageInput(messageToSend);
      
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };

  const retryConnection = () => {
    setConnectionError(null);
    if (connectionRef.current?.state === signalR.HubConnectionState.Disconnected) {
      connectionRef.current.start()
        .then(() => {
          setIsConnected(true);
          setConnectionError(null);
        })
        .catch(error => {
          setConnectionError(`Connection failed: ${error.message}`);
        });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex justify-between items-center bg-white border-b border-gray-200 p-3">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 flex-shrink-0">
            {partnerInfo.pictureUrl && (
              <img
                src={partnerInfo.pictureUrl}
                alt={`${partnerInfo.name} avatar`}
                className="w-11 h-11 rounded-full object-cover"
                onError={(e) => handleImageError(e, true)}
              />
            )}
            <div 
              className="w-11 h-11 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-medium text-sm absolute top-0 left-0"
              style={{ display: partnerInfo.pictureUrl ? 'none' : 'flex' }}
            >
              {getAvatarFallback(partnerInfo.name)}
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-base font-medium">{partnerInfo.name}</span>
            <span className={`text-xs ${
              isConnected ? 'text-green-500' : 
              connectionError ? 'text-red-500' : 'text-gray-400'
            }`}>
              {isConnected ? 'Online' : connectionError || 'Connecting...'}
            </span>
          </div>
        </div>

        {connectionError && (
          <button
            onClick={retryConnection}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        )}
      </div>

      {/* Connection error banner */}
      {connectionError && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-2">
          <p className="text-yellow-800 text-sm text-center">{connectionError}</p>
        </div>
      )}

      {/* Send error banner */}
      {sendError && (
        <div className="bg-red-50 border-b border-red-200 p-2">
          <div className="flex items-center justify-between">
            <p className="text-red-800 text-sm">{sendError}</p>
            <button
              onClick={() => setSendError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Scrollable messages area */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col" ref={chatBoxRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <p className="text-gray-500">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl text-gray-300 mb-2">💬</div>
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id || `${msg.conversationId}-${idx}-${msg.createdAt}`}
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'items-start'} mb-4`}
            >
              {msg.senderId !== currentUserId && (
                <div className="relative w-9 h-9 mr-3 flex-shrink-0">
                  {partnerInfo.pictureUrl && (
                    <img
                      className="w-9 h-9 rounded-full object-cover"
                      src={partnerInfo.pictureUrl}
                      alt={`${partnerInfo.name} avatar`}
                      onError={handleImageError}
                    />
                  )}
                  <div 
                    className="w-9 h-9 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-medium text-xs absolute top-0 left-0"
                    style={{ display: partnerInfo.pictureUrl ? 'none' : 'flex' }}
                  >
                    {getAvatarFallback(partnerInfo.name)}
                  </div>
                </div>
              )}
              
              <div
                className={`max-w-[75%] p-3 ${
                  msg.senderId === currentUserId
                    ? 'bg-gradient-to-r from-[#008CBA] to-[#00A5E0] text-white rounded-2xl shadow-md'
                    : 'bg-white rounded-2xl shadow-sm border border-gray-100'
                }`}
              >
                <p className="text-sm break-words whitespace-pre-wrap">{msg.messageContent}</p>
                <div className={`text-xs mt-1 text-right flex items-center justify-end gap-1 ${
                  msg.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{formatMessageTime(msg.createdAt)}</span>
                  {msg.senderId === currentUserId && msg.status && (
                    <span className="text-xs">
                      {msg.status === 'sending' && '⏳'}
                      {msg.status === 'sent' && '✓'}
                      {msg.status === 'failed' && '❌'}
                    </span>
                  )}
                </div>
              </div>

              {msg.senderId === currentUserId && (
                <div className="relative w-9 h-9 ml-3 flex-shrink-0">
                  {profilePicture && (
                    <img
                      className="w-9 h-9 rounded-full object-cover"
                      src={profilePicture}
                      alt="Your avatar"
                      onError={handleImageError}
                    />
                  )}
                  <div 
                    className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium text-xs absolute top-0 left-0"
                    style={{ display: profilePicture ? 'none' : 'flex' }}
                  >
                    {getAvatarFallback('You')}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Fixed input area */}
      <div className="bg-white border-t border-gray-200 p-3 flex items-center gap-3">
        <input
          type="text"
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          className="flex-1 p-2 border border-gray-300 rounded-full outline-none text-sm focus:ring-2 focus:ring-[#008CBA] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected || isSending}
          maxLength={1000}
          aria-label="Type your message"
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || messageInput.trim() === '' || isSending}
          className="bg-[#008CBA] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#005F7A] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          aria-label="Send message"
        >
          {isSending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sending...
            </>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </div>
  );
}

export default ChatConversation;
