import { useState } from "react";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';
import { Loader } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import { CircleX } from "lucide-react";


export default function SignIn() {
  const { register, handleSubmit } = useForm();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (data) => {
    setIsSubmitting(true);
    setError("");
    console.log(data);
    axios
      .post("/api/v1/worker/login", data)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          navigate("/profile"); // Redirect to /profile on successful submission
        } else {
          setOpen(true);
          setError(
            response.data.message || "An error occurred. Please try again."
          );
        }
      })
      .catch((error) => {
        setOpen(true);
        const message =
          error.response?.data || "An error occurred. Please try again.";
        setError(message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="min-h-screen py-12 pt-36 m-0 bg-white text-black">
      <h1 className="text-lg md:text-5xl text-center font-sans font-bold mb-8">
        Sign In
      </h1>

      <div className="flex justify-center">
        <form className="w-full max-w-sm" onSubmit={handleSubmit(handleSignIn)}>
          <div className="md:flex md:items-center mb-6 flex flex-col">
            <Input
              className="mb-3"
              label="username or email"
              {...register("username", { required: true, maxLength: 20 })}
            />
            <Input
              label="password"
              type="password"
              {...register("password", { required: true, maxLength: 20 })}
            />
            <Button type="submit" disabled={isSubmitting} className="mt-5 p-4">
              {isSubmitting ? <Loader className="animate-spin" /> : "Sign In"}
            </Button>
          </div>
        </form>
      </div>
       <Snackbar className="bg-white font-black"
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        variant="filled"
        autoHideDuration={1800}
      >
<Alert
          severity="danger"
          variant="filled"
          sx={{ width: '100%' }}
        >
          <span className="flex items-center border-black border p-4 rounded-lg">
            <CircleX className="mr-4 text-red-500" /> {error}
          </span>
        </Alert>
      </Snackbar>
    </div>
  );
}
