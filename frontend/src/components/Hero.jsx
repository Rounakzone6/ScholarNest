import { useContext } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Hero = () => {
  const { navigate } = useContext(ShopContext);
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div
            onClick={() => {
              navigate("/collection");
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-2"
          >
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="cursor-pointer hover:scale-102 font-medium text-sm md:text-base">
              OUR BESTSELLERS
            </p>
          </div>
          <h1
            onClick={() => {
              navigate("/collection");
              window.scrollTo(0, 0);
            }}
            className="cursor-pointer hover:scale-102 text-3xl sm:py-3 prata-regular lg:text-5xl leading-relaxed"
          >
            Latest Arrivals
          </h1>
          <div
            onClick={() => {
              navigate("/collection");
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-2"
          >
            <p className="cursor-pointer hover:scale-102 font-semibold text-sm md:text-base">
              SHOP NOW
            </p>
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      {/* Hero right side */}
      <img className="w-full sm:w-1/2" src={assets.hero_img} alt="" />
    </div>
  );
};
export default Hero;
