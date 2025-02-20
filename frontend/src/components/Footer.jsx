import { assets } from "../assets/assets";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Footer = () => {
  const { navigate } = useContext(ShopContext);
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            className="w-32 mb-5"
            src={assets.logo}
            alt=""
          />
          <p className="w-full md:w-2/3 text-gray-600">
            CampusBazaar - Your go-to platform for buying and selling used
            books, notes, and stationery within your campus. Connect with
            seniors, find affordable study materials, and make learning more
            accessible.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">Company</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li
              className="hover:underline hover:text-gray-800"
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
            >
              Home
            </li>
            <li
              className="hover:underline hover:text-gray-800"
              onClick={() => {
                navigate("/about");
                window.scrollTo(0, 0);
              }}
            >
              About Us
            </li>
            <li
              className="hover:underline hover:text-gray-800"
              onClick={() => {
                navigate("/delivery");
                window.scrollTo(0, 0);
              }}
            >
              Delivery
            </li>
            <li
              className="hover:underline hover:text-gray-800"
              onClick={() => {
                navigate("/privacy-policy");
                window.scrollTo(0, 0);
              }}
            >
              Privacy Policy
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li className="hover:underline hover:text-gray-800">
              +91-7667991277
            </li>
            <li className="hover:underline hover:text-gray-800">
              campusbazaar@gmail.com
            </li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025© campusbazaar.com - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
