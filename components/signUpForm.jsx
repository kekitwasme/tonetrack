"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import userIcon from "@assets/user.svg";
import emailIcon from "@assets/email.svg";
import passwordIcon from "@assets/password.svg";
import facebookIcon from "@assets/facebookIcon.svg";
import googleIcon from "@assets/googleIcon.svg";
import appleIcon from "@assets/appleIcon.svg";
import logoIcon from "@assets/logoIcon.svg";

export default () => {
  const [name, setName] = useState({
    message: "name must be at least 3 characters long",
  });
  const [email, setEmail] = useState({ message: "invalid email" });
  const [password, setPassword] = useState({
    message:
      "password must contain at least 8 characters, 1 letter and 1 number",
  });

  const [response, setResponse] = useState();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "name":
        setName((data) => ({
          ...data,
          value: value,
          invalid: value ? value.length < 3 : null,
        }));
        break;

      case "email":
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        setEmail((data) => {
          return {
            ...data,
            value: value,
            invalid: value ? !emailRegex.test(value) : null,
          };
        });
        break;

      case "password":
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        setPassword((data) => {
          return {
            ...data,
            value: value,
            invalid: value ? !passwordRegex.test(value) : null,
          };
        });
        break;
      default:
        break;
    }
  };

  const maybeGetMessage = ({ invalid, message }) => {
    if (invalid) {
      return <p className="text-red-500">{message}</p>;
    }
  };

  const submitForm = async () => {
    const response = await fetch("/api/user", {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    })
      .then(async (response) => {
        if (response.ok) return response.json();
        throw new Error("response not ok");
      })
      .then((jsonResponse) => {
        if (jsonResponse && jsonResponse.acknowledged) {
          signIn("credentials", {
            login: email,
            password: password,
            callbackUrl: "/",
          });
        }
        return jsonResponse;
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });

    // setResponse(response)
  };

  const valid = [name, email, password].every(
    ({ value, invalid }) => invalid !== true && value !== undefined
  );

  return (
    <form
      className="h-screen flex flex-col space-y-7 items-center mt-20 py-20"
      onChange={handleInputChange}
    >
      <h1 className="text-3xl text-white font-bold">Create Your Account</h1>
      {maybeGetMessage(name)}
      <div className="w-25 h-11 flex flex-row justify-between space-x-0  bg-white px-5 ">
        <Image src={userIcon} alt="user icon" />
        <input
          className="grow text-lg focus:outline-none px-5"
          type="text"
          name="name"
          required
          placeholder="Your name"
        />
      </div>

      {maybeGetMessage(email)}
      <div className="w-25 h-11 flex flex-row justify-between space-x-0  bg-white px-5 ">
        <Image src={emailIcon} alt="email icon" />
        <input
          className="grow text-lg focus:outline-none px-5"
          type="email"
          name="email"
          placeholder="Email"
        />
      </div>

      {maybeGetMessage(password)}
      <div className="w-25 h-11 flex flex-row justify-between space-x-0  bg-white px-5 ">
        <Image src={passwordIcon} alt="password icon" />
        <input
          className="grow text-lg focus:outline-none px-5"
          type="password"
          name="password"
          placeholder="password"
        />
      </div>
      {maybeGetMessage(password)}
      <div className="w-25 h-11 flex flex-row justify-between space-x-0  bg-white px-5">
        <Image src={passwordIcon} alt="password icon" />
        <input
          className="grow text-lg focus:outline-none px-5"
          type="password"
          name="password"
          placeholder="Repeat password"
        />
      </div>
      <div className="py-1"></div>
      <button
        type="button"
        disabled={!valid}
        onClick={
          valid
            ? submitForm
            : () => {
                console.log(valid, name, email, password);
              }
        }
        className={
          "my-10 text-gray-900 font-bold text-xl bg-gradient-to-r from-cyan-100 from-30% via-violet-100 via-70% to-violet-300 to-90% rounded-[10px] flex justify-center px-20 py-2 " +
          (valid ? "" : "opacity-50")
        }
      >
        Create Account
      </button>
    </form>
  );
};
