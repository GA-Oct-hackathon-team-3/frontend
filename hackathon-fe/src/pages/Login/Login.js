import React, { useState, useContext } from "react";

const Login = () => {
  // const { user, setUser } = useContext(AuthContext)
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
  }

  async function handleLogin(evt) {
    evt.preventDefault();
    try {
      console.log("Login form submitted");
      console.log(credentials);
      console.log("Login successful");
      // const user = await usersService.login(credentials)
      // setUser(user)
    } catch {
      setErrorMsg("Login failed, try again");
    }
  }

  return (
    <div>
      <p>Login Page</p>

      <form
        // className="flex flex-col justify-center items-center"
        onSubmit={handleLogin}
      >
        <div>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={credentials.email}
            onChange={handleChange}
            className="border-gray-400 border-2 p-1 rounded-[4px] w-60"
          ></input>
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            className="border-gray-400 border-2 p-1 rounded-[4px] w-60"
          />
        </div>
        <div>
          <button type="submit">Sign In</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
