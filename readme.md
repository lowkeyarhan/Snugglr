# Snugglr - Anonymous College Dating App

## 🎯 Project Overview

**Snugglr** is an anonymous college dating app where personality comes first. Unlike traditional dating apps that focus on photos and appearance, Snugglr matches users based on their "vibe profile" - interests, music taste, movies, memes, and personality traits. Users remain anonymous through emoji avatars and usernames until both parties guess each other's identity correctly, creating a unique and pressure-free dating experience.

### Core Concept

- **Personality First**: Match based on vibes, not looks
- **Anonymous Until Ready**: Users stay anonymous with emoji avatars and pseudonyms
- **Guessing Game**: Both users must correctly guess each other's identity to reveal
- **Campus-Focused**: Limited to verified college students (.edu emails)
- **Progressive Revelation**: Details unlock as users interact more

---

## 🏗️ Frontend Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Material Symbols (Google Icons)
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Real-time**: Socket.io Client (for chat and notifications)

---

## 📱 Application Structure

### Routes & Pages

The application consists of 7 main pages:

1. **Landing Page** (`/`) - Marketing landing page for new users
2. **Auth Page** (`/auth`) - Sign up / Login page
3. **Onboarding** (`/onboarding`) - Profile creation after signup
4. **Home** (`/home`) - Main feed with matching, confessions, and stories
5. **Chat** (`/chat`) - Real-time messaging with matches
6. **Profile** (`/profile`) - Edit user profile
7. **Settings** (`/settings`) - App preferences and privacy settings

---

## 🎨 Detailed Features by Page

### 1. Landing Page (`pages/landing.tsx`)

**Purpose**: Marketing page to attract new users and explain the app

**Features**:

- Animated hero section with Framer Motion
- Sticky navigation bar with smooth scroll
- Four main sections:
  - **Hero**: Eye-catching headline, CTA buttons
  - **How It Works**: 4-step process explanation
  - **Features**: Vibe-based matching, anonymous confessions, pressure-free chat
  - **FAQ**: Expandable accordion for common questions
  - **Signup CTA**: Email waitlist form
- Footer with links and navigation
- Responsive design (mobile-first)
- Scroll-to-section functionality
- Dark mode support

**UI Elements**:

- Gradient backgrounds with animated blobs
- Glass-morphism cards
- Smooth scroll animations
- Material icons throughout

---

### 2. Auth Page (`pages/auth.tsx`)

**Purpose**: User authentication (Sign Up / Login)

**Features**:

- Tab switcher between Sign Up and Login
- Form validation (email must be .edu domain)
- Email input with school icon
- Password input with lock icon
- "Forgot Password" link (Login only)
- Phone mockup preview showing app interface
- Terms of Service and Privacy Policy agreement
- Animated background gradients
- Dark mode support

**Form Fields**:

- Email (required, must be college email)
- Password (required)

**UI Details**:

- Left side: Auth form
- Right side (desktop): Phone mockup showing app preview
- Responsive: Stacks on mobile

**Design Notes**:

- Uses Material icons for input fields
- Hover effects on buttons
- Focus states on inputs
- Validation styling

---

### 3. Onboarding Page (`pages/onboarding.tsx`)

**Purpose**: Create user profile after signup

**Features**:

- Two-column grid layout (desktop)
- Profile picture upload with preview
- Auto-blur notice for privacy
- All profile fields in organized sections

**Sections**:

#### Personal Info Card:

- Name (text input)
- University (text input)
- Date of Birth (date picker)
- Gender (dropdown: Male, Female)
- Pronouns (dropdown with 12 options: He/Him, She/Her, They/Them, etc.)

#### Your Vibe Card:

- Interests (comma-separated tags)
- Music taste (text input for favorite artists/songs)
- Movie/Show taste (text input)
- Meme Vibe (describe sense of humor)

#### The Mystery Section:

- Avatar upload (with blur notice)
- Fun Bio (textarea for quirky hints)
- Optional but encourages mystery

**Form Behavior**:

- Real-time state updates
- File preview for avatar
- Submit button with arrow icon
- Responsive grid (stacks on mobile)

**Validation**:

- Client-side validation
- Required fields marked

---

### 4. Home Page (`pages/home.tsx`)

**Purpose**: Main feed - matching, confessions, and stories

**Features**:

#### Stories Section (Top):

- Horizontal scrollable stories
- Circular avatars with notification rings
- Labels: "Sarah", "New match!", "Ur confession", "Likes"
- "New Post" button to create story
- Instagram-style story design

#### Match Cards Carousel:

- Horizontal scrollable match cards
- Focus on center card (others dimmed)
- Navigation arrows (left/right)
- Snap-to-center scrolling

**Each Match Card Shows**:

- Blurred profile picture (circular, anonymized)
- Anonymous ID (e.g., "Anonymous Match #123")
- Interests tags (Music, Hiking, Art)
- Taste quick facts in 3 columns:
  - Favorite Artists (with music icon)
  - Favorite Movies (with movie icon)
  - Meme Line (with mood icon)
- Unlockable Details section:
  - Shows locked/unlocked status
  - Progress indicators (e.g., "1/3", "2/3")
  - Lock/unlock icons
- Action buttons:
  - **"Meh"** button (pass/swipe left)
  - **"Might Work"** button (like/swipe right)

**Swipe Actions**:

- Like: Potential match created
- Pass: Move to next profile
- Buttons only active when card is focused

#### Confessions & Likes Section:

- Grid layout (1-3 columns based on screen size)
- Anonymous confession cards with:
  - Anonymous avatar and ID
  - Time posted ("2 hours ago")
  - Confession text content
  - Like button (heart icon) with count
  - Comment button with count
  - Real-time like toggle

**Interactions**:

- Click to like/unlike confessions
- Like count updates in real-time
- Hover effects on cards

**UI Details**:

- Sidebar always visible (desktop)
- Full-width scrollable content
- Smooth carousel animations
- Loading states
- Empty states for no matches

---

### 5. Chat Page (`pages/chat.tsx`)

**Purpose**: Real-time anonymous messaging with matches

**Layout**: 3-column layout (desktop)

1. Left: Icon-only sidebar
2. Middle-Left: Chat list
3. Center-Right: Active chat + Right sidebar

**Features**:

#### Chat List (Left Sidebar):

- Search bar for filtering chats
- All active chats listed
- Each chat shows:
  - Emoji avatar (e.g., 🤫, 😇, 😎)
  - Anonymous username (e.g., "MysticWanderer")
  - Last message preview
  - Online indicator (green dot)
  - Unread count badge
  - Time of last message
- Active chat highlighted
- Click to select chat

#### Chat Header:

- Anonymous username
- Emoji avatar
- Online/Offline status
- Action buttons:
  - Call (placeholder)
  - Video call (placeholder)
  - More options

#### Messages Area:

- Instagram/iMessage style bubbles
- Message grouping:
  - Consecutive messages grouped
  - Dynamic border radius
  - 2+ minute gap breaks grouping
- Sent messages: Right side, primary color
- Received messages: Left side, gray
- Timestamps not shown (for anonymity)
- **No typing indicators** (for anonymity)
- **No read receipts** (for anonymity)
- Only shows online/offline status

#### Message Input (Bottom):

- Text input field (max 1000 characters)
- Emoji picker button
- Image attachment button
- Mic button (placeholder)
- Add button (for more options)
- Enter to send

#### Right Sidebar (Guessing Game Panel):

**Profile Preview**:

- Large emoji avatar
- Anonymous username
- Online/Active status

**Shared Interests**:

- Pills/badges showing common interests
- Material icons for each interest
- Examples: Hiking, Indie Music, Photography

**Guessing Game**:

- Title: "The Guessing Game"
- Description text explaining the feature
- Guess input field with search icon
- Two guess status cards:
  1. **Your Guess**: Shows your profile pic
     - "Waiting for you..." (if not guessed)
     - Shows guess (if submitted)
  2. **Partner's Guess**: Shows their emoji
     - "Hasn't guessed yet" (if not guessed)
     - "Has guessed" (if submitted, but doesn't show what)
- **Reveal Identity Button**:
  - Locked until both guess correctly
  - Lock icon when disabled
  - Enables when both users guess correctly
  - Reveals real identities when clicked

**Real-time Features**:

- Messages appear instantly via Socket.io
- Online status updates live
- Unread counts update in real-time
- No typing indicators (for anonymity)

**Search & Filter**:

- Search chats by username
- Real-time filtering
- "No chats found" empty state

---

### 6. Profile Page (`pages/profile.tsx`)

**Purpose**: Edit user profile and update information

**Features**:

- Loading state with spinner
- Profile picture with hover-to-edit overlay
- Two-column grid layout

**Editable Sections**:

#### 1. Personal Info Card:

- Name
- University
- Date of Birth
- Pronouns (dropdown)
- Contact Number

#### 2. Your Vibe Card:

- Your Interests (comma-separated)
- Favorite Memes
- Music Taste
- Movie/Show Taste

#### 3. Campus Life Card:

- Favorite Spot on Campus
- Quirky Fact About You
- Love Language

#### 4. Dreams & Desires Card:

- Your Fantasies & Dreams (textarea)
- Ideal Date (textarea)

#### 5. The Mystery (Full-width):

- A Hint About Your Identity (large textarea)
- Tip: "Make it intriguing but not too obvious"

**UI Features**:

- All fields pre-populated with user data
- Real-time form state management
- Save button at bottom (with save icon)
- Sidebar visible
- Responsive grid (stacks on mobile)

**Interactions**:

- Click profile pic to upload new one
- Type to edit any field
- Click Save to persist changes
- Loading state while fetching data

---

### 7. Settings Page (`pages/settings.tsx`)

**Purpose**: App preferences, privacy, and account management

**Features**:

#### Account Settings Section:

- Email (display only)
- Change Password (navigates to form)
- Linked College Accounts

#### Privacy & Safety Section:

- **Show Active Status** (toggle switch)
- **Hide Display Picture** (toggle switch)
- Blocked & Reported Users (navigates to list)
- Data Sharing preferences

#### App Preferences Section:

- **Push Notifications** (toggle switch)
- **Email Notifications** (toggle switch)
- Theme Preferences (light/dark mode)
- Sound Settings

#### Support & Help Section:

- FAQs
- Contact Support
- Terms of Service
- Privacy Policy

#### Logout Button:

- Red gradient button
- Logout icon with rotation on hover
- Positioned at bottom

**UI Details**:

- Card-based layout
- Toggle switches with animations
- Chevron arrows for navigation items
- Hover effects on clickable items
- Icons for each section

---

## 🎨 Design System

### Color Palette

**Light Mode**:

- Background: `bg-background-light` (light gray/white)
- Card: `bg-card-light` (white)
- Text: `text-text-light` (dark gray/black)
- Primary: `bg-primary` (purple/pink accent)
- Secondary: `bg-secondary` (complementary color)
- Muted: `text-muted-light` (gray)

**Dark Mode**:

- Background: `bg-background-dark` (dark gray/black)
- Card: `bg-card-dark` (dark card)
- Text: `text-text-dark` (white/light gray)
- Primary: `bg-primary-dark`
- Secondary: `bg-secondary-dark`
- Muted: `text-muted-dark`

### Typography

- **Primary Font**: Pacifico (for logo and headings)
- **Body Font**: Default system font
- **Headings**: Bold, tracking-tight
- **Body**: Regular weight

### Components

#### Sidebar Component (`components/Sidebar.tsx`)

**Features**:

- Collapsible (icon-only mode)
- Navigation items:
  - Home (home icon)
  - Chats (chat_bubble icon)
  - Hints (lightbulb icon)
  - Settings (settings icon)
  - Profile (account_circle icon)
- Active route highlighting
- Notification pane (when expanded):
  - Recent notifications
  - Avatars and timestamps
  - Click to view details
- Profile picture at bottom (collapsed mode)
- Snugglr logo at top

**States**:

- Expanded (w-72): Shows labels and notifications
- Collapsed (w-20): Shows only icons

#### Landing Navbar Component (`components/landingNavbar.tsx`)

**Features**:

- Sticky at top
- Logo on left (clickable to home)
- Navigation links: How it Works, Features, FAQ
- "Join the Waitlist" button on right
- Smooth scroll to sections
- Backdrop blur effect
- Dark mode support

---

## 🎭 Animations & Interactions

### Framer Motion Animations

**Landing Page**:

- `fadeInUp`: Elements fade and slide up on scroll
- `fadeIn`: Simple fade in
- `scaleIn`: Elements scale and fade in
- `staggerContainer`: Child elements animate in sequence

**Interactions**:

- Button hover: Scale up (1.05)
- Card hover: Shadow lift and translate up
- Navigation hover: Color change
- Smooth page transitions

### CSS Animations

**Custom Animations** (in `index.css`):

- `animate-float`: Floating gradient blobs
- `animate-fadeIn`: Fade in with delay
- `animate-spin`: Loading spinners
- Hover transforms on buttons and cards

---

## 🔄 State Management

### Local State (useState)

Each page manages its own state:

- Form inputs
- UI toggles
- Selected items
- Loading states

**Examples**:

- Chat: `activeChatId`, `messages`, `messageInput`, `searchQuery`
- Home: `currentMatchIndex`, `confessions`
- Profile: `formData`, `isLoading`
- Settings: Toggle states for preferences

### Memoization (useMemo)

Used for performance optimization:

- Filtered lists (chat search)
- Active chat data
- Computed values

### Effects (useEffect)

Used for:

- Data fetching on mount
- Scroll behaviors
- Real-time listeners (Socket.io)

---

## 📡 API Integration (Planned)

### Expected Backend Endpoints

Based on frontend implementation, these APIs are needed:

#### Authentication:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

#### User Profile:

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `POST /api/users/profile/image`

#### Matching:

- `GET /api/matches/potential`
- `POST /api/matches/swipe`
- `GET /api/matches`

#### Chat:

- `GET /api/chats`
- `GET /api/chats/:chatId/messages`
- `POST /api/chats/:chatId/messages`
- `POST /api/chats/:chatId/guess`
- `POST /api/chats/:chatId/reveal`

#### Confessions:

- `GET /api/confessions`
- `POST /api/confessions`
- `POST /api/confessions/:id/like`

#### Stories:

- `GET /api/stories`
- `POST /api/stories`

### Socket.io Events

**Client Emits**:

- `authenticate`
- `join-chat`
- `send-message`
- `user-online`

**Client Listens**:

- `receive-message`
- `user-status-changed`
- `new-notification`
- `match-found`

---

## 🎯 Key Features Summary

### 1. Anonymous Matching

- Swipe-based matching system
- Personality-first profiles
- Blurred profile pictures
- Emoji avatars and pseudonyms
- Progressive detail unlocking

### 2. Guessing Game

- Both users guess identities
- Reveal unlocks when both guess correctly
- Input validation
- Status tracking for both users
- Integrated into chat interface

### 3. Real-time Chat

- Socket.io integration
- Message grouping
- Online/offline status only (no typing or read receipts)
- Image sharing
- Anonymous until reveal
- Unread message tracking

### 4. Social Feed

- Anonymous confessions
- Like and comment system
- Stories (24-hour expiring)
- Campus-specific content

### 5. Profile Management

- Comprehensive profile editing
- Multiple sections (personal, vibe, campus, dreams)
- The Mystery hint system
- Profile picture with blur

### 6. Privacy & Settings

- Granular privacy controls
- Active status toggle
- Hide display picture option
- Notification preferences
- Block and report features

---

## 🎨 UI/UX Highlights

### Design Principles

- **Mobile-first**: Responsive on all devices
- **Dark mode**: Full dark mode support
- **Accessibility**: Semantic HTML, ARIA labels
- **Performance**: Optimized animations, lazy loading
- **Consistency**: Unified design system

### User Experience

- **Smooth transitions**: Framer Motion animations
- **Instant feedback**: Hover states, active states
- **Loading states**: Spinners, skeletons
- **Empty states**: Helpful messages when no data
- **Error handling**: User-friendly error messages

### Interaction Patterns

- **Card-based UI**: Easy to scan and interact
- **Horizontal scrolling**: For stories and matches
- **Snap scrolling**: Focus on one item at a time
- **Toggle switches**: Clear on/off states
- **Icon buttons**: Quick access to actions

---

## 📱 Responsive Design

### Breakpoints

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

### Mobile Optimizations

- Stacked layouts replace grids
- Hidden sidebar (hamburger menu concept)
- Simplified navigation
- Touch-optimized buttons
- Full-width cards

### Desktop Enhancements

- Multi-column layouts
- Visible sidebar
- Hover effects
- Keyboard shortcuts support
- Wider content areas

---

## 🚀 Performance Optimizations

### Code Splitting

- Route-based code splitting with React Router
- Lazy loading of images
- On-demand component loading

### Asset Optimization

- Optimized images (WebP format)
- Icon sprites
- Compressed CSS/JS bundles

### Rendering Optimization

- `useMemo` for computed values
- `useCallback` for event handlers
- Virtual scrolling for long lists (planned)
- Debounced search inputs

---

## 🔐 Security Considerations

### Frontend Security

- Email validation (.edu domain)
- Input sanitization
- XSS protection (React's built-in)
- HTTPS-only in production
- Secure token storage (localStorage/cookies)

### Privacy Features

- Anonymous mode by default
- Optional identity reveal
- Blurred profile pictures
- No visible personal info until reveal
- Block and report functionality

---

## 🎨 Material Design Icons

All icons use Material Symbols from Google:

- `home`, `chat_bubble`, `lightbulb`, `settings`, `account_circle`
- `favorite`, `favorite_border`, `mode_comment`
- `lock`, `lock_open`, `person_search`
- `school`, `music_note`, `movie`, `mood`
- `add`, `search`, `notifications`, `logout`
- And many more...

---

## 📦 Dependencies

### Core:

- `react` & `react-dom`
- `typescript`
- `vite`

### Routing:

- `react-router-dom`

### Styling:

- `tailwindcss`
- `postcss`
- `autoprefixer`

### Animations:

- `framer-motion`

### Real-time (Planned):

- `socket.io-client`

### Forms (Planned):

- Form validation library (e.g., `react-hook-form`, `yup`)

### HTTP Requests (Planned):

- `axios` or `fetch` API

---

## 🎯 Future Features (Not Yet Implemented)

### Phase 2:

- Voice messages in chat
- Video call integration
- Advanced search and filters
- Match recommendations algorithm
- In-app notifications panel

### Phase 3:

- Story reactions and replies
- Group chats
- Events and meetups
- Gamification (badges, achievements)
- AI-powered matching

---

## 🛠️ Development Setup

### Prerequisites:

```bash
Node.js >= 18.x
npm >= 9.x
```

### Installation:

```bash
cd client
npm install
```

### Run Development Server:

```bash
npm run dev
```

### Build for Production:

```bash
npm run build
```

### Preview Production Build:

```bash
npm run preview
```

---

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   └── landingNavbar.tsx
│   ├── pages/
│   │   ├── landing.tsx
│   │   ├── auth.tsx
│   │   ├── onboarding.tsx
│   │   ├── home.tsx
│   │   ├── chat.tsx
│   │   ├── profile.tsx
│   │   └── settings.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Styling Conventions

### Tailwind Classes:

- Use utility-first approach
- Custom colors defined in config
- Consistent spacing (4, 6, 8, 12, 16, 24, 32)
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Dark mode: `dark:` prefix

### Component Styling:

- BEM-like naming for custom CSS
- Scoped styles where needed
- CSS variables for theme colors
- Animations defined in Tailwind config

---

## 🧪 Testing (To Be Implemented)

### Unit Tests:

- React Testing Library
- Jest

### E2E Tests:

- Cypress or Playwright

### Coverage:

- Aim for >80% coverage on critical paths

---

## 📝 Notes for Backend Development

### Key Frontend Expectations:

1. **All APIs return JSON** in format:

   ```json
   {
     "success": true,
     "data": {},
     "message": "Success"
   }
   ```

2. **Authentication**: JWT tokens expected

   - Stored in localStorage
   - Sent in Authorization header

3. **Real-time**: Socket.io connection expected at `/sockets`

4. **File Uploads**: multipart/form-data

   - Profile images → Google Drive
   - Chat images → Google Drive
   - Returns: `{ url, driveFileId }`

5. **Pagination**: Query params `?page=1&limit=20`

6. **Error Handling**: Structured error responses
   ```json
   {
     "success": false,
     "error": {
       "message": "Error description",
       "code": "ERROR_CODE"
     }
   }
   ```

---

## 🎯 Critical User Flows

### 1. Sign Up Flow:

Landing → Auth (Sign Up) → Onboarding → Home

### 2. Matching Flow:

Home → View match card → Swipe (Like/Pass) → Match created → Chat notification

### 3. Chat Flow:

Chat list → Select chat → Send messages → Submit guess → Both guess correctly → Reveal identities

### 4. Profile Flow:

Sidebar → Profile → Edit fields → Save → Success message

### 5. Settings Flow:

Sidebar → Settings → Toggle preferences → Auto-save

---

## 🎨 Brand Identity

### Logo:

- Pacifico font
- "Snugglr" text
- Geometric icon (simple shape)
- Colors: Primary purple/pink

### Tagline:

"Where personality comes first"

### Voice & Tone:

- Friendly and approachable
- Fun but not childish
- Encouraging authenticity
- Privacy-focused
- College-appropriate

---

## 📚 Additional Resources

- Backend Requirements: See `projectRequirements.md`
- Design System: Tailwind config
- API Documentation: (To be created)
- User Guide: (To be created)

---

## 👨‍💻 Development Guidelines

### Code Style:

- TypeScript strict mode
- ESLint rules enforced
- Prettier for formatting
- Meaningful variable names
- Component documentation

### Git Workflow:

- Feature branches
- Pull requests for review
- Commit message conventions
- No direct commits to main

### Component Structure:

```tsx
// Imports
// Types/Interfaces
// Component
// Exports
```

---

## 🎉 Summary

Snugglr is a modern, anonymous dating app for college students that prioritizes personality over appearance. The frontend is built with React, TypeScript, and Tailwind CSS, featuring:

- 7 main pages with distinct purposes
- Anonymous matching with progressive revelation
- Real-time chat with guessing game
- Social features (confessions, stories)
- Comprehensive profile management
- Privacy-focused design
- Beautiful, responsive UI with dark mode
- Smooth animations and interactions

The app creates a unique, pressure-free environment where students can connect based on shared interests and compatible personalities, with the added excitement of guessing each other's identities before the big reveal.

---

**Built with ❤️ by Arhan for college students everywhere**
