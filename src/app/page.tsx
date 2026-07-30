import HeroScene from "@/components/Scene1/HeroScene";
import CustomCursor from "@/components/Scene1/CustomCursor";

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-[var(--color-workshop-bg)] text-workshop-brass overflow-hidden">
      <CustomCursor />
      <HeroScene />
    </main>
  );
}
