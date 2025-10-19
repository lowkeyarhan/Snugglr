import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

// Mock data - will be replaced with API call in the future
const mockUserData = {
  name: "Sophia",
  university: "University of California",
  dateOfBirth: "2003-05-15",
  contactNumber: "+1 (555) 123-4567",
  pronouns: "She/Her",
  interests: "Art Club, Hiking, Philosophy of Mind",
  memes: "Surprised Pikachu, Woman Yelling at a Cat",
  music: "Phoebe Bridgers, Tame Impala, Frank Ocean",
  movies: "Before Sunrise, Eternal Sunshine of the Spotless Mind",
  favoriteSpot: "Main Library, 3rd Floor near the window",
  fantasies: "Traveling to Japan, Opening my own art studio",
  idealDate: "Sunset picnic at the beach with good conversation",
  loveLanguage: "Quality Time",
  quirkyFact: "I can solve a Rubik's cube in under 2 minutes",
  hint: "You've probably seen me sketching in the campus courtyard",
  profileImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBsp3vphLUGghOkvBEYWbre6Mr0vR35W3B9UO7-t5jHtIFz1tVyIVH0uugVFQH3vgMnJzYmT6YjklGUsY4Bi7GAe-1c-zPiWz7CRwrkpxWShIuAwD9hyhS7r3jnuAWXevlynxlahGDd4Wxd6JCYNoJ-ZBlDt9ua3sow5v5vvoZI6Imlr8Fn-7BQ-oEAg5-nKDrVK2qPnhF0mAyeh6IUwYyZSXalCfpWlc5Fo3RIX4GQ8FLDpuxTSXRcV9y3crjsFHhXMNRiW6lNLY_L",
};

export default function Profile() {
  // Form state
  const [formData, setFormData] = useState(mockUserData);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data from backend
  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchUserProfile().then(data => setFormData(data))
    setTimeout(() => {
      setFormData(mockUserData);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save logic with API call
    console.log("Saving profile data:", formData);
    // updateUserProfile(formData).then(() => { show success message })
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload
    console.log("Upload profile picture");
  };

  if (isLoading) {
    return (
      <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
        <div className="flex h-full w-full">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading profile...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto h-screen">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Edit Your Profile
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Keep your info fresh and find your perfect match!
              </p>
            </div>

            {/* Profile Picture */}
            <div className="relative flex flex-col items-center gap-6 mb-10">
              <div className="relative group">
                <div
                  className="w-32 h-32 rounded-full bg-cover bg-center  shadow-lg"
                  style={{
                    backgroundImage: `url("${formData.profileImage}")`,
                  }}
                />
                <button
                  onClick={handleImageUpload}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-white text-4xl">
                    photo_camera
                  </span>
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click to change profile picture
              </p>
            </div>

            {/* Two Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-card-dark rounded-2xl shadow-soft dark:shadow-glow/50 border border-slate-100 dark:border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    person
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Personal Info
                  </h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      University
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="Your University"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Pronouns
                      </label>
                      <select
                        name="pronouns"
                        value={formData.pronouns}
                        onChange={handleInputChange}
                        className="form-select w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      >
                        <option value="">Select</option>
                        <option value="He/Him">He/Him</option>
                        <option value="She/Her">She/Her</option>
                        <option value="They/Them">They/Them</option>
                        <option value="He/They">He/They</option>
                        <option value="She/They">She/They</option>
                        <option value="Ze/Hir">Ze/Hir</option>
                        <option value="Ze/Zir">Ze/Zir</option>
                        <option value="Xe/Xem">Xe/Xem</option>
                        <option value="Ey/Em">Ey/Em</option>
                        <option value="Ve/Ver">Ve/Ver</option>
                        <option value="Fae/Faer">Fae/Faer</option>
                        <option value="Per/Per">Per/Per</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Your World, Your Vibe */}
              <div className="bg-white dark:bg-card-dark rounded-2xl shadow-soft dark:shadow-glow/50 border border-slate-100 dark:border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    palette
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Vibe
                  </h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Your Interests
                    </label>
                    <input
                      type="text"
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="e.g., Coding Club, Hiking, Psych 101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Favorite Memes
                    </label>
                    <input
                      type="text"
                      name="memes"
                      value={formData.memes}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="e.g., Distracted Boyfriend"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Music Taste
                    </label>
                    <input
                      type="text"
                      name="music"
                      value={formData.music}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="e.g., Taylor Swift, Drake"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Movie/Show Taste
                    </label>
                    <input
                      type="text"
                      name="movies"
                      value={formData.movies}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="e.g., The Matrix, Parasite"
                    />
                  </div>
                </div>
              </div>

              {/* Campus Life */}
              <div className="bg-white dark:bg-card-dark rounded-2xl shadow-soft dark:shadow-glow/50 border border-slate-100 dark:border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    school
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Campus Life
                  </h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Favorite Spot on Campus
                    </label>
                    <input
                      type="text"
                      name="favoriteSpot"
                      value={formData.favoriteSpot}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="Where do you spend most of your day?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Quirky Fact About You
                    </label>
                    <input
                      type="text"
                      name="quirkyFact"
                      value={formData.quirkyFact}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="Something unique about you"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Love Language
                    </label>
                    <input
                      type="text"
                      name="loveLanguage"
                      value={formData.loveLanguage}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="e.g., Quality Time, Physical Touch"
                    />
                  </div>
                </div>
              </div>

              {/* Dreams & Desires */}
              <div className="bg-white dark:bg-card-dark rounded-2xl shadow-soft dark:shadow-glow/50 border border-slate-100 dark:border-primary/20 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    auto_awesome
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Dreams & Desires
                  </h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Your Fantasies & Dreams
                    </label>
                    <textarea
                      name="fantasies"
                      value={formData.fantasies}
                      onChange={handleInputChange}
                      className="w-full min-h-[80px] p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="What do you dream about?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Ideal Date
                    </label>
                    <textarea
                      name="idealDate"
                      value={formData.idealDate}
                      onChange={handleInputChange}
                      className="w-full min-h-[80px] p-3 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/50 placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="Describe your perfect date"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* The Mystery - Full Width */}
            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">
                  psychology
                </span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  The Mystery
                </h2>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  A Hint About Your Identity
                </label>
                <textarea
                  name="hint"
                  value={formData.hint}
                  onChange={handleInputChange}
                  className="w-full min-h-[120px] p-4 rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-gray-800/70 placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none outline-none focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                  placeholder="Drop a subtle clue... Keep them guessing"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                  Tip: Make it intriguing but not too obvious. Let them earn
                  the reveal!
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center pb-8">
              <button
                onClick={handleSave}
                className="px-12 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg tracking-wide shadow-lg shadow-primary/40 dark:shadow-glow transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-2xl">save</span>
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
