import { useContext } from "react";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const Contact = () => {
  const {navigate} = useContext(ShopContext)
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row justify-center gap-10 mb-28">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.contact_img}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">
            BBD University <br /> Lucknow, Uttar Pradesh (226028)
          </p>
          <p className="text-gray-500">
            Tel: 011-2303 9251 <br /> Email: campusbazaar@gmail.com
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Careers at CampusBazaar
          </p>
          <p className="text-gray-500">
            Looking for an opportunity to grow and make an impact? At
            CampusBazaar, we’re building a student-driven marketplace that makes
            education more accessible. Join us in creating innovative solutions
            that help students buy and sell study materials with ease. Explore
            exciting roles and be part of a dynamic team shaping the future of
            student commerce! 📚💼
          </p>
          <button onClick={()=>navigate('/jobs')} className="border rounded border-black px-8 py-4 hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  );
};

export default Contact;
