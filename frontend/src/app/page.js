"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <div
      className="flex h-screen snap-x snap-mandatory"
      style={{
        width: "100vw",
        overflowX: "scroll",
        overflowY: "hidden",
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* IE/Edge */,
      }}>
      {/* Hide scrollbar for Chrome/Safari */}
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>

      {[Hero, About, Skills, Experience, Contact].map((Section, i) => (
        <section
          key={i}
          className="snap-start shrink-0"
          style={{ width: "100vw", height: "100vh" }}>
          <Section />
        </section>
      ))}
    </div>
  );
}
