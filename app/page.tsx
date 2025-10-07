/**
 * Home Page
 *
 * This is the landing page for the Social Life app.
 * Users will see this page when they first visit the site.
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Social Life
          </h1>
          <div className="space-x-4">
            <a
              href="/auth/signin"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Connect with Your
            <span className="text-indigo-600 dark:text-indigo-400">
              {" "}
              Community
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share your thoughts, follow friends, and engage with content that
            matters to you. Built with modern web technologies for a seamless
            experience.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <a
              href="/auth/signup"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 dark:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Share Your Moments
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Post updates, thoughts, and experiences with your community in
              real-time.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Engage & React
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Like and interact with posts from people you care about.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Build Your Network
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Follow friends and discover new connections in your community.
            </p>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-32 text-center">
          <h3 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white">
            Built with Modern Technologies
          </h3>
          <div className="flex flex-wrap justify-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow">
              Next.js 14+
            </div>
            <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow">
              TypeScript
            </div>
            <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow">
              Prisma
            </div>
            <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow">
              PostgreSQL
            </div>
            <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow">
              Tailwind CSS
            </div>
            <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow">
              NextAuth.js
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
          <p>Social Life - A Modern Social Media Platform</p>
          <p className="mt-2 text-sm">
            Built for learning and educational purposes
          </p>
        </div>
      </footer>
    </div>
  );
}
