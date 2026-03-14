import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp } from '@stomp/stompjs';
import AuthService from '../services/auth.service';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const stompClientRef = useRef(null);
    const currentUser = AuthService.getCurrentUser();
    const username = currentUser ? currentUser.username : 'Anonymous';

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/public', (payload) => {
                const message = JSON.parse(payload.body);
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            // Join message
            stompClient.send("/app/chat.addUser", {}, JSON.stringify({ sender: username, type: 'JOIN' }));
        });

        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current) {
                // Leave message (optional)
                stompClientRef.current.disconnect();
            }
        };
    }, [username]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() && stompClientRef.current) {
            const chatMessage = {
                sender: username,
                content: messageInput,
                type: 'CHAT'
            };
            stompClientRef.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessageInput('');
        }
    };

    return (
        <div className="border rounded-lg shadow-lg p-4 bg-white h-96 flex flex-col">
            <h3 className="text-lg font-bold mb-2">Team Chat</h3>
            <div className="flex-1 overflow-y-auto mb-4 border p-2 bg-gray-50 rounded">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.type === 'JOIN' || msg.type === 'LEAVE' ? 'text-center text-gray-500 italic' : ''}`}>
                        {msg.type === 'CHAT' && (
                            <div className={msg.sender === username ? 'text-right' : 'text-left'}>
                                <span className="font-bold text-xs">{msg.sender}</span>
                                <div className={`inline-block px-3 py-1 rounded-lg ${msg.sender === username ? 'bg-blue-100' : 'bg-gray-200'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        )}
                        {msg.type !== 'CHAT' && <span>{msg.sender} {msg.type === 'JOIN' ? 'joined' : 'left'}</span>}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex">
                <input
                    type="text"
                    className="flex-1 border p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700">Send</button>
            </form>
        </div>
    );
};

export default ChatBox;
