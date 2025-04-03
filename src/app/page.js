"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { splashStyles } from "../library/styles/splash/splashstyles";
import ProjectCard from "./components/SplashUI/projectCard";
import Header from "./components/SplashUI/header";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleEnterGame = () => router.push("/menu");
  const handleProjectClick = (url) => router.push(url);

  return (
    <div className={splashStyles.pageContainer}>
      <Header />

      {/* Page Title */}
      <div className={splashStyles.titleContainer}>
        <h1 className={splashStyles.title}>Welcome to My App Hub</h1>
        <p className={splashStyles.subtitle}>
          Dive into the main experience or explore some of my other projects
          below.
        </p>
      </div>

      {/* Card Row */}
      {session && (
        <div className={splashStyles.cardGrid}>
          {/* Left - Project Two */}
          <div className={splashStyles.leftCard}>
            <ProjectCard
              title="Obscurum"
              imageSrc="/galBack.jpg"
              description="An experimental AI art generator powered by prompts."
              onClick={() => handleProjectClick("/project-two")}
            />
          </div>

          {/* Center - Main Game */}
          <div className={splashStyles.centerCard}>
            <ProjectCard
              title="Enter the Game"
              imageSrc="/game-thumbnail.jpg"
              highlighted={true}
              description="A tactical board game where strategy meets fantasy. Jump in!"
              onClick={handleEnterGame}
            />
          </div>

          {/* Right - Project Three */}
          <div className={splashStyles.rightCard}>
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
