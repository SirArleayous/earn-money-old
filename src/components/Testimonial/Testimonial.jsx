import React from "react";

import TestimonialSlider from "../TestimonialSlider/TestimonialSlider";
const Testimonial = () => {
  return (
    <div className="w-11/12 mx-auto py-20">
      <div className="pb-14">
        <h2 className="text-4xl font-bold text-center">What people say about SINEX</h2>
        <p className="text-center md:w-[50%] mx-auto py-3">
          Hear real feedback from verified users and business clients across regional markets, showcasing their experiences and success stories with the SINEX ecosystem.
        </p>
      </div>

      <div className="">
        <TestimonialSlider></TestimonialSlider>
      </div>
    </div>
  );
};

export default Testimonial;