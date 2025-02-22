import { assets } from "../assets/assets"
import NewsLetterBox from "../components/NewsLetterBox"
import Title from "../components/Title"

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full max-w-[450px]" src={assets.about_img} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>ScholarNest is a student-driven marketplace designed to make buying and selling study materials easy and affordable. Whether you are looking for second-hand books, notes, or stationery, we connect students within the campus to ensure a seamless exchange of resources.</p>
          <p>Our goal is to reduce academic expenses while promoting a sustainable way of sharing knowledge. Join our growing community and make the most of your campus resources! 🚀📚</p>
          <b className="text-gray-800">Our Mission</b>
          <p>ScholarNest is dedicated to making education more accessible and affordable by connecting students to buy and sell books, notes, and stationery effortlessly. We promote a sustainable and collaborative student community where resources are reused, reducing waste and academic expenses. 📚🌱</p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">At ScholarNest, we are committed to delivering a seamless and reliable experience for our users. Every listing is verified for accuracy, and we ensure secure transactions, transparent communication, and high-quality resources. Your trust and satisfaction are our top priorities.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">ScholarNest makes buying and selling second-hand books, notes, and stationery effortless. With easy-to-use features, secure transactions, and quick access to resources, we save you time and effort, so you can focus on what matters most—your education.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service</b>
          <p className="text-gray-600">At ScholarNest, we prioritize your needs with prompt, friendly, and reliable support. Whether you are buying, selling, or just need assistance, our team is here to ensure your experience is smooth and satisfying. Your success is our success!</p>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  )
}

export default About
