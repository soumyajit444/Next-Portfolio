"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getProfileDetails } from "@/services/profileService";

import Home from "@/components/sections/Home";
import Profile from "@/components/sections/Profile";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import LoadingScreen from "@/components/animations/LoadingScreen";

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

  // 👇 Refs for stable section detection
  const lastActiveIndexRef = useRef(-1);
  const settleTimerRef = useRef(null);
  const pendingIndexRef = useRef(-1);

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

  useEffect(() => {
    if (!loaded || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const ctx = gsap.context(() => {
      const sectionEls = gsap.utils.toArray(".h-section", wrapper);
      const sectionCount = sectionEls.length;

      const sectionWidths = sectionEls.map((el, i) => (i === 2 ? 350 : 100));

      const totalWidth = sectionWidths.reduce((sum, width) => sum + width, 0);

      sectionEls.forEach((el, i) => {
        el.style.width = `${sectionWidths[i]}vw`;
      });

      const tween = gsap.to(sectionEls, {
        x: () => -(totalWidth - 100) * (window.innerWidth / 100),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: wrapper,
          scrub: 1,
          end: () => `+=${wrapper.offsetWidth}`,
          onUpdate: (self) => {
            const progress = Math.min(self.progress, 1);
            setHeroScrollProgress(progress);
            window.dispatchEvent(
              new CustomEvent("bgscroll", { detail: self.progress }),
            );

            // Calculate index with a 70% threshold (triggers later, feels more accurate)
            const rawIndex = progress * (sectionCount - 1);
            const closestIndex = Math.min(
              Math.floor(rawIndex + 0.7),
              sectionCount - 1,
            );

            // Only process if index changed
            if (closestIndex !== pendingIndexRef.current) {
              pendingIndexRef.current = closestIndex;
              clearTimeout(settleTimerRef.current);

              // Wait for scroll to settle on this section before dispatching
              settleTimerRef.current = setTimeout(() => {
                if (pendingIndexRef.current !== lastActiveIndexRef.current) {
                  lastActiveIndexRef.current = pendingIndexRef.current;

                  window.dispatchEvent(
                    new CustomEvent("sectionchange", {
                      detail: {
                        index: pendingIndexRef.current,
                        id: sections[pendingIndexRef.current]?.id,
                      },
                    }),
                  );
                }
              }, 150); // Adjust: 120-180ms is the sweet spot
            }
          },
        },
      });

      window.scrollToSection = (index) => {
        const st = tween.scrollTrigger;
        if (!st) return;
        const totalScroll = st.end - st.start;
        const targetProgress = index / (sectionCount - 1);

        gsap.to(window, {
          scrollTo: { y: st.start + totalScroll * targetProgress },
          duration: 1,
          ease: "power2.inOut",
        });
      };

      return () => {
        tween.kill();
        clearTimeout(settleTimerRef.current);
      };
    }, wrapper);

    return () => ctx.revert();
  }, [loaded]);

  // Handle initial hash on page load
  useEffect(() => {
    if (!loaded) return;

    const hash = window.location.hash.replace("#", "");
    const targetSection = sections.find((s) => s.id === hash);

    if (targetSection && typeof window.scrollToSection === "function") {
      const index = sections.indexOf(targetSection);
      setTimeout(() => window.scrollToSection(index), 100);
    }
  }, [loaded]);

  if (loading)
    return (
      <LoadingScreen onComplete={() => setLoaded(true)} profile={profileData} />
    );
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
    <div style={{ overflowX: "hidden", position: "relative" }}>
      {!loaded && (
        <LoadingScreen
          onComplete={() => setLoaded(true)}
          profile={profileData}
        />
      )}
      <div
        ref={wrapperRef}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          width: `${(sections.length + 2) * 100}vw`,
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
              overflow: "hidden",
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
