"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Leaf, Sparkles, Heart, Star } from "lucide-react";
import { gsap } from "gsap";
import { safeAnimate } from "@/lib/gsap-utils";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=800&fit=crop&crop=center&auto=format&q=80",
    title: "Pure Herbal Skincare",
    subtitle: "Discover the power of nature for radiant, healthy skin",
    cta: "Shop Skincare",
    gradient: "from-sage-600/80 via-sage-500/60 to-transparent"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=800&fit=crop&crop=center&auto=format&q=80",
    title: "Natural Hair Care",
    subtitle: "Nourish your hair with ancient Ayurvedic wisdom",
    cta: "Explore Hair Care",
    gradient: "from-earth-600/80 via-earth-500/60 to-transparent"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1920&h=800&fit=crop&crop=center&auto=format&q=80",
    title: "Wellness Collection",
    subtitle: "Complete natural wellness for mind, body & soul",
    cta: "Shop Wellness",
    gradient: "from-sage-700/80 via-cream-600/60 to-transparent"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1920&h=800&fit=crop&crop=center&auto=format&q=80",
    title: "Ayurvedic Remedies",
    subtitle: "Time-tested herbal solutions for modern wellness",
    cta: "Discover Ayurveda",
    gradient: "from-earth-700/80 via-sage-600/60 to-transparent"
  }
];

const INTERVAL = 2000; // 2 seconds

const AdBanner = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  // Refs for animations
  const bannerRef = useRef(null);
  const slideRef = useRef(null);
  const contentRef = useRef(null);
  const dotsRef = useRef(null);
  const decorationsRef = useRef(null);

  const currentSlide = slides[currentIndex];

  // Auto-slide functionality
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered]);

  // GSAP animations for slide transitions
  useEffect(() => {
    safeAnimate(() => {
      const ctx = gsap.context(() => {
        // Slide transition animation
        const tl = gsap.timeline();
        
        tl.fromTo(
          slideRef.current,
          { opacity: 0, scale: 1.1 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
        );

        // Content animation
        tl.fromTo(
          contentRef.current?.children || [],
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.2, 
            ease: "power2.out" 
          },
          "-=0.5"
        );

        // Dots animation
        if (dotsRef.current) {
          gsap.fromTo(
            dotsRef.current.children,
            { scale: 0 },
            { 
              scale: 1, 
              duration: 0.3, 
              stagger: 0.1, 
              ease: "back.out(1.7)",
              delay: 0.5
            }
          );
        }

        // Floating decorations
        if (decorationsRef.current) {
          gsap.utils.toArray(decorationsRef.current.children).forEach((element, index) => {
            gsap.to(element, {
              y: -20,
              x: Math.sin(index) * 10,
              duration: 3 + index * 0.5,
              ease: "power1.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.3,
            });
          });
        }
      });

      return () => ctx.revert();
    });
  }, [currentIndex]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section 
      ref={bannerRef}
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden mb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Slide */}
      <div 
        ref={slideRef}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient}`}></div>
        
        {/* Nature Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
      </div>

      {/* Floating Decorations */}
      <div 
        ref={decorationsRef}
        className="absolute inset-0 pointer-events-none opacity-20"
      >
        <Leaf className="absolute top-16 left-16 w-12 h-12 text-white" />
        <Sparkles className="absolute top-24 right-20 w-8 h-8 text-white" />
        <Heart className="absolute bottom-32 left-20 w-10 h-10 text-white" />
        <Star className="absolute bottom-20 right-16 w-6 h-6 text-white" />
        <div className="absolute top-12 right-12 w-20 h-20 bg-white/10 rounded-full organic-shape"></div>
        <div className="absolute bottom-16 left-12 w-16 h-16 bg-white/10 rounded-full organic-shape-alt"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
        <div 
          ref={contentRef}
          className="max-w-4xl mx-auto px-6"
        >
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Leaf className="w-4 h-4" />
              100% Natural & Pure
            </span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold mb-4 leading-tight">
            {currentSlide.title}
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            {currentSlide.subtitle}
          </p>
          
          <button 
            onClick={() => router.push('/products')}
            className="inline-flex items-center gap-3 bg-red-900 text-white font-bold py-4 px-8 rounded-full hover:bg-red-800 transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            {currentSlide.cta}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group z-20"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group z-20"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
      </button>

      {/* Dots Indicator */}
      <div 
        ref={dotsRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 z-20"
      >
        {isPlaying ? (
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-white rounded"></div>
            <div className="w-1 h-4 bg-white rounded"></div>
          </div>
        ) : (
          <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
        )}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <div 
          className={`h-full bg-white transition-all ease-linear ${
            isPlaying && !isHovered ? 'progress-bar' : 'w-0'
          }`}
          style={{
            animationDuration: `${INTERVAL}ms`,
            animationPlayState: isPlaying && !isHovered ? 'running' : 'paused'
          }}
        ></div>
      </div>
    </section>
  );
};

export default AdBanner;
