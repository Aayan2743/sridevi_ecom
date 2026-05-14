"use client";

import React, { useState, useEffect, useRef } from "react";
import { Leaf, Sparkles, Heart, Star } from "lucide-react";
import { gsap } from "gsap";
import api from "@/lib/api";
import { safeAnimate } from "@/lib/gsap-utils";

const LoadingAnimation = ({ onComplete }) => {
  const [currentItem, setCurrentItem] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [logoVisible, setLogoVisible] = useState(false);
  const [logo, setLogo] = useState("/logo.webp");

  // Refs for animations
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const itemsRef = useRef(null);
  const progressRef = useRef(null);

  const herbalItems = [
    { icon: Leaf, name: "Natural Herbs", color: "text-sage-500" },
    { icon: Sparkles, name: "Pure Essence", color: "text-earth-500" },
    { icon: Heart, name: "Wellness Care", color: "text-sage-600" },
    { icon: Star, name: "Ayurvedic Power", color: "text-earth-600" },
    { icon: Leaf, name: "Herbal Magic", color: "text-sage-700" },
  ];

  useEffect(() => {
    safeAnimate(() => {
      const ctx = gsap.context(() => {
        // Initial setup
        gsap.set(containerRef.current, { opacity: 1 });
        
        // Logo entrance animation
        const logoTl = gsap.timeline();
        logoTl
          .fromTo(
            logoRef.current,
            { scale: 0, rotation: -180, opacity: 0 },
            { 
              scale: 1, 
              rotation: 0, 
              opacity: 1, 
              duration: 1.2, 
              ease: "back.out(1.7)",
              onComplete: () => setLogoVisible(true)
            }
          )
          .to(logoRef.current, {
            y: -5,
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
          });

        // Floating background elements
        gsap.utils.toArray('.floating-element').forEach((element, index) => {
          gsap.to(element, {
            y: -20,
            x: Math.sin(index) * 10,
            duration: 3 + index * 0.5,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.2,
          });
        });
      });

      return () => ctx.revert();
    });

    // Item progression
    const interval = setInterval(() => {
      setCurrentItem((prev) => {
        if (prev < herbalItems.length - 1) {
          // Animate current item
          safeAnimate(() => {
            const currentElement = itemsRef.current?.children[prev + 1];
            if (currentElement) {
              gsap.fromTo(
                currentElement,
                { scale: 0.5, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
              );
            }
          });
          return prev + 1;
        } else {
          clearInterval(interval);
          // Exit animation
          safeAnimate(() => {
            gsap.to(containerRef.current, {
              opacity: 0,
              scale: 0.9,
              duration: 0.8,
              ease: "power2.in",
              onComplete: () => {
                setIsVisible(false);
                setTimeout(onComplete, 100);
              },
            });
          });
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete, herbalItems.length]);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await api.get("/ecom/app-logo-settings");
        if (res.data?.success && res.data?.data?.app_logo_url) {
          setLogo(res.data.data.app_logo_url);
        }
      } catch (error) {
        console.error("Logo fetch failed", error);
      }
    };

    fetchLogo();
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-sage-50 via-cream-50 to-earth-50 flex items-center justify-center z-50 overflow-hidden"
    >
      {/* Floating background decorations */}
      <div className="absolute inset-0 opacity-20">
        <Leaf className="floating-element absolute top-20 left-16 w-16 h-16 text-sage-400" />
        <Sparkles className="floating-element absolute top-32 right-20 w-12 h-12 text-earth-400" />
        <Heart className="floating-element absolute bottom-32 left-20 w-14 h-14 text-sage-500" />
        <Star className="floating-element absolute bottom-20 right-16 w-10 h-10 text-earth-500" />
        <div className="floating-element absolute top-1/4 left-1/3 w-24 h-24 bg-sage-200 rounded-full organic-shape"></div>
        <div className="floating-element absolute bottom-1/3 right-1/4 w-20 h-20 bg-earth-200 rounded-full organic-shape-alt"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="mb-12">
          <div 
            ref={logoRef}
            className="w-32 h-32 mx-auto mb-6 bg-white/80 backdrop-blur-sm rounded-full shadow-nature-lg flex items-center justify-center"
          >
            <img
              src={logo}
              alt="Sridevi Herbal & Co"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gradient mb-2">
            Sridevi Herbal & Co
          </h1>
          <p className="text-sage-600 text-sm">Purely Natural Care</p>
        </div>

        {/* Herbal Items Animation */}
        <div 
          ref={itemsRef}
          className="flex justify-center items-center space-x-4 mb-8 min-h-[80px]"
        >
          {herbalItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index <= currentItem
                    ? "opacity-100 scale-100"
                    : "opacity-30 scale-75"
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-2 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-nature ${
                  index === currentItem ? 'animate-pulse-soft' : ''
                }`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="text-xs text-sage-700 font-medium">{item.name}</div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto mb-6">
          <div className="h-2 bg-sage-200/50 rounded-full overflow-hidden shadow-inner">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-sage-500 to-earth-500 rounded-full transition-all duration-500 ease-out shadow-glow"
              style={{
                width: `${((currentItem + 1) / herbalItems.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-sage-700 font-medium">
          {currentItem === herbalItems.length - 1
            ? (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-earth-500" />
                <span>Welcome to Natural Wellness</span>
                <Sparkles className="w-4 h-4 text-earth-500" />
              </div>
            )
            : (
              <div className="flex items-center justify-center gap-2">
                <Leaf className="w-4 h-4 text-sage-500 animate-pulse" />
                <span>Preparing herbal goodness...</span>
              </div>
            )}
        </div>

        {/* Subtitle */}
        <p className="text-sage-600 text-sm mt-2 opacity-75">
          Trusted by crores • 100% Natural • Chemical-Free
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
