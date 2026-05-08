"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getProfileDetails } from "@/services/profileService";

// Import your section components
import Home from "@/components/sections/Home";
import Profile from "@/components/sections/Profile";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import LoadingScreen from "@/components/animations/LoadingScreen";

// GSAP imports
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const sections = [
  { Component: Home, id: "home" },
  { Component: Profile, id: "profile" },
  { Component: Skills, id: "skills" },
  { Component: Experience, id: "experience" },
  { Component: Contact, id: "contact" },
];

export default function SlugPage() {
  const params = useParams();
  const slug = params.slug;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const wrapperRef = useRef(null);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProfileDetails(slug);
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Profile not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // GSAP Horizontal Scroll Logic
  useEffect(() => {
    if (!loaded || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
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
        if (!st) return;
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
    }, wrapper);

    return () => ctx.revert();
  }, [loaded]);

  if (loading) {
    return (
      <LoadingScreen onComplete={() => setLoaded(true)} profile={profileData} />
    );
  }

  if (error || !profileData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "var(--color-text-muted)",
          background: "var(--color-bg)",
        }}>
        {error || "Profile not found."}
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: "hidden",
        position: "relative",
      }}>
      {!loaded && (
        <LoadingScreen
          onComplete={() => setLoaded(true)}
          profile={profileData}
        />
      )}

      {/* 
        REMOVED: visibility and opacity toggles here. 
        The background is now handled by the root div or CSS variables, 
        so it stays black/dark while the loader fades out.
      */}
      <div
        ref={wrapperRef}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          width: `${sections.length * 100}vw`,
          height: "100vh",
          // No visibility:hidden here anymore
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
              <Home
                scrollProgress={heroScrollProgress}
                profile={profileData}
                isLoaded={loaded}
              />
            ) : (
              <Component profile={profileData} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
