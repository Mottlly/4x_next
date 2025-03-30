"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProjectCard from "./components/SplashUI/projectCard";
import Header from "./components/SplashUI/header";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleEnterGame = () => router.push("/menu");
  const handleProjectClick = (url) => router.push(url);

  return (
    <div className="relative min-h-screen px-6 pb-20 pt-24 sm:px-12 sm:pt-28 font-[family-name:var(--font-geist-sans)]">
      <Header />

      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Welcome to My App Hub</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Dive into the main experience or explore some of my other projects
          below.
        </p>
      </div>

      {/* Card Row */}
      {session && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto items-end">
          {/* Left - Project Two */}
          <div className="flex justify-end md:mr-12">
            <ProjectCard
              title="Obscurum"
              imageSrc="/galBack.jpg"
              description="An experimental AI art generator powered by prompts."
              onClick={() => handleProjectClick("/project-two")}
            />
          </div>

          {/* Center - Main Game */}
          <div className="flex justify-center">
            <ProjectCard
              title="Enter the Game"
              imageSrc="/game-thumbnail.jpg"
              highlighted={true}
              description="A tactical board game where strategy meets fantasy. Jump in!"
              onClick={handleEnterGame}
            />
          </div>

          {/* Right - Project Three */}
          <div className="flex justify-start md:ml-12">
            <ProjectCard
              title="SeekIt: Pantry Manager"
              imageSrc="/SeekIt-Logo_MultiColour.png"
              description="A playful search-and-find puzzle game for quick breaks."
              onClick={() => handleProjectClick("/project-three")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
