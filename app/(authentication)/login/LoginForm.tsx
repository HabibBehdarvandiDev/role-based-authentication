"use client";
import { authTokenSchema, loginResponseSchema } from "@/types/authTokenSchema";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaLock, FaUser } from "react-icons/fa";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type inputs = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<inputs>();

  const router = useRouter();

  const formSubmit: SubmitHandler<inputs> = async (data) => {
    const res = await axios.post("/api/v1/auth/login", data);

    try {
      const response: loginResponseSchema = await res.data;

      if (response.status !== 200) {
        setError("root", {
          message: res.data.error,
        });
      }

      const token = jwt.decode(response.authToken);
      sessionStorage.setItem("authToken", response.authToken);

      if (token && typeof token === "object" && "role" in token) {
        const decodedToken = token as authTokenSchema;

        if (
          decodedToken.role === "developer" ||
          decodedToken.role === "admin"
        ) {
          router.push("/dashboard");
        } else {
          router.push("/posts");
        }
      }
    } catch (error) {
      setError("root", {
        message: "Error while Connecting Server",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(formSubmit)}
      className="bg-zinc-800 rounded-lg px-8 py-6 flex flex-col justify-start align-middle min-w-80 sm:min-w-[400px]"
    >
      <h1 className="self-center mb-2 text-2xl font-semibold text-white">
        Login
      </h1>
      <div className="form-entries flex flex-col space-y-2">
        <div className="form-control flex flex-col space-y-2 w-full">
          <label
            htmlFor="username"
            className="text-white flex justify-start align-middle items-center space-x-2"
          >
            <FaUser className="w-3 h-3" /> <span>Username</span>
          </label>
          <input
            id="username"
            type="text"
            className="w-full rounded-md p-2 text-zinc-800 outline-none focus:outline-2 focus:outline-blue-600 focus:outline-offset-1"
            {...register("username", {
              required: {
                value: true,
                message: "Username is required",
              },
            })}
          />
          {errors.username && (
            <p className="text-red-500 font-medium text-sm">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="form-control flex flex-col space-y-2 w-full">
          <label
            htmlFor="password"
            className="text-white flex justify-start align-middle items-center space-x-2"
          >
            <FaLock className="w-3 h-3" /> <span>password</span>
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-md p-2 text-zinc-800 outline-none focus:outline-2 focus:outline-blue-600 focus:outline-offset-1"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 font-medium text-sm">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="form-control flex flex-col space-y-2 w-full">
          {errors.root && (
            <p className="text-red-500 font-medium text-sm">
              {errors.root.message}
            </p>
          )}

          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-blue-600 rounded-md p-2 text-white font-semibold uppercase"
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
