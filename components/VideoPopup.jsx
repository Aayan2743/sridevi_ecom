"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function VideoPopup({ videoUrl, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
          />

          {/* Video Modal - Center */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-4xl w-full">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Video Container */}
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-auto max-h-[80vh] object-contain"
                    controlsList="nodownload"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-96 text-white">
                    <p className="text-lg">No video available</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
