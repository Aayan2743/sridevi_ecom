"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ImageMarquee from "@/components/ImageMarquee";

export default function SuccessStoryPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Hero */}
        <section className="text-center mb-14">
          <h1 className="text-4xl font-bold text-[#8B1D3D] mb-4">
            Success Story Behind{" "}
            <span className="italic">#DontGoForBath</span>
          </h1>
          <p className="text-lg text-gray-700">
            From a middle-class dream to a women-led herbal movement 🌿
          </p>
        </section>

        {/* Story Sections */}
        <section className="space-y-8 text-gray-700 leading-relaxed">
          <p>
            She is a middle-class girl with a lot of dreams. She wanted
            to be a good job holder, but later due to marriage she
            stopped working. Still, she was passionate — she wanted to
            do something meaningful in life.
          </p>

          <p>
            That desire slowly transformed her into a successful
            entrepreneur today, known as{" "}
            <b>Sridevi Homemade Herbal Products</b>.
          </p>

          <p>
            She believes every woman dreams of being beautiful. Beauty
            is something many women invest a large part of their life
            in. Her friends and family often told her they had tried
            many creams, face washes, ointments and chemical products,
            yet they were never truly satisfied.
          </p>

          <p>
            In her opinion, beauty is a long-term journey. It cannot
            happen overnight or within a week. Daily habits like
            drinking enough water, eating healthy food, and using
            natural products lead to true, lasting beauty.
          </p>
        </section>

        {/* Turning Point */}
        <section className="mt-14 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-[#8B1D3D] mb-4">
            The Turning Point
          </h2>
          <p className="text-gray-700">
            Once, she met a leading and experienced beautician who
            shared a powerful truth — many people today prefer harsh
            chemicals for instant glow. These products may give quick
            results, but they drastically reduce skin quality over
            time, making skin age faster than one’s actual age.
          </p>

          <p className="text-gray-700 mt-4">
            Those words influenced her deeply. From that day onward,
            she decided to completely avoid chemical-based products.
          </p>
        </section>

        {/* Research */}
        <section className="mt-14 space-y-6">
          <h2 className="text-2xl font-semibold text-[#8B1D3D]">
            Journey into Ayurveda & Nature
          </h2>

          <p>
            She began researching natural ways to maintain beauty.
            With guidance from her friend’s brother, a leading
            Ayurvedic doctor in town, she learned that nature has
            countless valuable herbs that keep us healthy and
            beautiful.
          </p>

          <p>
            People call traditional methods “old model”, but they
            forget one truth — <b>Old is Gold</b>.
          </p>

          <p>
            Later, she met an experienced woman with over 15 years of
            expertise in herbal product preparation. This mentor
            trained her, encouraged her, and helped her gain
            confidence in her formulations.
          </p>
        </section>

        {/* Growth */}
        <section className="mt-14 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-[#8B1D3D] mb-4">
            From Home Use to Growing Brand
          </h2>

          <p className="text-gray-700">
            She started preparing bath powder for her own use. Slowly,
            her family and friends noticed visible skin improvements.
            Friends began asking for the bath powder again and again.
          </p>

          <p className="text-gray-700 mt-4">
            With her husband’s support, she started selling from home.
            Word of mouth spread rapidly, and visitors began coming to
            her house.
          </p>

          <p className="text-gray-700 mt-4">
            Later, she invented a herbal hair pack powder which
            received an overwhelming response — far beyond
            expectations.
          </p>
        </section>

        {/* Products */}
        <section className="mt-14 space-y-6">
          <h2 className="text-2xl font-semibold text-[#8B1D3D]">
            Product Innovations
          </h2>

          <p>
            Today, she sells more than{" "}
            <b>100+ kgs of bath powder every month</b> and has
            developed specialized categories:
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>Baby Bath Powder – for sensitive baby skin</li>
            <li>Chandamama Bath Powder – for women</li>
            <li>Ayurvedic Bath Powder – for skin problems</li>
            <li>Organic Bath Powder – with organic ingredients</li>
          </ul>

          <p>
            For hair care, she invented a hair pack with 20+ herbal
            ingredients. Along with a leading herbal MD, she launched
            herbal shampoo with neem & tulsi and the highly successful
            Onion Hair Oil.
          </p>
        </section>

        {/* Image Marquee Section */}
        <section className="my-16">
          <h2 className="text-center text-2xl font-semibold text-[#8B1D3D] mb-6">
            Our Journey in Frames 🌿
          </h2>

          <ImageMarquee
            images={[
              "/success1.jpg",
              "/success2.jpg",
              "/success3.jpg",
              "/success4.jpg",
              "/success5.jpg",
              "/success6.jpg",
            ]}
          />
        </section>

        {/* Women Empowerment */}
        <section className="mt-14 bg-[#F7E9ED] rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-[#8B1D3D] mb-4">
            Women Empowerment & Mission
          </h2>

          <p className="text-gray-700">
            Today, more than <b>25+ middle-class women</b> earn income
            to support their families by selling these products.
          </p>

          <p className="text-gray-700 mt-4">
            Our mission is clear — stop bathing with chemical products
            and return to nature. Natural products keep your skin
            safe, healthy, and beautiful.
          </p>

          <p className="mt-4 font-semibold text-[#8B1D3D]">
            #DontGoForBath with chemical products 🌿
          </p>
        </section>

        {/* CTA */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-[#8B1D3D] mb-6">
            Explore Sridevi Herbal Products
          </h2>

          <button
            onClick={() => router.push("/products")}
            className="bg-red-900 text-white px-10 py-4 rounded-lg font-semibold hover:bg-red-800 transition"
          >
            View Product List
          </button>
        </section>
      </main>
    </div>
  );
}
