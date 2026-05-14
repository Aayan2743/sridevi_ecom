import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation presets for nature-inspired effects
export const animations = {
  // Gentle fade up animation
  fadeUp: (element, delay = 0) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: "power2.out",
      }
    );
  },

  // Soft scale in animation
  scaleIn: (element, delay = 0) => {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay,
        ease: "power2.out",
      }
    );
  },

  // Stagger animation for lists
  staggerFadeUp: (elements, stagger = 0.1) => {
    return gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger,
        ease: "power2.out",
      }
    );
  },

  // Floating animation for decorative elements
  float: (element) => {
    return gsap.to(element, {
      y: -10,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  },

  // Parallax effect
  parallax: (element, speed = 0.5) => {
    return gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  },

  // Reveal animation with scroll trigger
  revealOnScroll: (element, direction = "up") => {
    const fromVars = {
      opacity: 0,
    };
    
    switch (direction) {
      case "up":
        fromVars.y = 50;
        break;
      case "down":
        fromVars.y = -50;
        break;
      case "left":
        fromVars.x = -50;
        break;
      case "right":
        fromVars.x = 50;
        break;
    }

    return gsap.fromTo(
      element,
      fromVars,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  },

  // Hover animations
  hover: {
    scale: (element) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
      return tl;
    },

    lift: (element) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(element, {
        y: -5,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
      return tl;
    },

    glow: (element) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(element, {
        boxShadow: "0 0 20px rgba(76, 175, 80, 0.3)",
        duration: 0.3,
        ease: "power2.out",
      });
      return tl;
    },
  },

  // Page transition
  pageTransition: {
    enter: (element) => {
      return gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    },

    exit: (element) => {
      return gsap.to(element, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
      });
    },
  },
};

// Custom hooks for animations
export const useGSAP = () => {
  const ctx = gsap.context(() => {});
  
  return {
    add: (animation) => ctx.add(animation),
    revert: () => ctx.revert(),
  };
};

// Utility to check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Safe animation wrapper that respects accessibility
export const safeAnimate = (animationFn, fallbackFn = null) => {
  if (prefersReducedMotion()) {
    if (fallbackFn) fallbackFn();
    return;
  }
  return animationFn();
};