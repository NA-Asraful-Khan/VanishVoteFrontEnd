import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Clock, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { createPoll } from '../services/api';

function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresIn, setExpiresIn] = useState(24);
  const [hideResults, setHideResults] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [error, setError] = useState('');

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      setError('Please provide at least two options');
      return;
    }

    try {
      const poll = await createPoll({
        question,
        options: validOptions,
        expiresIn,
        hideResults,
        isPrivate
      });
      navigate(`/poll/${poll._id}`);
    } catch (err) {
      setError('Failed to create poll. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Create a New Poll</h1>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Your Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="What would you like to ask?"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg dark:hover:bg-red-900"
                  >
                    <Minus size={20} />
                  </button>
                )}
              </div>
            ))}
            {options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-2 flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                <Plus size={20} className="mr-1" />
                Add Option
              </button>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Poll Duration
            </label>
            <div className="flex items-center">
              <Clock size={20} className="mr-2 text-gray-500 dark:text-gray-400" />
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(Number(e.target.value))}
                className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={1}>1 hour</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={168}>1 week</option>
              </select>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setHideResults(!hideResults)}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  hideResults
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {hideResults ? <EyeOff size={20} className="mr-2" /> : <Eye size={20} className="mr-2" />}
                {hideResults ? 'Results Hidden' : 'Results Visible'}
              </button>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  isPrivate
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {isPrivate ? <Lock size={20} className="mr-2" /> : <Unlock size={20} className="mr-2" />}
                {isPrivate ? 'Private Poll' : 'Public Poll'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Poll
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePoll;