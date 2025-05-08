import React from "react";

const AboutUs = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center text-white flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url('https://www.tastingtable.com/img/gallery/20-cake-hacks-to-craft-perfect-confections-every-time/intro-1690997736.jpg')`,
      }}
    >
      <div className="bg-black bg-opacity-50 p-10 rounded-xl max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome</h1>
        {/* <p className="text-lg">
        At Sugar Whisk Bakery, we believe every celebration deserves a sweet story. What started as a small kitchen dream has now risen into a full-fledged passion for crafting cakes that are as beautiful as they are delicious. From classic flavors to trendy designs, we bake with love, creativity, and a dash of magic. Whether it’s a birthday, wedding, or just a Tuesday treat, we’re here to make every moment sweeter.
        </p> */}
      </div>
    </div>
  );
};

export default AboutUs;
