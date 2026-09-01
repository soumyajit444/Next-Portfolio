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

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const sections = [
  { Component: Home, id: "home" },
  { Component: Profile, id: "profile" },
  { Component: Skills, id: "skills" },
  { Component: Experience, id: "experience" },
  { Component: Contact, id: "contact" },
];

const DESKTOP_SECTION_WIDTHS = [100, 100, 350, 100, 100];
const MOBILE_SECTION_WIDTHS = [100, 100, 150, 100, 100];

const DESKTOP_SECTION_NAV_POSITIONS = [0.0, 0.15, 0.3, 0.66, 1.0];
const MOBILE_SECTION_NAV_POSITIONS = [0.0, 0.225, 0.41, 0.7, 1.0];

export default function SlugPage() {
  const params = useParams();
  const slug = params.slug;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const wrapperRef = useRef(null);

  const lastActiveIndexRef = useRef(0);
  const pendingIndexRef = useRef(0);
  const settleTimerRef = useRef(null);

  const navigationLockRef = useRef(false);
  const navigationTargetRef = useRef(-1);
  const navigationTweenRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

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

    const sectionWidths = isMobile
      ? MOBILE_SECTION_WIDTHS
      : DESKTOP_SECTION_WIDTHS;

    const sectionNavPositions = isMobile
      ? MOBILE_SECTION_NAV_POSITIONS
      : DESKTOP_SECTION_NAV_POSITIONS;

    const ctx = gsap.context(() => {
      const sectionElements = Array.from(
        wrapper.querySelectorAll(".h-section"),
      );

      const totalWidth = sectionElements.reduce(
        (total, section) => total + section.getBoundingClientRect().width,
        0,
      );

      const viewportWidth = window.innerWidth;
      const maxHorizontalScroll = Math.max(totalWidth - viewportWidth, 1);

      const setActiveSection = (index) => {
        if (index === lastActiveIndexRef.current) return;

        lastActiveIndexRef.current = index;
        pendingIndexRef.current = index;

        window.dispatchEvent(
          new CustomEvent("sectionchange", {
            detail: {
              index,
              id: sections[index]?.id,
            },
          }),
        );
      };

      const getActiveIndex = (progress) => {
        let activeIndex = 0;

        for (let i = sectionNavPositions.length - 1; i >= 0; i--) {
          if (progress >= sectionNavPositions[i]) {
            activeIndex = i;
            break;
          }
        }

        return Math.min(activeIndex, sections.length - 1);
      };

      const tween = gsap.to(wrapper, {
        x: -maxHorizontalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          end: () => `+=${maxHorizontalScroll}`,

          onUpdate: (self) => {
            const progress = gsap.utils.clamp(0, 1, self.progress);
            const activeIndex = getActiveIndex(progress);

            setHeroScrollProgress(progress);

            window.dispatchEvent(
              new CustomEvent("bgscroll", {
                detail: progress,
              }),
            );

            if (navigationLockRef.current) return;

            if (activeIndex !== pendingIndexRef.current) {
              pendingIndexRef.current = activeIndex;

              clearTimeout(settleTimerRef.current);

              settleTimerRef.current = setTimeout(() => {
                setActiveSection(activeIndex);
              }, 150);
            }
          },
        },
      });

      navigationTweenRef.current = tween;

      window.scrollToSection = (index) => {
        const st = tween.scrollTrigger;

        if (!st) return;
        if (index < 0 || index >= sections.length) return;

        const targetProgress = gsap.utils.clamp(
          0,
          1,
          sectionNavPositions[index],
        );

        const targetY = st.start + (st.end - st.start) * targetProgress;

        if (navigationTweenRef.current) {
          gsap.killTweensOf(window);
        }

        navigationLockRef.current = true;
        navigationTargetRef.current = index;
        pendingIndexRef.current = index;

        gsap.to(window, {
          scrollTo: {
            y: targetY,
            autoKill: false,
          },
          duration: 1,
          ease: "power2.inOut",

          onComplete: () => {
            const targetIndex = navigationTargetRef.current;

            navigationLockRef.current = false;
            navigationTargetRef.current = -1;

            pendingIndexRef.current = targetIndex;
            lastActiveIndexRef.current = targetIndex;

            window.dispatchEvent(
              new CustomEvent("sectionchange", {
                detail: {
                  index: targetIndex,
                  id: sections[targetIndex]?.id,
                },
              }),
            );
          },

          onInterrupt: () => {
            navigationLockRef.current = false;
            navigationTargetRef.current = -1;
          },
        });
      };

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        tween.kill();
        clearTimeout(settleTimerRef.current);
        gsap.killTweensOf(window);

        if (window.scrollToSection) {
          delete window.scrollToSection;
        }

        navigationTweenRef.current = null;
      };
    }, wrapper);

    return () => {
      ctx.revert();
    };
  }, [loaded, isMobile]);

  useEffect(() => {
    if (!loaded) return;

    const hash = window.location.hash.replace("#", "");
    const targetSection = sections.find((section) => section.id === hash);

    if (targetSection && typeof window.scrollToSection === "function") {
      const index = sections.indexOf(targetSection);

      setTimeout(() => {
        window.scrollToSection(index);
      }, 150);
    }
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

  const activeSectionWidths = isMobile
    ? MOBILE_SECTION_WIDTHS
    : DESKTOP_SECTION_WIDTHS;

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
          width: `${activeSectionWidths.reduce(
            (sum, width) => sum + width,
            0,
          )}vw`,
          height: "100vh",
          willChange: "transform",
        }}>
        {sections.map(({ Component, id }, index) => (
          <div
            key={id}
            id={id}
            className="h-section"
            style={{
              width: `${activeSectionWidths[index]}vw`,
              minWidth: `${activeSectionWidths[index]}vw`,
              height: "100vh",
              flexShrink: 0,
              overflow: index === 0 ? "visible" : "hidden",
              position: "relative",
              zIndex: index === 0 ? 0 : index,
            }}>
            {index === 0 ? (
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
