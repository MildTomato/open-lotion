import Link from "next/link";
import React, { useReducer, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/input";
import { supabase } from "../../utils/supabaseClient";

const DEFAULT = {
  email: {
    value: "",
    error: "",
  },
  password: {
    value: "",
    error: "",
  },
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

export default function SignUp() {
  const [email, setEmail] = useState(DEFAULT.email.value);
  const [password, setPassword] = useState(DEFAULT.password.value);

  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, DEFAULT);

  async function handleSubmit(event: any) {
    event.preventDefault();
    try {
      const { user, session, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthLayout>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="space-y-8 flex flex-col w-full"
      >
        <div className="space-y-6 flex flex-col w-full">
          <h1>Sign up</h1>

          <div>
            <label
              htmlFor="email"
              className="block mb-1.5 text-gray-400 text-xs"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1.5 text-gray-400 text-xs"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <Button>Sign up</Button>
        <div className="flex flex-col space-y-2">
          <span className="text-xs text-gray-400">
            Already have an account <Link href="/auth/sign-in">Sign in</Link>
          </span>
          <span className="text-xs text-gray-400">
            Forgotten your password?{" "}
            <Link href="/auth/sign-in">Reset your password</Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  );
}
