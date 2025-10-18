import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut" as const,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut" as const,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut" as const,
    },
  },
};

export default function Landing() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/30">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 text-primary">
                <svg
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_6_319)">
                    <path
                      d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                      fill="currentColor"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_6_319">
                      <rect fill="white" height="48" width="48"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-3xl font-bold font-pacifico">Snugglr</h2>
            </div>
            <div className="flex flex-1 items-center justify-end gap-6">
              <nav className="hidden md:flex items-center gap-8">
                <a
                  className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors"
                  href="#how-it-works"
                >
                  How it Works
                </a>
                <a
                  className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors"
                  href="#features"
                >
                  Features
                </a>
                <a
                  className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors"
                  href="#faq"
                >
                  FAQ
                </a>
              </nav>
              <a
                className="flex items-center justify-center overflow-hidden rounded-full h-11 px-8 bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary-dark transition-colors shadow-soft"
                href="#signup"
              >
                <span className="truncate">Join the Waitlist</span>
              </a>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col">
          {/* Hero Section */}
          <section className="relative py-24 px-6 lg:py-40 flex items-center justify-center text-center bg-background-light dark:bg-background-dark overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-5 dark:opacity-[0.02]"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBPNUtP6p0RzHOciXbE3TJ_SlPabWU10wvcrcS1NfcmCe8-KLoowO6fJ8KzfOUpQ4R-aDDDvqG_-96HReXbCRvtRaJ1YG5nYMnlPogB2LeBxd7gQtJsAZ5dHaXOik-kK_xEpHpQDkoY6gyIw17Vmcnk6xFEscj5iYQVsaGGqUtBCw6IAS51XhZQE7QBnghWCCjCjMLy0y_CJCTxsxM0lkrO7E4zG3mGZUXCbiX0hEPleuJ2Kf36Grwb2Crz_EdT3-zva99VFi0WUY25")',
              }}
            ></div>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
            <motion.div
              className="relative z-10 max-w-4xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-extrabold tracking-tighter font-pacifico text-text-light dark:text-text-dark"
                variants={fadeInUp}
              >
                Snugglr
              </motion.h1>
              <motion.p
                className="mt-8 text-xl md:text-2xl text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                The anonymous college dating app where personality comes first.
                Match, confess, and chat anonymously.
              </motion.p>
              <motion.div
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                variants={fadeInUp}
              >
                <a
                  className="flex items-center justify-center w-full sm:w-auto overflow-hidden rounded-full h-14 px-10 bg-primary text-white text-lg font-bold tracking-wide shadow-lifted hover:bg-primary-dark transform hover:scale-105 transition-all duration-300"
                  href="#signup"
                >
                  <span className="truncate">Get Early Access</span>
                  <span className="material-symbols-outlined ml-2">
                    arrow_forward
                  </span>
                </a>
                <a
                  className="flex items-center justify-center w-full sm:w-auto overflow-hidden rounded-full h-14 px-10 bg-card-light/50 dark:bg-card-dark/50 backdrop-blur-md text-text-light dark:text-text-dark text-lg font-bold tracking-wide shadow-lifted hover:bg-gray-100/70 dark:hover:bg-card-dark/70 transform hover:scale-105 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
                  href="#how-it-works"
                >
                  <span className="truncate">How it Works</span>
                </a>
              </motion.div>
              <motion.p
                className="mt-8 text-sm text-text-muted-light dark:text-text-muted-dark"
                variants={fadeIn}
              >
                Currently in development. Available soon for select colleges.
              </motion.p>
            </motion.div>
          </section>

          {/* How It Works Section */}
          <section
            className="py-24 px-6 bg-background-light dark:bg-background-dark"
            id="how-it-works"
          >
            <div className="container mx-auto">
              <motion.div
                className="text-center mb-16 max-w-3xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-text-light dark:text-text-dark">
                  Your Journey on Snugglr
                </h2>
                <p className="mt-4 text-lg text-text-muted-light dark:text-text-muted-dark">
                  A step-by-step guide to finding your connection, from
                  anonymous first impressions to the big reveal.
                </p>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div
                  className="flex flex-col items-center text-center p-8 rounded-xl glass-effect shadow-soft transition-all hover:shadow-lifted hover:-translate-y-1"
                  variants={scaleIn}
                >
                  <div className="p-4 bg-primary/10 dark:bg-primary/20 text-primary rounded-full mb-6 text-4xl">
                    1
                  </div>
                  <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">
                    Sign Up & Build Your Vibe
                  </h3>
                  <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                    Join with your .edu email. Instead of photos, you'll share
                    your favorite memes, music, movies, and personality traits.
                    This is your 'vibe profile'.
                  </p>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center text-center p-8 rounded-xl glass-effect shadow-soft transition-all hover:shadow-lifted hover:-translate-y-1"
                  variants={scaleIn}
                >
                  <div className="p-4 bg-primary/10 dark:bg-primary/20 text-primary rounded-full mb-6 text-4xl">
                    2
                  </div>
                  <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">
                    Date or Pass
                  </h3>
                  <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                    We'll show you anonymous vibe profiles from your campus.
                    Swipe right to 'Date' if you like their vibe, or left to
                    'Pass'. It's all about character, not just looks.
                  </p>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center text-center p-8 rounded-xl glass-effect shadow-soft transition-all hover:shadow-lifted hover:-translate-y-1"
                  variants={scaleIn}
                >
                  <div className="p-4 bg-primary/10 dark:bg-primary/20 text-primary rounded-full mb-6 text-4xl">
                    3
                  </div>
                  <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">
                    Confess & Match
                  </h3>
                  <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                    If you both choose 'Date', it's a match! You can then send
                    an anonymous "confession" to break the ice before you start
                    chatting.
                  </p>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center text-center p-8 rounded-xl glass-effect shadow-soft transition-all hover:shadow-lifted hover:-translate-y-1"
                  variants={scaleIn}
                >
                  <div className="p-4 bg-primary/10 dark:bg-primary/20 text-primary rounded-full mb-6 text-4xl">
                    4
                  </div>
                  <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">
                    Chat & Reveal
                  </h3>
                  <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                    Get to know each other through anonymous chat. When you're
                    both comfortable, you can choose to reveal your full
                    profiles and see who you've been talking to.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section
            className="py-24 px-6 bg-card-light dark:bg-card-dark"
            id="features"
          >
            <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                className="w-full h-96 md:h-full bg-center bg-cover rounded-lg shadow-lifted relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <img
                  alt="Students laughing"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuiewzbGw7F_Pi8NZ5PYO_boEQtzzobNPtKf8fUJfuEIP6vzOJs6UdYdEHA4t_WjywILVTE53UQYb_4BtNPXYHOaKbUptuHdX2lRMSlemc5xkq8HaEtjRRLYiAxP9bc2XaJ5Rdm6rLIlGw3IRG3EqwxKsoQi9Q5JxCmh1tnmD3mNDmd9hIz1pXjxd9wxYJNmZOftgCGbexVFYrudHhDFFKrYIYcWjb0cjXfOhflXuYLKS03V7ynBrPjntXrYfntQnPSkZ88wxFMfxo"
                />
                <div className="absolute bottom-0 left-0 p-8">
                  <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
                    More Than Just a Swipe
                  </h2>
                  <p className="mt-4 text-lg text-white/90">
                    We're building features that spark genuine connection and
                    fun.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="space-y-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div
                  className="flex items-start gap-4"
                  variants={fadeInUp}
                >
                  <div className="flex-shrink-0 p-3 bg-secondary/10 dark:bg-secondary/20 text-secondary rounded-full mt-1">
                    <span className="material-symbols-outlined">
                      theater_comedy
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">
                      Vibe-Based Matching
                    </h3>
                    <p className="mt-1 text-text-muted-light dark:text-text-muted-dark">
                      Connect over what you love. Our algorithm prioritizes
                      shared tastes in memes, music, movies, and core
                      personality traits to find you a compatible match.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start gap-4"
                  variants={fadeInUp}
                >
                  <div className="flex-shrink-0 p-3 bg-secondary/10 dark:bg-secondary/20 text-secondary rounded-full mt-1">
                    {/* Anonymous mask icon for "incognito" */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      fill="none"
                      className="w-7 h-7"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 15c1-3.5 4.2-7 9-7s8 3.5 9 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <ellipse
                        cx="11"
                        cy="20"
                        rx="2.2"
                        ry="1.3"
                        fill="currentColor"
                        opacity="0.7"
                      />
                      <ellipse
                        cx="21"
                        cy="20"
                        rx="2.2"
                        ry="1.3"
                        fill="currentColor"
                        opacity="0.7"
                      />
                      <path
                        d="M16 15.5a1 1 0 0 1 1-1c.5 0 3 .7 5.5.5"
                        stroke="currentColor"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.8"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">
                      Anonymous Confessions
                    </h3>
                    <p className="mt-1 text-text-muted-light dark:text-text-muted-dark">
                      Break the ice with a fun, anonymous message. It's a
                      low-pressure way to show you're interested and see if
                      there's a spark.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start gap-4"
                  variants={fadeInUp}
                >
                  <div className="flex-shrink-0 p-3 bg-secondary/10 dark:bg-secondary/20 text-secondary rounded-full mt-1">
                    <span className="material-symbols-outlined">
                      chat_bubble
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-text-light dark:text-text-dark">
                      Pressure-Free Chat
                    </h3>
                    <p className="mt-1 text-text-muted-light dark:text-text-muted-dark">
                      Chats are fully anonymous until both people agree to
                      reveal. Focus on the conversation and get to know the
                      person, not just the profile picture.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <section
            className="py-24 px-6 bg-background-light dark:bg-background-dark"
            id="faq"
          >
            <div className="container mx-auto max-w-4xl">
              <motion.div
                className="text-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-text-light dark:text-text-dark">
                  Frequently Asked Questions
                </h2>
              </motion.div>
              <motion.div
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.details
                  className="group p-6 rounded-xl glass-effect shadow-soft cursor-pointer transition-all hover:shadow-lifted"
                  variants={fadeInUp}
                >
                  <summary className="flex items-center justify-between text-xl font-bold font-display text-text-light dark:text-text-dark">
                    When will Snugglr be available at my college?
                    <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180 text-primary">
                      expand_more
                    </span>
                  </summary>
                  <p className="mt-4 text-text-muted-light dark:text-text-muted-dark">
                    We are launching on a campus-by-campus basis. Sign up for
                    our waitlist with your .edu email, and we'll notify you as
                    soon as Snugglr is live at your school!
                  </p>
                </motion.details>
                <motion.details
                  className="group p-6 rounded-xl glass-effect shadow-soft cursor-pointer transition-all hover:shadow-lifted"
                  variants={fadeInUp}
                >
                  <summary className="flex items-center justify-between text-xl font-bold font-display text-text-light dark:text-text-dark">
                    Is Snugglr really anonymous?
                    <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180 text-primary">
                      expand_more
                    </span>
                  </summary>
                  <p className="mt-4 text-text-muted-light dark:text-text-muted-dark">
                    Yes. Your identity is completely hidden. Other users will
                    only see your Vibe Profile (memes, music, etc.) and your
                    college. Your name and photos are only revealed when both
                    you and your match consent.
                  </p>
                </motion.details>
                <motion.details
                  className="group p-6 rounded-xl glass-effect shadow-soft cursor-pointer transition-all hover:shadow-lifted"
                  variants={fadeInUp}
                >
                  <summary className="flex items-center justify-between text-xl font-bold font-display text-text-light dark:text-text-dark">
                    Do I need to download an app?
                    <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180 text-primary">
                      expand_more
                    </span>
                  </summary>
                  <p className="mt-4 text-text-muted-light dark:text-text-muted-dark">
                    Nope! Snugglr is a progressive web app (PWA), meaning it
                    runs in your browser. No app store downloads needed. For
                    quick access, you can add it to your home screen.
                  </p>
                </motion.details>
              </motion.div>
            </div>
          </section>

          {/* Signup CTA Section */}
          <section
            className="py-24 px-6 bg-primary dark:bg-primary-dark"
            id="signup"
          >
            <motion.div
              className="container mx-auto text-center max-w-3xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2
                className="text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white"
                variants={fadeInUp}
              >
                Be the First to Know
              </motion.h2>
              <motion.p
                className="mt-4 text-lg text-white/80"
                variants={fadeInUp}
              >
                Snugglr is coming soon. Join the waitlist with your college
                email to get exclusive early access and updates. It's time for a
                better way to date.
              </motion.p>
              <motion.div
                className="mt-10 flex justify-center"
                variants={fadeInUp}
              >
                <form className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <input
                    className="flex-grow h-14 px-6 rounded-full bg-white/20 text-white placeholder-white/70 border-0 focus:ring-2 focus:ring-white transition duration-300"
                    placeholder="your.name@college.edu"
                    type="email"
                  />
                  <button
                    className="flex items-center w-full justify-center overflow-hidden rounded-full h-14 px-10 bg-white text-primary text-lg font-bold tracking-wide shadow-lifted hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
                    type="submit"
                  >
                    <span className="truncate">Join Waitlist</span>
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-card-light dark:bg-card-dark border-t border-gray-200/80 dark:border-gray-800/50">
          <div className="container mx-auto py-12 px-6">
            <div className="flex flex-col items-center gap-6">
              {/* Logo and Tagline */}
              <div className="text-center">
                <h3 className="text-2xl font-bold font-pacifico text-primary mb-2">
                  Snugglr
                </h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Where personality comes first
                </p>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <a
                  className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors"
                  href="#how-it-works"
                >
                  How it Works
                </a>
                <a
                  className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors"
                  href="#features"
                >
                  Features
                </a>
                <a
                  className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors"
                  href="#faq"
                >
                  FAQ
                </a>
                <span className="text-text-muted-light dark:text-text-muted-dark">
                  •
                </span>
                <a
                  className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors"
                  href="mailto:hello@snugglr.app"
                >
                  Contact
                </a>
                <a
                  className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors"
                  href="#"
                >
                  Terms of Service
                </a>
              </div>

              {/* Bottom Section */}
              <div className="text-center pt-4 border-t border-gray-200/50 dark:border-gray-800/50 w-full max-w-2xl">
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  © 2024 Snugglr. All rights reserved.
                </p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2">
                  Built with ❤️ by Arhan for college students everywhere
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
