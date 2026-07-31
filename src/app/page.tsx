import SceneController from "@/components/SceneController";
import CustomCursor from "@/components/Scene1/Core/CustomCursor";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#050403]">
      <CustomCursor />
      <SceneController />
    </main>
  );
}
