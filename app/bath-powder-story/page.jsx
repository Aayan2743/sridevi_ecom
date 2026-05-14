"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function BathPowderStoryPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* HERO */}
        <section className="text-center mb-14">
          <h1 className="text-4xl font-bold text-[#8B1D3D] mb-4">
            Story of Bath Powder
          </h1>
          <p className="text-lg text-gray-700 italic">
            #DontGoForBath — Stop Chemical Baths, Go Natural 🌿
          </p>
        </section>

        {/* INTRO */}
        <section className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Stop doing chemical bath. Go for a natural bath. The world
            is moving faster, running towards new cultures and habits.
            In this scenario, I would like to share a daily routine
            habit — <b>Bathing</b>.
          </p>

          <p>
            Have you ever thought about how our ancestors bathed when
            soaps didn’t exist? Let’s take 5 minutes to understand
            something we do every day.
          </p>

          <p>
            Soaps are chemical cakes. Then why are new skin diseases
            increasing? Psoriasis, tan, skin cancer, pimples, itching,
            fungal infections — why are pharma markets growing year by
            year?
          </p>
        </section>

        {/* OLD MODEL */}
        <section className="mt-12 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-[#8B1D3D] mb-4">
            Ancient Old Model Bathing
          </h2>
          <p className="text-gray-700">
            Our forefathers used <b>BATH POWDER</b>, prepared at home
            with herbs. People looked good, and skin problems were
            rare. Today, we spend heavily on doctors just to look
            healthy.
          </p>
        </section>

        {/* NATURE */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[#8B1D3D] mb-4">
            Nature Has the Solution
          </h2>
          <p className="text-gray-700">
            Neem, Tulasi, Amla, Shikakai, Brahmi, Hibiscus, Rose petals,
            Vetiver, Multani Mitti and many more herbs keep skin glowing,
            infection-free and youthful.
          </p>

          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 text-sm">
            {[
              "Removes dead skin",
              "Reduces oil",
              "Prevents tan",
              "Brightens skin",
              "Prevents infections",
              "Keeps skin youthful",
              "Natural scrub",
              "Baby soft skin",
            ].map((item) => (
              <li
                key={item}
                className="bg-[#F7E9ED] px-3 py-2 rounded text-gray-800"
              >
                ✔ {item}
              </li>
            ))}
          </ul>
        </section>

        {/* BABY SECTION */}
        <section className="mt-16 space-y-6">
          <h2 className="text-2xl font-semibold text-[#8B1D3D]">
            Why Baby Bath Powder is Important
          </h2>

          <p className="text-gray-700">
            Bathing your baby yourself builds confidence and bonding.
            Sridevi’s Baby Bath Powder is 100% herbal with zero
            chemicals, cleansing gently without harming delicate baby
            skin.
          </p>

          <ol className="list-decimal ml-6 space-y-3 text-gray-700">
            <li>Keeps baby skin clean naturally</li>
            <li>Softens & exfoliates gently</li>
            <li>Evens skin tone</li>
            <li>Reduces infection risk</li>
            <li>Maintains natural pH</li>
            <li>Encourages bonding</li>
            <li>Improves coordination</li>
            <li>Relaxes baby</li>
            <li>Boosts cognitive skills</li>
            <li>Improves motor skills</li>
          </ol>
        </section>

        {/* HOW TO USE */}
        <section className="mt-16 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-[#8B1D3D] mb-4">
            How to Get Maximum Benefits
          </h2>
          <p className="text-gray-700">
            Plan bath time calmly. Use lukewarm water. Mix bath powder
            beforehand. Create a distraction-free, loving environment.
          </p>
        </section>

        {/* CHOOSING */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-[#8B1D3D] mb-4">
            Choosing the Best Baby Bath Powder
          </h2>
          <p className="text-gray-700">
            Always read ingredient labels. Avoid chemicals. The first
            few ingredients define quality.
          </p>

          <p className="text-gray-700 mt-4">
            <b>Sridevi Skin Brightening Baby Bath Powder</b> contains
            turmeric, sweet flag root, sprouted moong bean, fenugreek
            and neem — safe, herbal and effective.
          </p>
        </section>
      </main>

      {/* BUY CTA */}
      <section className="bg-gradient-to-r from-[#8B1D3D] to-[#6f142f] py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">
              Give Your Baby a Truly Natural Bath 🌿
            </h2>

            <p className="mb-6">
              Trusted by 20,000+ happy parents. Zero chemicals. 100%
              herbal.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => router.push("/product/1")}
                className="bg-red-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800"
              >
                Buy Baby Bath Powder
              </button>

              <button
                onClick={() =>
                  router.push("/products?category=Bath Powders")
                }
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-900"
              >
                View All Bath Powders
              </button>
            </div>
          </div>

          <div>
            <img
              src="/images/bathpowder/baby-bath.jpg"
              alt="Baby Bath Powder"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
