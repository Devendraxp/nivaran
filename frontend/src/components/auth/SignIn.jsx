import { useState } from "react";
import { Loader } from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(""); // Clear previous errors
    const data = { username, password };
    axios.post('/api/v1/worker/login', data)
      .then(function (response) {
        if (response.data.status === 200 || response.data.status === 201) {
          navigate('/profile'); // Redirect to /profile on successful submission
        } else {
          setError(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
        setError(error.data.message);
      })
      .finally(() => {
        setIsSubmitting(false);
        setUsername("");
        setPassword("");
      });
  };

  return (
    <div className="min-h-screen bg-black py-12 pt-36 m-0">
      <h1 className="text-lg md:text-5xl text-center font-sans font-bold mb-8 text-white">
        Sign In
      </h1>
      <div className="flex justify-center">
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="md:flex md:items-center mb-6 flex flex-col">
            {error && (
              <div className="md:w-2/3 mb-4 text-red-500 text-center">
                {error}
              </div>
            )}
            <div className="md:w-2/3 flex justify-start mb-1">
              <label
                className=" ml-2 block text-slate-500 md:text-right mb-1 md:mb-0"
                htmlFor="inline-username"
              >
                Username or Email
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-800 appearance-none border-1 border-gray-800 rounded w-full py-2 px-4 text-white leading-tight focus:outline-none focus:bg-gray-700"
                id="inline-username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="enter username or email"
              />
            </div>
            <div className="md:w-2/3 mt-3 flex justify-start mb-1">
              <label
                className=" ml-2 block text-slate-500 md:text-right mb-1 md:mb-0"
                htmlFor="inline-password"
              >
                Password
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-800 appearance-none border-1 border-gray-800 rounded w-full py-2 px-4 text-white leading-tight focus:outline-none focus:bg-gray-700"
                id="inline-password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="enter password"
              />
            </div>
            <div className="md:w-2/3 mt-3 flex justify-center mb-1">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 flex items-center justify-center"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader className="animate-spin" /> : "Sign In"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
