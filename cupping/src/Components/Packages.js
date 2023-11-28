import React from "react";

const Packages = () => {
  const cardData = [
    {
      image: "https://i.imgur.com/Ql4jRdB.png",
      title: "Detox Therapy",
      price: "₹3000",
      features: ["7-9 Points", "Instant Relief", "Quick Results", "Health Benefits"],
    },
    {
      image: "https://i.imgur.com/pJNFEHR.png",
      title: "Back Pain",
      price: "₹3500",
      features: ["9-11 Points", "Heals your Backpain", "Best for Workers & Students", "Immediate Relief", "Highly Recommended"],
    },
    {
      image: "https://i.imgur.com/Hg0sUJP.png",
      title: "Customizable Pack",
      price: "₹4000",
      features: ["11-13 Points", "Personalised treatment", "Consultation", "Health Benefits", "Diet Plan"],
    },
  ];
  return (
    <div className="w-full py-[10rem] px-4 bg-white">
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`w-full shadow-xl flex flex-col p-4 my-4 rounded-lg hover:scale-105 duration-300`}
          >
            <img
              className="w-20 mx-auto mt-[-3rem] bg-white"
              src={card.image}
              alt="/"
            />
            <h2 className="text-2xl font-bold text-center py-8">
              {card.title}
            </h2>
            <p className="text-center text-4xl font-bold">{card.price}</p>
            <div className="text-center font-medium">
              {card.features.map((feature, index) => (
                <p
                  key={index}
                  className={`py-2 border-b mx-8 ${index === 0 ? "mt-8" : ""}`}
                >
                  {feature}
                </p>
              ))}
            </div>
            <button
              className={`bg-[royalblue] text-white  hover:text-[royalblue] hover:bg-gray-50 duration-150 w-[200px] rounded-md font-medium my-6 mx-auto px-6 py-3`}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;