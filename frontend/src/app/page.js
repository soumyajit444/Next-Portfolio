"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import Home from "@/components/sections/Home";
import Profile from "@/components/sections/Profile";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import LoadingScreen from "@/components/animations/LoadingScreen";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, Observer);

const sections = [
  { Component: Home, id: "home" },
  { Component: Profile, id: "profile" },
  { Component: Skills, id: "skills" },
  { Component: Experience, id: "experience" },
  { Component: Contact, id: "contact" },
];

export default function Page() {
  const wrapperRef = useRef(null);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      const sectionEls = gsap.utils.toArray(".h-section", wrapper);

      const tween = gsap.to(sectionEls, {
        xPercent: -100 * (sectionEls.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: wrapper,
          scrub: 1,

          end: () => `+=${wrapper.offsetWidth}`,
          onUpdate: (self) => {
            const progress = Math.min(self.progress * sectionEls.length, 1);
            setHeroScrollProgress(progress);

            window.dispatchEvent(
              new CustomEvent("bgscroll", { detail: self.progress }),
            );
          },
        },
      });

      window.scrollToSection = (index) => {
        const st = tween.scrollTrigger;
        const totalScroll = st.end - st.start;
        const targetProgress = index / (sectionEls.length - 1);

        gsap.to(window, {
          scrollTo: {
            y: st.start + totalScroll * targetProgress,
          },
          duration: 1,
          ease: "power2.inOut",
        });
      };

      return () => tween.kill();
    }, wrapper); // scope context to wrapper

    return () => ctx.revert(); // cleanly removes all GSAP, avoids DOM conflict
  }, [loaded]);

  return (
    <div style={{ overflowX: "hidden", position: "relative" }}>
      {!loaded && (
        <LoadingScreen onComplete={() => setLoaded(true)} /> // ← ADD
      )}
      {/* CONTENT */}
      <div
        ref={wrapperRef}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          width: `${sections.length * 100}vw`,
          height: "100vh",
        }}>
        {sections.map(({ Component, id }, i) => (
          <div
            key={i}
            id={id}
            className="h-section"
            style={{
              width: "100vw",
              height: "100vh",
              flexShrink: 0,
              overflow: i === 0 ? "visible" : "hidden",
              position: "relative",
              zIndex: i === 0 ? 0 : i,
            }}>
            {i === 0 ? (
              <Home scrollProgress={heroScrollProgress} />
            ) : (
              <Component />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
