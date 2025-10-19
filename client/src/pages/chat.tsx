import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";

// Types
interface Chat {
  id: number;
  username: string;
  avatar: string;
  lastMessage: string;
  isOnline: boolean;
  unreadCount: number;
  sharedInterests?: { icon: string; label: string }[];
}

interface Message {
  id: number;
  chatId: number;
  type: "sent" | "received";
  content: string | React.ReactNode;
  avatar?: string;
  timestamp?: Date;
}

// Mock Data - This will be replaced with API calls
const mockChats: Chat[] = [
  {
    id: 1,
    username: "MysticWanderer",
    avatar: "🤫",
    lastMessage: "Definitely! There's a hidden trail...",
    isOnline: true,
    unreadCount: 0,
    sharedInterests: [
      { icon: "hiking", label: "Hiking" },
      { icon: "music_note", label: "Indie Music" },
      { icon: "photo_camera", label: "Photography" },
    ],
  },
  {
    id: 2,
    username: "DreamyDolphin",
    avatar: "😇",
    lastMessage: "Let's guess! 🤫",
    isOnline: false,
    unreadCount: 1,
    sharedInterests: [
      { icon: "book", label: "Reading" },
      { icon: "palette", label: "Art" },
    ],
  },
  {
    id: 3,
    username: "SunnySpecter",
    avatar: "😎",
    lastMessage: "Loved your hint!",
    isOnline: false,
    unreadCount: 0,
    sharedInterests: [
      { icon: "sports_basketball", label: "Sports" },
      { icon: "restaurant", label: "Cooking" },
    ],
  },
  {
    id: 4,
    username: "QuantumQuirk",
    avatar: "🤯",
    lastMessage: "Are you a physics major?",
    isOnline: false,
    unreadCount: 0,
    sharedInterests: [
      { icon: "science", label: "Science" },
      { icon: "calculate", label: "Math" },
    ],
  },
];

const mockMessagesData: Message[] = [
  {
    id: 1,
    chatId: 1,
    type: "received",
    content: "Hey! Any good hiking spots around campus?",
    avatar: "🤫",
  },
  {
    id: 2,
    chatId: 1,
    type: "sent",
    content:
      "Definitely! There's a hidden trail behind the science building. Have you been?",
  },
  {
    id: 3,
    chatId: 1,
    type: "received",
    content:
      "Oh, I love that one! Perfect for some Photography. Maybe we've crossed paths before? 😉",
    avatar: "🤫",
  },
  {
    id: 4,
    chatId: 2,
    type: "received",
    content: "Let's guess! 🤫",
    avatar: "😇",
  },
  {
    id: 5,
    chatId: 2,
    type: "sent",
    content: "I think I have an idea! 😄",
  },
  {
    id: 6,
    chatId: 3,
    type: "received",
    content: "Loved your hint!",
    avatar: "😎",
  },
  {
    id: 7,
    chatId: 4,
    type: "received",
    content: "Are you a physics major?",
    avatar: "🤯",
  },
];

export default function Chat() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [allMessages, setAllMessages] = useState<Message[]>(mockMessagesData);
  const [messageInput, setMessageInput] = useState("");
  const [guessInput, setGuessInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState<number>(1);

  const userProfileImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB3_iPJIQrt9-mW5A2ydCh3Yxc4LvljOrKyoltkptN-cVP6DbgD5zAnr4dEs77kaw5Z8IqCaskYDyn_nJ-7e1EQD6Mb6OXgIyrvFZGK4vcEV_4flgPXBJhCJYP4RWJgmdloYhBZdEczYdkPD91Lbxip2szT9kOihSNg5cv4LAw4gFIEslHasQHpUQwZvWBs8cSEUqlKhDBI0KtNhHEcGz1lzukeOzUbX5Zg0W62uoUsmn7g8g5pIk7t8OIfrlI8EmzJYYxJH5A9BR92";

  // Get active chat object
  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) || chats[0],
    [chats, activeChatId]
  );

  // Filter messages for active chat
  const messages = useMemo(
    () => allMessages.filter((msg) => msg.chatId === activeChatId),
    [allMessages, activeChatId]
  );

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    return chats.filter((chat) =>
      chat.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  // Handle chat selection
  const handleChatSelect = (chatId: number) => {
    setActiveChatId(chatId);
    // Mark chat as read
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
    // TODO: API call to mark messages as read
    // await fetch(`/api/chats/${chatId}/mark-read`, { method: 'POST' });
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      chatId: activeChatId,
      type: "sent",
      content: messageInput,
      timestamp: new Date(),
    };

    // Add message to state
    setAllMessages((prev) => [...prev, newMessage]);

    // Update last message in chat list
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, lastMessage: messageInput.substring(0, 30) + "..." }
          : chat
      )
    );

    setMessageInput("");

    // TODO: API call to send message
    // await fetch('/api/messages', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ chatId: activeChatId, content: messageInput })
    // });
  };

  // Handle making a guess
  const handleGuess = () => {
    if (!guessInput.trim()) return;

    console.log("Making guess:", guessInput);
    setGuessInput("");

    // TODO: API call to submit guess
    // await fetch('/api/chats/${activeChatId}/guess', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ guess: guessInput })
    // });
  };

  // Bubble radius utility to mimic Instagram/iMessage grouping
  const getBubbleRadius = (
    type: "sent" | "received",
    isFirstInGroup: boolean,
    isLastInGroup: boolean
  ) => {
    let classes = "rounded-3xl";
    if (type === "sent") {
      if (!isFirstInGroup) classes += " rounded-tr-md"; // connect top-right
      if (!isLastInGroup) classes += " rounded-br-md"; // connect bottom-right
    } else {
      if (!isFirstInGroup) classes += " rounded-tl-md"; // connect top-left
      if (!isLastInGroup) classes += " rounded-bl-md"; // connect bottom-left
    }
    return classes;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Navigation Sidebar (Icon Only) */}
      <Sidebar collapsed />

      {/* Left Sidebar - Chat List */}
      <aside className="w-80 bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-primary/20 flex flex-col">
        <header className="p-4 border-b border-slate-200 dark:border-primary/20 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Chats</h1>
            <button className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">edit_square</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-[20px]">
              search
            </span>
          </div>
        </header>

        <div className="overflow-y-auto flex-grow">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`px-4 py-3 flex items-center gap-4 cursor-pointer transition-colors ${
                  chat.id === activeChatId
                    ? "bg-primary/10 dark:bg-primary/20"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/20"
                }`}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl">{chat.avatar}</span>
                  </div>
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900/50"></span>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold truncate">{chat.username}</p>
                  <p
                    className={`text-sm truncate ${
                      chat.unreadCount > 0
                        ? "font-semibold text-primary dark:text-primary"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></span>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <p>No chats found</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 grid grid-cols-[1fr,400px]">
        <div className="flex flex-col h-screen">
          {/* Chat Header */}
          <header className="flex items-center justify-between p-4 border-b border-primary/10 dark:border-primary/20 bg-white dark:bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">{activeChat.avatar}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold">{activeChat.username}</h2>
                <p
                  className={`text-sm ${
                    activeChat.isOnline
                      ? "text-green-500"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {activeChat.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined">call</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined">videocam</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-6 space-y-2 bg-slate-50 dark:bg-slate-950">
            {messages.map((message, index) => {
              const prev = messages[index - 1];
              const next = messages[index + 1];
              const isPrevSame = prev && prev.type === message.type;
              const isNextSame = next && next.type === message.type;
              const isFirstInGroup = !isPrevSame;
              const isLastInGroup = !isNextSame;

              const bubbleRadius = getBubbleRadius(
                message.type,
                isFirstInGroup,
                isLastInGroup
              );

              if (message.type === "received") {
                return (
                  <div key={message.id} className="flex justify-start">
                    <div
                      className={`max-w-[70%] px-4 py-2.5 ${bubbleRadius} bg-slate-200 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-[15px] leading-relaxed`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              }

              if (message.type === "sent") {
                return (
                  <div key={message.id} className="flex justify-end">
                    <div
                      className={`max-w-[70%] px-4 py-2.5 ${bubbleRadius} bg-primary text-white text-[15px] leading-relaxed`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white dark:bg-slate-900/50 border-t border-primary/10 dark:border-primary/20 shrink-0">
            <div className="relative">
              <input
                className="w-full h-12 pr-28 pl-12 rounded-full bg-slate-50 border-primary/10 dark:bg-slate-950 border focus:outline-none focus:border-primary/10 focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Type a message..."
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button className="absolute left-3 top-1/2 -translate-y-1/2 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">
                  add_circle
                </span>
              </button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">
                    mood
                  </span>
                </button>
                <button className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">
                    mic
                  </span>
                </button>
                <button className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">
                    image
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Profile & Guessing Game */}
        <aside className="bg-white dark:bg-slate-900/50 border-l border-slate-200 dark:border-primary/20 flex flex-col overflow-y-auto">
          {/* Profile Section */}
          <div className="p-6 border-b border-slate-200 dark:border-primary/20">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-4xl">{activeChat.avatar}</span>
              </div>
              <h2 className="text-xl font-bold text-center">
                {activeChat.username}
              </h2>
              <p
                className={`text-sm mt-1 ${
                  activeChat.isOnline
                    ? "text-green-500"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {activeChat.isOnline ? "Active now" : "Offline"}
              </p>
            </div>
          </div>

          {/* Shared Interests */}
          {activeChat.sharedInterests &&
            activeChat.sharedInterests.length > 0 && (
              <div className="p-6 border-b border-slate-200 dark:border-primary/20">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Shared Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeChat.sharedInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        {interest.icon}
                      </span>
                      {interest.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Guessing Game */}
          <div className="p-6 flex-grow flex flex-col">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              The Guessing Game
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Think you know who's behind the mask? Make a guess! If you're both
              right, you can unmask.
            </p>

            {/* Guess Input */}
            <div className="relative mb-4">
              <input
                className="w-full h-11 pl-11 pr-4 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm"
                placeholder="Enter your guess..."
                type="text"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleGuess();
                  }
                }}
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-[20px]">
                person_search
              </span>
            </div>

            {/* Guess Status */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
                  style={{
                    backgroundImage: `url('${userProfileImage}')`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Your Guess
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Waiting for you...
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xl">{activeChat.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {activeChat.username}'s Guess
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Hasn't guessed yet
                  </p>
                </div>
              </div>
            </div>

            {/* Reveal Button */}
            <div className="mt-auto">
              <button
                disabled
                className="w-full h-12 flex items-center justify-center rounded-lg bg-primary/50 text-white font-semibold text-sm cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px] mr-2">
                  lock
                </span>
                Reveal Identity
              </button>
              <p className="text-center text-xs mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                Enabled when both make correct guesses
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
