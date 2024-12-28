import { useState } from "react";
import { Loader } from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import  Input  from "../Input";
import  Button  from "../Button";

export default function SignIn() {
  const { register, handleSubmit } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (data) => {
    setIsSubmitting(true);
    setError("");
    console.log(data);
    axios.post('/api/v1/worker/login', data)
      .then((response) => {
      if (response.status === 200 || response.status === 201) {
        navigate('/profile'); // Redirect to /profile on successful submission
      } else {
        setError(response.data.message || "An error occurred. Please try again.");
      }
      })
      .catch((error) => {
      const message = error.response?.data || "An error occurred. Please try again.";
      setError(message);
      })
      .finally(() => {
      setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen py-12 pt-36 m-0">
      <h1 className="text-lg md:text-5xl text-center font-sans font-bold mb-8">
        Sign In
      </h1>
      <div className="flex justify-center">
        <form className="w-full max-w-sm" onSubmit={handleSubmit(handleSignIn)}>
          <div className="md:flex md:items-center mb-6 flex flex-col">
            {error && (
              <div className="md:w-2/3 mb-4 text-red-500 text-center">
                {error}
              </div>
            )}
            <Input className="mb-3" label="username or email" {...register("username",{required : true, maxLength: 20})} />
            <Input label="password" {...register("password",{required : true, maxLength: 20})} />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 p-4"
              >
                {isSubmitting ? <Loader className="animate-spin" /> : "Sign In"}
              </Button>

          </div>
        </form>
      </div>
    </div>
  );
}
