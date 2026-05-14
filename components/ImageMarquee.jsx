"use client";

import React from "react";

export default function ImageMarquee({ images }) {
  return (
    <div className="relative overflow-hidden w-full py-8 bg-white">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="marquee-track flex gap-6">
        {[...images, ...images].map((img, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={img}
              alt="Success story"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
