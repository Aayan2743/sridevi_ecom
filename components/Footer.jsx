import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Leaf, 
  Heart, 
  Mail, 
  Phone, 
  MapPin,
  Sparkles,
  Award
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animations, safeAnimate } from "@/lib/gsap-utils";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef(null);
  const decorationsRef = useRef(null);

  useEffect(() => {
    safeAnimate(() => {
      const ctx = gsap.context(() => {
        // Footer entrance animation
        gsap.fromTo(
          footerRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Floating decorations
        if (decorationsRef.current) {
          gsap.utils.toArray(decorationsRef.current.children).forEach((element, index) => {
            gsap.to(element, {
              y: -15,
              duration: 2 + index * 0.5,
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
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="relative bg-gradient-to-br from-sage-800 via-sage-700 to-earth-800 text-white overflow-hidden"
    >
      {/* Background decorations */}
      <div 
        ref={decorationsRef}
        className="absolute inset-0 opacity-10"
      >
        <Leaf className="absolute top-12 left-16 w-24 h-24" />
        <Sparkles className="absolute top-20 right-20 w-16 h-16" />
        <Heart className="absolute bottom-20 left-1/4 w-20 h-20" />
        <Award className="absolute bottom-16 right-1/3 w-16 h-16" />
        <div className="absolute top-8 right-8 w-32 h-32 bg-earth-600 rounded-full organic-shape opacity-20"></div>
        <div className="absolute bottom-12 left-12 w-28 h-28 bg-sage-600 rounded-full organic-shape-alt opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <img
                  src="/logo.webp"
                  alt="Sridevi Herbal and Co"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-gradient-light">
                  Sridevi Herbal & Co
                </h3>
                <p className="text-cream-200 text-sm">Purely Natural Care</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                <Leaf className="w-5 h-5 text-cream-300" />
                About Our Mission
              </h4>
              <p className="text-cream-100 leading-relaxed mb-4">
                Hi, I am Vemula Sridevi. I have completed a 2-year Ayurvedic diploma along with 
                naturopathy course. I am an expert in natural skin and hair care products, 
                dedicated to bringing you the purest herbal solutions for your wellness journey.
              </p>
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 text-cream-200 hover:text-white font-medium transition-colors group"
              >
                Learn More About Us
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-cream-300" />
                Connect With Us
              </h4>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Youtube, href: "#", label: "YouTube" },
                  { icon: MessageCircle, href: "#", label: "WhatsApp" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 text-cream-200 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cream-300" />
              Quick Links
            </h4>
            <ul className="space-y-3 text-cream-100">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Shop Natural Products" },
                { href: "/bath-powder-story", label: "Bath Powder Story" },
                { href: "/success-story", label: "Success Stories" },
                { href: "/about-us", label: "About Us" },
                { href: "/account", label: "My Account" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link 
                    href={href} 
                    className="hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <Leaf className="w-3 h-3 text-cream-300 group-hover:text-cream-200 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-cream-300" />
              Get In Touch
            </h4>
            <div className="space-y-4 text-cream-100">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cream-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Email Us</p>
                  <a 
                    href="mailto:herbalandco@gmail.com" 
                    className="hover:text-white transition-colors"
                  >
                    herbalandco@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-cream-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Call Us</p>
                  <a 
                    href="tel:8919105591" 
                    className="hover:text-white transition-colors"
                  >
                    +91 8919105591
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cream-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Visit Us</p>
                  <p className="text-sm leading-relaxed">
                    Natural Wellness Center<br />
                    Hyderabad, Telangana<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-cream-300" />
                <span className="text-sm font-medium text-white">Trusted by Crores</span>
              </div>
              <p className="text-xs text-cream-200">
                100% Natural • Ayurvedic Certified • Chemical-Free
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-cream-200">
              <Heart className="w-4 h-4 text-cream-300" />
              <span className="text-sm">
                © 2024 Sridevi Herbal & Co. Made with love for natural wellness.
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-cream-200">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/shipping" className="hover:text-white transition-colors">
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-sage-900/50 to-transparent pointer-events-none"></div>
    </footer>
  );
}
