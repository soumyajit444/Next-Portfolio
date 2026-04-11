"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <div className="w-screen h-screen overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory">
      <section className="min-w-screen h-screen snap-start">
        <Hero />
      </section>

      <section className="min-w-screen h-screen snap-start">
        <About />
      </section>

      <section className="min-w-screen h-screen snap-start">
        <Skills />
      </section>

      <section className="min-w-screen h-screen snap-start">
        <Experience />
      </section>

      <section className="min-w-screen h-screen snap-start">
        <Contact />
      </section>
    </div>
  );
}
