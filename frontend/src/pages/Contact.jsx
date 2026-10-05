import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";
import Title from "../components/Title";

const Contact = () => {
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
            Tel: +91 7667991277 <br /> Email: rounakgupta002@gmail.com
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Get in touch
          </p>
          <p className="text-gray-500">
            Need help with a listing or have a safety concern? Email our team and include the listing link if it is relevant.
          </p>
          <button
            onClick={() => window.location.href = "mailto:rounakgupta002@gmail.com"}
            className="border rounded border-black px-8 py-4 hover:bg-black hover:text-white transition-all duration-500"
          >
            Email ScholarNest
          </button>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  );
};

export default Contact;
