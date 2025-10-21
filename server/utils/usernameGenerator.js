// Catchy username generator for anonymity

const adjectives = [
  "Silent",
  "Brave",
  "Cosmic",
  "Happy",
  "Mystery",
  "Lucky",
  "Gentle",
  "Wild",
  "Cool",
  "Swift",
  "Bright",
  "Dark",
  "Golden",
  "Silver",
  "Mystic",
  "Epic",
  "Chill",
  "Curious",
  "Dreamy",
  "Funky",
  "Mighty",
  "Noble",
  "Quirky",
  "Rebel",
  "Sneaky",
  "Sunny",
  "Thunder",
  "Velvet",
  "Wacky",
  "Zen",
  "Azure",
  "Blazing",
  "Crystal",
  "Daring",
  "Electric",
  "Frosty",
  "Glowing",
  "Hidden",
  "Icy",
  "Jolly",
  "Kinetic",
  "Lunar",
  "Magnetic",
  "Neon",
  "Omega",
  "Phantom",
  "Quantum",
  "Radiant",
  "Stellar",
  "Turbo",
  "Ultra",
  "Vivid",
  "Whimsy",
  "Xeno",
  "Zesty",
];

const nouns = [
  "Panda",
  "Wolf",
  "Dragon",
  "Phoenix",
  "Tiger",
  "Eagle",
  "Fox",
  "Lion",
  "Bear",
  "Hawk",
  "Owl",
  "Shark",
  "Dolphin",
  "Raven",
  "Falcon",
  "Leopard",
  "Panther",
  "Viper",
  "Cobra",
  "Lynx",
  "Thunder",
  "Storm",
  "Flame",
  "Shadow",
  "Spirit",
  "Ghost",
  "Knight",
  "Ninja",
  "Wizard",
  "Samurai",
  "Ranger",
  "Hunter",
  "Rider",
  "Warrior",
  "Sage",
  "Oracle",
  "Mystic",
  "Cipher",
  "Nova",
  "Comet",
  "Star",
  "Moon",
  "Sun",
  "Galaxy",
  "Blade",
  "Arrow",
  "Shield",
  "Crown",
  "Gem",
  "Pearl",
  "Ocean",
  "River",
  "Mountain",
  "Forest",
  "Desert",
  "Tundra",
];

/**
 * Generate a catchy random username
 * @returns {string} A randomly generated catchy username
 */
export const generateCatchyUsername = () => {
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(Math.random() * 999);

  // Randomly decide whether to add a number (50% chance)
  if (Math.random() > 0.5) {
    return `${randomAdj}${randomNoun}${randomNum}`;
  }
  return `${randomAdj}${randomNoun}`;
};

/**
 * Generate a unique username that doesn't exist in the database
 * @param {Model} UserModel - The User model to check against
 * @returns {Promise<string>} A unique catchy username
 */
export const generateUniqueUsername = async (UserModel) => {
  let username;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    username = generateCatchyUsername();
    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
      isUnique = true;
    }
    attempts++;
  }

  // If we couldn't find a unique username without numbers, force add a timestamp
  if (!isUnique) {
    const timestamp = Date.now().toString().slice(-4);
    username = `${generateCatchyUsername()}${timestamp}`;
  }

  return username;
};
