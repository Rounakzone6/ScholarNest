const NewsLetterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Unlock 20% Off on Your ScholarNest Subscription! 🎉
      </p>
      <p className="text-gray-400 mt-3">
        Subscribe now and enjoy exclusive benefits, priority listings, and
        better visibility for your books and stationery. Do not miss this
        limited-time offer—upgrade today and save!
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Email"
          required
        />
        <button
          className="bg-black text-white text-xs px-10 py-4 "
          type="submit"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
