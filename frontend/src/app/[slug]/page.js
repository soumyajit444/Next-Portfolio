"use client";

import { memo, useEffect, useState, useRef } from "react";
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

const sectionWidths = [100, 100, 350, 100, 100];

const totalWidth = sectionWidths.reduce((sum, width) => sum + width, 0);

const Section = memo(function Section({
  Component,
  id,
  index,
  profile,
  isLoaded,
}) {
  return (
    <div
      id={id}
      className="h-section"
      style={{
        width: `${sectionWidths[index]}vw`,
        height: "100vh",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
        zIndex: index === 0 ? 0 : index,
      }}>
      {index === 0 ? (
        <Component profile={profile} isLoaded={isLoaded} />
      ) : (
        <Component profile={profile} />
      )}
    </div>
  );
});

export default function SlugPage() {
  const params = useParams();
  const slug = params.slug;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const wrapperRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Refs for stable section detection
  const lastActiveIndexRef = useRef(-1);
  const settleTimerRef = useRef(null);
  const pendingIndexRef = useRef(-1);

  // Fetch profile data
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

  // GSAP horizontal scroll
  useEffect(() => {
    if (!loaded || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    const ctx = gsap.context(() => {
      const sectionEls = gsap.utils.toArray(".h-section", wrapper);
      const sectionCount = sectionEls.length;

      if (!sectionCount) return;

      sectionEls.forEach((el, i) => {
        el.style.width = `${sectionWidths[i]}vw`;
      });

      const horizontalDistance = (totalWidth - 100) * (window.innerWidth / 100);

      const tween = gsap.to(sectionEls, {
        x: -horizontalDistance,
        ease: "none",

        scrollTrigger: {
          trigger: wrapper,
          pin: wrapper,
          scrub: 1,
          end: () => `+=${horizontalDistance}`,

          onUpdate: (self) => {
            const progress = Math.min(Math.max(self.progress, 0), 1);

            window.dispatchEvent(
              new CustomEvent("bgscroll", {
                detail: progress,
              }),
            );

            let closestIndex = 0;
            let accumulated = 0;

            const viewportCenter =
              progress * horizontalDistance + window.innerWidth / 2;

            let closestDistance = Infinity;

            sectionEls.forEach((el, index) => {
              const width = sectionWidths[index] * (window.innerWidth / 100);

              const sectionCenter = accumulated + width / 2;
              const distance = Math.abs(sectionCenter - viewportCenter);

              if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
              }

              accumulated += width;
            });

            if (closestIndex !== pendingIndexRef.current) {
              pendingIndexRef.current = closestIndex;

              clearTimeout(settleTimerRef.current);

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
              }, 150);
            }
          },
        },
      });

      window.scrollToSection = (index) => {
        const st = tween.scrollTrigger;

        if (!st) return;

        const clampedIndex = Math.max(0, Math.min(index, sectionCount - 1));

        const viewportWidth = window.innerWidth;

        let targetOffset = 0;

        for (let i = 0; i < clampedIndex; i++) {
          targetOffset += sectionWidths[i] * (viewportWidth / 100);
        }

        const targetScroll = Math.max(
          0,
          Math.min(targetOffset, horizontalDistance),
        );

        gsap.to(window, {
          scrollTo: {
            y: st.start + targetScroll,
          },
          duration: 1,
          ease: "power2.inOut",
        });
      };

      return () => {
        tween.kill();
        clearTimeout(settleTimerRef.current);

        if (typeof window !== "undefined") {
          window.scrollToSection = undefined;
        }
      };
    }, wrapper);

    return () => ctx.revert();
  }, [loaded]);

  // Handle initial hash
  useEffect(() => {
    if (!loaded) return;

    const hash = window.location.hash.replace("#", "");

    const targetSection = sections.find((section) => section.id === hash);

    if (targetSection && typeof window.scrollToSection === "function") {
      const index = sections.indexOf(targetSection);

      setTimeout(() => {
        window.scrollToSection(index);
      }, 100);
    }
  }, [loaded]);

  // Loading state
  if (loading) {
    return (
      <LoadingScreen onComplete={() => setLoaded(true)} profile={profileData} />
    );
  }

  // Error state
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

      <div
        ref={wrapperRef}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          width: `${totalWidth}vw`,
          height: "100vh",
        }}>
        {sections.map(({ Component, id }, i) => (
          <Section
            key={id}
            Component={Component}
            id={id}
            index={i}
            profile={profileData}
            isLoaded={loaded}
          />
        ))}
      </div>
    </div>
  );
}
