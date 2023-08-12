"use client";
import Image from "next/image";
import Link from "next/link";
import {
  userIcon,
  emailIcon,
  facebookIcon,
  passwordIcon,
  googleIcon,
  appleIcon,
  logoIcon,
  languageIcon,
  settingsIcon,
  contactIcon,
  feedbackIcon,
  privacyIcon,
  aboutIcon,
  logoBW,
} from "@assets/icons";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default () => {
  const [email, setEmail] = useState({ value: "", valid: false });

  const func = (event) => {
    const { value } = event.target;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    setEmail({ value: value, valid: emailRegex.test(value) });
  };

  const submitForm = () => {};

  const valid = email.valid;

  return (
    <div className="h-fit flex flex-col space-y-9 items-center">
      <Link href="/">
        <Image src={logoIcon} alt="logo icon" />
      </Link>
      <h1 className="text-3xl text-white font-bold">Forgot your password?</h1>
      <span className="text-white text-xl w-1/2 text-center mt-2 ">
        Enter your registered email below to receive password reset link
      </span>

      <div className="flex flex-col place-content-center">
        <label htmlFor="email">Email</label>
        <div className="w-25 h-11 flex flex-row justify-between space-x-0  bg-white px-5 ">
          <Image src={emailIcon} alt="email icon" />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="grow text-lg focus:outline-none px-5"
            onChange={func}
          />
        </div>

        <button
          type="button"
          disabled={!valid}
          onClick={
            valid
              ? submitForm
              : () => {
                  console.log(valid, email);
                }
          }
          className={
            "my-10 text-gray-900 font-bold text-xl bg-gradient-to-r from-cyan-100 from-30% via-violet-100 via-70% to-violet-300 to-90% rounded-[10px] flex justify-center px-20 py-2 " +
            (valid ? "" : "opacity-50")
          }
        >
          Send Link
        </button>

        <div className="py-1"></div>
      </div>
    </div>
  );
};
