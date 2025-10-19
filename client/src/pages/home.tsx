import { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";

// Mock Data
const mockStories = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    label: "Sarah",
    hasNotification: true,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    label: "New match!",
    hasNotification: true,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    label: "Ur confession",
    hasNotification: false,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    label: "Likes",
    hasNotification: false,
  },
];

const mockMatches = [
  {
    id: 123,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
    name: "Anonymous Match #123",
    interests: ["Music", "Hiking", "Art"],
    topArtists: ["Joji", "The Strokes", "Tame Impala"],
    topMovies: ["Interstellar", "La La Land", "About Time"],
    memeLine: "Ahh shit Here we go again.",
    unlockableDetails: [
      {
        id: 1,
        title: "Favorite Campus Coffee Shop",
        description: "Unlocked after 3 swipes right! (1/3)",
        isUnlocked: true,
      },
      {
        id: 2,
        title: "Major & Graduation Year",
        description: "Unlock: 5 more interactions needed",
        isUnlocked: false,
      },
    ],
  },
  {
    id: 456,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
    name: "Anonymous Match #456",
    interests: ["Photography", "Books", "Yoga"],
    topArtists: ["Ed Sheeran", "Norah Jones", "The Beatles"],
    topMovies: ["Lady Bird", "Past Lives", "Moonlight"],
    memeLine: "Why are you running?",
    unlockableDetails: [
      {
        id: 1,
        title: "Favorite Study Spot",
        description: "Unlocked after 3 swipes right! (0/3)",
        isUnlocked: false,
      },
      {
        id: 2,
        title: "Weekend Activities",
        description: "Unlock: 5 more interactions needed",
        isUnlocked: false,
      },
    ],
  },
  {
    id: 789,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
    name: "Anonymous Match #789",
    interests: ["Gaming", "Coding", "Basketball"],
    topArtists: ["Porter Robinson", "Daft Punk", "HANS ZIMMER"],
    topMovies: ["Spider‑Verse", "Your Name", "The Dark Knight"],
    memeLine: "I can fix her (I cannot).",
    unlockableDetails: [
      {
        id: 1,
        title: "Favorite Video Game",
        description: "Unlocked after 3 swipes right! (2/3)",
        isUnlocked: true,
      },
      {
        id: 2,
        title: "Tech Stack Preferences",
        description: "Unlock: 5 more interactions needed",
        isUnlocked: false,
      },
    ],
  },
  {
    id: 234,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop",
    name: "Anonymous Match #234",
    interests: ["Cooking", "Travel", "Dancing"],
    topArtists: ["Bad Bunny", "Rema", "Rosalía"],
    topMovies: ["Eat Pray Love", "The Secret Life of Walter Mitty", "Chef"],
    memeLine: "Main character energy.",
    unlockableDetails: [
      {
        id: 1,
        title: "Dream Travel Destination",
        description: "Unlocked after 3 swipes right! (3/3)",
        isUnlocked: true,
      },
      {
        id: 2,
        title: "Favorite Cuisine",
        description: "Unlock: 5 more interactions needed",
        isUnlocked: false,
      },
    ],
  },
];

const mockConfessions = [
  {
    id: 1,
    user: {
      id: 456,
      name: "Anonymous #456",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    content:
      "Saw you in the library today, couldn't stop thinking about your smile.",
    timeAgo: "2 hours ago",
    likes: 12,
    comments: 3,
    isLiked: false,
  },
  {
    id: 2,
    user: {
      id: 789,
      name: "Anonymous #789",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
    },
    content:
      "To the person who returned my lost wallet, you're a real one. Let me buy you a coffee.",
    timeAgo: "5 hours ago",
    likes: 28,
    comments: 7,
    isLiked: true,
  },
  {
    id: 3,
    user: {
      id: 234,
      name: "Anonymous #234",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
    },
    content:
      "Anyone else struggling with calculus? Maybe we could study together sometime?",
    timeAgo: "8 hours ago",
    likes: 15,
    comments: 9,
    isLiked: false,
  },
  {
    id: 4,
    user: {
      id: 567,
      name: "Anonymous #567",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    },
    content:
      "Your laugh in the cafeteria yesterday made my whole week brighter.",
    timeAgo: "1 day ago",
    likes: 34,
    comments: 5,
    isLiked: false,
  },
];

const mockUserProfile = {
  name: "You",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
};

export default function Home() {
  const [confessions, setConfessions] = useState(mockConfessions);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const handleLike = (matchId: number) => {
    console.log("Liked match:", matchId);
    // In real app, this would send data to backend and fetch next match
    // Optionally move to next match
    // setCurrentMatchIndex((prev) => (prev + 1) % mockMatches.length);
  };

  const handlePass = (matchId: number) => {
    console.log("Passed match:", matchId);
    // In real app, this would send data to backend and fetch next match
    // Optionally move to next match
    // setCurrentMatchIndex((prev) => (prev + 1) % mockMatches.length);
  };

  const scrollToMatch = (index: number) => {
    setCurrentMatchIndex(index);
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    const target = container.children[currentMatchIndex] as
      | HTMLElement
      | undefined;
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentMatchIndex]);

  const toggleConfessionLike = (confessionId: number) => {
    setConfessions((prev) =>
      prev.map((confession) => {
        if (confession.id === confessionId) {
          return {
            ...confession,
            isLiked: !confession.isLiked,
            likes: confession.isLiked
              ? confession.likes - 1
              : confession.likes + 1,
          };
        }
        return confession;
      })
    );
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        {/* Header */}
        <Navbar
          showSearch={true}
          currentUser={mockUserProfile}
          onSearchChange={(value) => console.log("Search:", value)}
          onProfileClick={() => console.log("Profile clicked")}
        />

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-80 flex-col border-r border-slate-200/80 dark:border-slate-800/80 p-6 hidden lg:flex">
            <nav className="flex flex-col gap-2">
              <button
                className="flex items-center gap-3 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-3 text-primary cursor-pointer"
                onClick={() => console.log("Chats")}
              >
                <span className="material-symbols-outlined">chat</span>
                <span className="font-bold">Chats</span>
              </button>
              <button
                className="flex items-center gap-3 rounded-full px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors"
                onClick={() => console.log("Hints")}
              >
                <span className="material-symbols-outlined">lightbulb</span>
                <span className="font-medium">Hints</span>
              </button>
              <button
                className="flex items-center gap-3 rounded-full px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors"
                onClick={() => console.log("Settings")}
              >
                <span className="material-symbols-outlined">settings</span>
                <span className="font-medium">Settings</span>
              </button>
              <button
                className="flex items-center gap-3 rounded-full px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors"
                onClick={() => console.log("Profile")}
              >
                <span className="material-symbols-outlined">person</span>
                <span className="font-medium">Profile</span>
              </button>
            </nav>

            {/* Notifications Pane */}
            <div className="mt-6 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 px-1">
                Notifications
              </h3>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
                      style={{
                        backgroundImage:
                          'url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop")',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        <span className="font-semibold">Sarah</span> sent you a
                        message
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        2 minutes ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
                      style={{
                        backgroundImage:
                          'url("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop")',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        <span className="font-semibold">New Match!</span> You
                        matched with someone
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        1 hour ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">
                      favorite
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        Someone liked your confession
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        3 hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 px-6 py-4">
            <div className="flex flex-col gap-8">
              {/* Stories Section */}
              <div className="flex w-full overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex flex-row items-start justify-start gap-5 py-4">
                  {mockStories.map((story) => (
                    <div
                      key={story.id}
                      className="flex flex-col items-center gap-2 w-20 text-center cursor-pointer"
                    >
                      <div
                        className={`w-16 h-16 rounded-full bg-center bg-no-repeat bg-cover transition-transform hover:scale-105 ${
                          story.hasNotification
                            ? "ring-2 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark ring-pink-500"
                            : ""
                        }`}
                        style={{ backgroundImage: `url(${story.image})` }}
                      />
                      <p className="text-sm font-medium">{story.label}</p>
                    </div>
                  ))}
                  <div className="flex flex-col items-center gap-2 w-20 text-center cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-center bg-no-repeat bg-cover flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                      <span className="material-symbols-outlined text-3xl text-slate-500">
                        add
                      </span>
                    </div>
                    <p className="text-sm font-medium">New Post</p>
                  </div>
                </div>
              </div>

              {/* Match Cards Carousel */}
              <div className="relative w-full">
                {/* Carousel Navigation Indicators
                <div className="flex justify-center gap-2 mb-6">
                  {mockMatches.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToMatch(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentMatchIndex
                          ? "w-8 bg-primary"
                          : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                      }`}
                      aria-label={`Go to match ${index + 1}`}
                    />
                  ))}
                </div> */}

                {/* Scrollable Match Cards Container */}
                <div className="relative overflow-hidden py-4">
                  <div
                    ref={carouselRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 scrollbar-hide"
                  >
                    {mockMatches.map((match, index) => {
                      const isFocused = index === currentMatchIndex;
                      return (
                        <div
                          key={match.id}
                          className={`flex-shrink-0 w-full max-w-xl snap-center transition-all duration-300 ${
                            isFocused
                              ? "scale-100 opacity-100"
                              : "scale-90 opacity-40 pointer-events-none"
                          }`}
                          onClick={() => !isFocused && scrollToMatch(index)}
                        >
                          <div className="flex flex-col items-center justify-center gap-6 bg-white rounded-lg p-6 shadow-lg">
                            <div className="w-full max-w-40 aspect-square flex items-center justify-center">
                              <div
                                className="w-full h-full rounded-full overflow-hidden shadow-2xl relative"
                                aria-label="Profile picture (blurred for privacy)"
                              >
                                <img
                                  src={match.image}
                                  alt="Profile"
                                  className="w-full h-full object-cover rounded-full"
                                  style={{
                                    maskImage:
                                      "radial-gradient(circle at center, white 85%, transparent 100%)",
                                    filter: "blur(8px)",
                                  }}
                                />
                                {/* Optional: Faux sharp border */}
                                <div className="absolute inset-0 rounded-full ring ring-white/80 dark:ring-slate-800 pointer-events-none" />
                              </div>
                            </div>
                            <div className="text-center">
                              <h3 className="text-2xl font-bold">
                                {match.name}
                              </h3>
                              <div className="flex gap-2 justify-center mt-3 flex-wrap">
                                {match.interests.map((interest, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-primary/10 dark:bg-primary/20 text-primary text-sm font-semibold px-3 py-1 rounded-full"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                              {/* Taste Quick Facts */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 text-left max-w-md mx-auto">
                                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-semibold">
                                    <span className="material-symbols-outlined text-base">
                                      music_note
                                    </span>
                                    Fav Artists
                                  </div>
                                  <ul className="mt-1 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-0.5">
                                    {match.topArtists.map(
                                      (artist: string, i: number) => (
                                        <li key={i}>{artist}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-semibold">
                                    <span className="material-symbols-outlined text-base">
                                      movie
                                    </span>
                                    Fav Movies
                                  </div>
                                  <ul className="mt-1 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-0.5">
                                    {match.topMovies.map(
                                      (movie: string, i: number) => (
                                        <li key={i}>{movie}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-semibold">
                                    <span className="material-symbols-outlined text-base">
                                      mood
                                    </span>
                                    Meme Line
                                  </div>
                                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 italic break-words">
                                    “{match.memeLine}”
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Unlockable Details */}
                            <div className="w-full max-w-md flex flex-col gap-4">
                              <div className="flex flex-col gap-3 mt-4">
                                <h4 className="text-lg font-bold text-center">
                                  Unlockable Details
                                </h4>
                                {match.unlockableDetails.map((detail) => (
                                  <div
                                    key={detail.id}
                                    className={`flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg ${
                                      !detail.isUnlocked ? "opacity-60" : ""
                                    }`}
                                  >
                                    <span
                                      className={`material-symbols-outlined text-2xl ${
                                        detail.isUnlocked
                                          ? "text-purple-500"
                                          : "text-slate-400"
                                      }`}
                                    >
                                      {detail.isUnlocked ? "lock_open" : "lock"}
                                    </span>
                                    <div>
                                      <p className="font-semibold">
                                        {detail.title}
                                      </p>
                                      <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {detail.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 w-full max-w-md">
                              <button
                                onClick={() => handlePass(match.id)}
                                disabled={!isFocused}
                                className="flex-1 h-16 rounded-lg bg-slate-200/70 dark:bg-slate-800/70 font-bold text-slate-600 dark:text-slate-300 text-lg flex items-center justify-center gap-2 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="material-symbols-outlined">
                                  close
                                </span>{" "}
                                Meh
                              </button>
                              <button
                                onClick={() => handleLike(match.id)}
                                disabled={!isFocused}
                                className="flex-1 h-16 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="material-symbols-outlined">
                                  favorite
                                </span>{" "}
                                Might Work
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Arrows */}
                {currentMatchIndex > 0 && (
                  <button
                    onClick={() => scrollToMatch(currentMatchIndex - 1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Previous match"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      chevron_left
                    </span>
                  </button>
                )}
                {currentMatchIndex < mockMatches.length - 1 && (
                  <button
                    onClick={() => scrollToMatch(currentMatchIndex + 1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Next match"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      chevron_right
                    </span>
                  </button>
                )}
              </div>

              {/* Confessions & Likes Section */}
              <div className="flex flex-col gap-6 pt-8">
                <h2 className="text-2xl font-bold tracking-tight">
                  Confessions & Likes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {confessions.map((confession) => (
                    <div
                      key={confession.id}
                      className="flex flex-col rounded-lg overflow-hidden shadow-lg bg-white dark:bg-slate-900/50 hover:shadow-xl transition-shadow"
                    >
                      <div className="p-4 flex flex-col w-full gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full bg-center bg-no-repeat bg-cover"
                            style={{
                              backgroundImage: `url(${confession.user.avatar})`,
                            }}
                          />
                          <div>
                            <h4 className="font-bold">
                              {confession.user.name}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {confession.timeAgo}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2">{confession.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-slate-500 dark:text-slate-400">
                          <button
                            onClick={() => toggleConfessionLike(confession.id)}
                            className={`flex items-center gap-1.5 transition-colors ${
                              confession.isLiked
                                ? "text-pink-500"
                                : "hover:text-pink-500"
                            }`}
                          >
                            <span className="material-symbols-outlined text-xl">
                              {confession.isLiked
                                ? "favorite"
                                : "favorite_border"}
                            </span>
                            <span
                              className={`text-sm font-medium ${
                                confession.isLiked ? "text-pink-500" : ""
                              }`}
                            >
                              {confession.likes}
                            </span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">
                              mode_comment
                            </span>
                            <span className="text-sm font-medium">
                              {confession.comments}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
