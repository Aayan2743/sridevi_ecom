"use client";

import { memo, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Premium “Watch & Buy” clip:
 * - Desktop: overlays the right column (absolute + inner sticky) so copy stays full width.
 * - Mobile: fixed corner above bottom bar. Single <video>.
 */
function ProductPremiumStickyVideo({
  videoUrl,
  productName,
  sampleVideos = [],
}) {
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) el.pause();
    else void el.play();
    setPlaying(!playing);
  }, [playing]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  }, []);

  const close = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    setVisible(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="product-sticky-video"
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0.94,
            transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
          }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className={cn(
            "max-xl:pointer-events-auto max-xl:fixed max-xl:bottom-24 max-xl:right-3 max-xl:z-30 max-xl:w-[168px]",
            "xl:pointer-events-none xl:absolute xl:inset-y-0 xl:right-4 xl:z-[45] xl:w-[min(42vw,240px)] xl:max-w-[240px]",
          )}
        >
          <div
            className={cn(
              "xl:pointer-events-auto xl:sticky xl:top-28",
              "xl:max-h-[min(72vh,calc(100vh-9rem))] xl:overflow-hidden",
              "xl:transition-[top] xl:duration-300 xl:ease-out",
            )}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl bg-black",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_16px_40px_-12px_rgba(0,0,0,0.45)]",
                "ring-1 ring-black/20",
                "max-xl:max-h-[38vh]",
              )}
            >
              <div className="relative aspect-[9/16] w-full max-xl:max-h-[32vh] xl:max-h-[min(420px,52vh)]">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  autoPlay
                  muted={muted}
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const el = e.target;
                    if (!sampleVideos?.length) return;
                    const idx = sampleVideos.indexOf(el.src);
                    if (idx < 0) return;
                    const next = (idx + 1) % sampleVideos.length;
                    if (next !== idx) el.src = sampleVideos[next];
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-3 pt-10">
                  <p className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-white drop-shadow">
                    Watch &amp; Buy
                  </p>
                  <p className="mt-1 truncate text-center text-[10px] font-medium text-white/85">
                    {productName}
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={togglePlay}
                  className="absolute inset-0 z-[5] flex items-center justify-center bg-transparent pointer-events-none"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  <span className="pointer-events-auto rounded-full border border-white/35 bg-white/15 p-3 backdrop-blur-md">
                    {playing ? (
                      <span className="block h-5 w-5 rounded-sm bg-white/90" />
                    ) : (
                      <Play className="ml-0.5 h-6 w-6 text-white" />
                    )}
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={close}
                  aria-label="Close video"
                  className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-lg ring-1 ring-white/25 transition hover:bg-black/85"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white shadow-md ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-black/70"
                >
                  {muted ? (
                    <VolumeX className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" aria-hidden />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(ProductPremiumStickyVideo);
