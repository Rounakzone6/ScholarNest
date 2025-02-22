import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");

  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          phone,
          email,
          password,
          confirmPassword,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          emailOrPhone,
          password,
          confirmPassword,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] border px-15 pb-5 rounded-2xl sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          name="name"
          placeholder="Name"
          required
        />
      )}
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          name="phone"
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          placeholder="Phone"
          required
        />
      )}
      {currentState === "Login" ? (
        <input
          onChange={(e) => setEmailOrPhone(e.target.value)}
          value={emailOrPhone}
          name="emailOrPhone"
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          placeholder="Email/Phone"
          required
        />
      ) : (
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name="email"
          className="w-full px-3 py-2 border border-gray-800"
          type="email"
          placeholder="Email"
          required
        />
      )}
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="w-full px-3 py-2 border border-gray-800"
        type="password"
        name="password"
        placeholder="Password"
        required
      />
      <input
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        className="w-full px-3 py-2 border border-gray-800"
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        {currentState==="Login"?<p onClick={()=>navigate('/reset-password')} className="cursor-pointer text-blue-700 hover:underline hover:text-blue-800">Forgot password</p>:<p></p>}
        
        {currentState === "Login" ? (
          <p
            className="cursor-pointer hover:underline"
            onClick={() => setCurrentState("Sign Up")}
          >
            Create an Account
          </p>
        ) : (
          <p
            className="cursor-pointer hover:underline"
            onClick={() => setCurrentState("Login")}
          >
            Login Here
          </p>
        )}
      </div>
      <button
        type="submit"
        className="bg-black cursor-pointer text-white font-light px-8 py-2 mt-4 rounded-full w-full"
      >
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
