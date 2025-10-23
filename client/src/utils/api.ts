import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      phoneNumber?: string;
      gender?: string;
      age?: number;
      birthday?: string;
      pronouns?: string;
      hint?: string;
      interests?: string[];
      musicPreferences?: string;
      favoriteShows?: string;
      memeVibe?: string;
      image?: string;
      community?: string;
      favoriteSpot?: string;
      loveLanguage?: string;
      quirkyFact?: string;
      fantasies?: string;
      idealDate?: string;
    };
    token: string;
  };
}

// What we send when logging in
interface LoginPayload {
  email?: string;
  phoneNumber?: string;
  password: string;
}

// What we send when registering
interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
  phoneNumber?: string;
  community?: string;
  birthday?: string;
  gender?: string;
  pronouns?: string;
  interests?: string[];
  musicPreferences?: string;
  favoriteShows?: string;
  memeVibe?: string;
  hint?: string;
}

/**
 * LOGIN USER
 * @param payload - Contains email/phone and password
 * @returns Promise with user data and token
 */
export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/api/auth/login", payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * REGISTER NEW USER
 * @param payload - Contains email and password
 * @returns Promise with user data and token
 */
export const registerUser = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/api/auth/register", payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with an error (like email already exists)
      throw new Error(error.response.data.message || "Registration failed");
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * GET CURRENT USER PROFILE
 * @param token - The JWT token from localStorage
 * @returns Promise with user data
 */
export const getCurrentUser = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await api.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch profile");
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * UPDATE USER PROFILE
 * Updates user profile with onboarding data
 * @param data - Profile data to update
 * @param token - JWT token for authentication
 * @returns Promise with updated user data
 */
export const updateUserProfile = async (
  data: any,
  token: string
): Promise<AuthResponse> => {
  try {
    const response = await api.put("/api/user/profile", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to update profile"
      );
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * UPDATE USER SETTINGS
 * Updates privacy and app preference settings
 * @param data - Settings payload
 * @param token - JWT token for authentication
 * @returns Promise with updated user data
 */
export const updateUserSettings = async (
  data: {
    pushNotifications?: boolean;
    emailNotifications?: boolean;
    showActiveStatus?: boolean;
    hideDisplayPicture?: boolean;
  },
  token: string
): Promise<AuthResponse> => {
  try {
    const response = await api.put("/api/user/settings", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to update settings"
      );
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * CHANGE PASSWORD
 * Changes user password
 * @param data - Password change payload
 * @param token - JWT token for authentication
 * @returns Promise with success response
 */
export const changePassword = async (
  data: {
    currentPassword: string;
    newPassword: string;
  },
  token: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.put("/api/auth/change-password", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to change password"
      );
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * GET POTENTIAL MATCHES
 * Fetches users you can swipe on
 * @param token - JWT token for authentication
 * @returns Promise with potential matches
 */
export const getPotentialMatches = async (token: string): Promise<any> => {
  try {
    const response = await api.get("/api/user/potential-matches", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch matches");
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * SWIPE ON A USER
 * Swipes right (like) or left (pass) on a user
 * @param userId - The user ID to swipe on
 * @param action - "like" or "pass"
 * @param token - JWT token for authentication
 * @returns Promise with swipe result
 */
export const swipeUser = async (
  userId: string,
  action: "like" | "pass",
  token: string
): Promise<any> => {
  try {
    const response = await api.post(
      "/api/match/swipe",
      {
        targetUserId: userId,
        action: action,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to swipe");
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * GET MATCHES
 * Fetches all mutual matches
 * @param token - JWT token for authentication
 * @returns Promise with matches
 */
export const getMatches = async (token: string): Promise<any> => {
  try {
    const response = await api.get("/api/match/matches", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch matches");
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * CREATE CONFESSION
 * Creates a new confession
 * @param data - Confession data
 * @param token - JWT token for authentication
 * @returns Promise with confession data
 */
export const createConfession = async (
  data: {
    text: string;
  },
  token: string
): Promise<{
  success: boolean;
  message: string;
  data?: {
    confession: any;
  };
}> => {
  try {
    const response = await api.post("/api/confessions", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to create confession"
      );
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * GET CONFESSIONS
 * Fetches confessions for the user's domain
 * @param token - JWT token for authentication
 * @param page - Page number for pagination
 * @param limit - Number of confessions per page
 * @returns Promise with confessions data
 */
export const getConfessions = async (
  token: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  success: boolean;
  data: {
    confessions: any[];
    currentPage: number;
    totalPages: number;
    totalConfessions: number;
  };
}> => {
  try {
    const response = await api.get("/api/confessions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch confessions"
      );
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * LIKE CONFESSION
 * Likes a confession
 * @param confessionId - The confession ID to like
 * @param token - JWT token for authentication
 * @returns Promise with like result
 */
export const likeConfession = async (
  confessionId: string,
  token: string
): Promise<{
  success: boolean;
  message: string;
  data: {
    likesCount: number;
  };
}> => {
  try {
    const response = await api.post(
      `/api/confessions/${confessionId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to like confession"
      );
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * COMMENT ON CONFESSION
 * Adds a comment to a confession
 * @param confessionId - The confession ID to comment on
 * @param data - Comment data
 * @param token - JWT token for authentication
 * @returns Promise with comment result
 */
export const commentOnConfession = async (
  confessionId: string,
  data: {
    text: string;
  },
  token: string
): Promise<{
  success: boolean;
  message: string;
  data: {
    comments: any[];
    commentsCount: number;
  };
}> => {
  try {
    const response = await api.post(
      `/api/confessions/${confessionId}/comment`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to comment on confession"
      );
    } else if (error.request) {
      throw new Error("Cannot connect to server. Please try again.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export default api;
