"use client";

import React from "react";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function AboutUsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
          <h1 className="text-3xl font-bold text-[#8B1D3D] mb-8 text-center">
            About Us
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left Image */}
            <div className="flex justify-center">
              <img
                src="/banner1.webp"
                alt="Sridevi Herbal & Co"
                className="w-full max-w-md rounded-xl shadow-lg object-cover"
              />
            </div>

            {/* Right Content */}
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Hi, I am{" "}
                <span className="font-semibold text-gray-900">
                  Vemula Sridevi
                </span>
                . I have completed a{" "}
                <span className="font-medium">
                  2-year Ayurvedic Diploma
                </span>{" "}
                along with a{" "}
                <span className="font-medium">
                  Naturopathy course
                </span>
                . I am an expert in natural skin and hair care solutions.
              </p>

              <p>
                I have trained under professionals with over
                <span className="font-medium">
                  {" "}
                  20+ years of experience
                </span>{" "}
                and have been honored with a{" "}
                <span className="font-medium">
                  National Award from the Governor
                </span>
                . Our products were also awarded as
                <span className="font-medium">
                  {" "}
                  “Best Natural Product” by Blindwink
                </span>
                .
              </p>

              <p>
                Nature has powerful herbs that can cure most skin and
                hair problems. Unfortunately, many people today prefer
                instant, chemical-based solutions. My mission is to
                bring people back to the goodness of
                <span className="font-medium">
                  {" "}
                  pure, natural, and herbal care
                </span>
                .
              </p>

              <p>
                I aim to help women look beautiful, feel confident, and
                be proud of their natural beauty. To date,
                <span className="font-medium">
                  {" "}
                  20,000+ customers
                </span>{" "}
                are satisfied with our products, and we continue to grow
                every day.
              </p>

              <p>
                We are a{" "}
                <span className="font-medium">
                  women-led enterprise
                </span>
                , currently supporting{" "}
                <span className="font-medium">
                  100+ women
                </span>{" "}
                through selling and promoting our products. Many more
                women are yet to be empowered.
              </p>

              <p className="font-medium text-gray-900">
                Encouraging women. Empowering lives.
              </p>

              <p className="text-[#8B1D3D] font-semibold">
                Feel free to contact us — we’d love to help you.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
