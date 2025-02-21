import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [subCategory, setSubCategory] = useState("BOOKS");
  const [quality, setQuality] = useState("GOOD");
  const [year, setYear] = useState("2025");
  const [bestseller, setBestSeller] = useState(false);

  const onSubmithandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("originalPrice", originalPrice);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("quality", quality);
      formData.append("year", year);
      formData.append("bestseller", bestseller);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setOriginalPrice("");
        setSubCategory("BOOK");
        setCategory("Engineering");
        setQuality("GOOD");
        setYear("2025");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmithandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={image1 ? URL.createObjectURL(image1) : assets.upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={image2 ? URL.createObjectURL(image2) : assets.upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={image3 ? URL.createObjectURL(image3) : assets.upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={image4 ? URL.createObjectURL(image4) : assets.upload_area}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          required
          type="text"
          placeholder="Product Name"
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          required
          type="text"
          placeholder="Product Description"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="Engineering">Engineering</option>
            <option value="Dental">Dental</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Competitive Exam">Competitive Exam</option>
            <option value="MBA/LLB/B.Com/..">MBA/LLB/B.Com/..</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Sub Category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
          >
            <option value="Books">Books</option>
            <option value="Notes">Notes</option>
            <option value="Quantum">Quantum</option>
            <option value="Sports">Sports</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
      <div>
          <p className="mb-2">Product Year</p>
          <select
            onChange={(e) => setYear(e.target.value)}
            value={year}
            className="w-full px-3 py-2"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Quality</p>
          <select
            onChange={(e) => setQuality(e.target.value)}
            value={quality}
            className="w-full px-3 py-2"
          >
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Bad">Bad</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
      <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="Price"
          />
        </div>
        <div>
          <p className="mb-2">Original Price</p>
          <input
            onChange={(e) => setOriginalPrice(e.target.value)}
            value={originalPrice}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="Original Price"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to Bestseller
        </label>
      </div>
      <button
        className="w-28 py-3 mt-4 bg-black rounded-xl text-white"
        type="submit"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;
