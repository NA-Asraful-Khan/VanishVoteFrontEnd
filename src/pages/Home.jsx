import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Clock, Lock, MessageSquare } from 'lucide-react';

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">
          Create Anonymous Polls That Vanish
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Simple, private, and temporary polling for honest feedback
        </p>
        <Link
          to="/create"
          className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Create Your Poll
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {[
          {
            icon: <Clock className="h-8 w-8 text-purple-500" />,
            title: "Time-Limited",
            description: "Polls automatically expire after your chosen duration"
          },
          {
            icon: <Lock className="h-8 w-8 text-purple-500" />,
            title: "Private & Anonymous",
            description: "No login required, complete privacy guaranteed"
          },
          {
            icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
            title: "Anonymous Comments",
            description: "Enable discussion while maintaining privacy"
          }
        ].map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;