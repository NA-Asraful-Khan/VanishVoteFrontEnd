import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, Flame, MessageSquare, Share2, Clock, AlertCircle } from 'lucide-react';
import { getPoll, votePoll, addComment, addReaction } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

function ViewPoll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [comment, setComment] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadPoll();
    const interval = setInterval(loadPoll, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [id]);

  const loadPoll = async () => {
    try {
      const data = await getPoll(id);
      setPoll(data);
      setLoading(false);
    } catch (err) {
      setError('Poll not found or has expired');
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (selectedOption === null) return;
    
    try {
      const updatedPoll = await votePoll(id, selectedOption);
      setPoll(updatedPoll);
      setHasVoted(true);
      localStorage.setItem(`voted-${id}`, 'true');
    } catch (err) {
      setError('Failed to submit vote');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const updatedPoll = await addComment(id, comment);
      setPoll(updatedPoll);
      setComment('');
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleReaction = async (type) => {
    try {
      const updatedPoll = await addReaction(id, type);
      setPoll(updatedPoll);
    } catch (err) {
      setError('Failed to add reaction');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy link');
    }
  };

  const calculatePercentage = (votes) => {
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
            {error}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!poll) return null;

  const timeLeft = formatDistanceToNow(new Date(poll.expiresAt), { addSuffix: true });
  const isExpired = new Date(poll.expiresAt) < new Date();
  const showResults = !poll.hideResults || hasVoted || isExpired;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold dark:text-white">{poll.question}</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Share poll"
            >
              <Share2 size={20} />
            </button>
            {copied && (
              <span className="text-sm text-green-600 dark:text-green-400">
                Link copied!
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Clock size={16} className="mr-1" />
          <span>{isExpired ? 'Expired' : `Expires ${timeLeft}`}</span>
        </div>

        <div className="space-y-3 mb-6">
          {poll.options.map((option, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => !hasVoted && !isExpired && setSelectedOption(index)}
                disabled={hasVoted || isExpired}
                className={`w-full p-4 text-left rounded-lg transition-all ${
                  selectedOption === index
                    ? 'bg-purple-100 dark:bg-purple-900 border-purple-500'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                } ${hasVoted || isExpired ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="dark:text-white">{option.text}</span>
                  {showResults && (
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {calculatePercentage(option.votes)}%
                    </span>
                  )}
                </div>
                {showResults && (
                  <div className="absolute left-0 bottom-0 h-1 bg-purple-500 transition-all"
                    style={{ width: `${calculatePercentage(option.votes)}%` }}
                  />
                )}
              </button>
            </div>
          ))}
        </div>

        {!hasVoted && !isExpired && (
          <button
            onClick={handleVote}
            disabled={selectedOption === null}
            className={`w-full py-3 rounded-lg mb-6 ${
              selectedOption === null
                ? 'bg-gray-200 cursor-not-allowed dark:bg-gray-700'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            Vote
          </button>
        )}

        <div className="flex items-center justify-center space-x-4 mb-8 pt-4 border-t dark:border-gray-700">
          <button
            onClick={() => handleReaction('likes')}
            className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
          >
            <ThumbsUp size={20} />
            <span>{poll.reactions.likes}</span>
          </button>
          <button
            onClick={() => handleReaction('trending')}
            className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
          >
            <Flame size={20} />
            <span>{poll.reactions.trending}</span>
          </button>
        </div>

        <div className="border-t dark:border-gray-700 pt-6">
          <h3 className="flex items-center text-lg font-semibold mb-4 dark:text-white">
            <MessageSquare size={20} className="mr-2" />
            Comments
          </h3>
          
          <form onSubmit={handleComment} className="mb-6">
            <div className="flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-700"
              >
                Send
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {poll.comments.map((comment, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <p className="text-gray-800 dark:text-gray-200">{comment.text}</p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPoll;