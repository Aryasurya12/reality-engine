import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LenisProvider from './components/Scroll/LenisProvider';
import MechanicalCursor from './components/cursor/MechanicalCursor';
import SceneController from './components/experience/WorkshopExperience';

export default function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>The Inventor's Workshop</title>
        <meta
          name="description"
          content="An interactive digital installation. Every invention begins with curiosity."
        />
        <meta name="keywords" content="interactive, workshop, inventor, digital art, experience" />
      </Helmet>
      
      <LenisProvider>
        <main className="w-full min-h-screen bg-[#050403]">
          <MechanicalCursor />
          <SceneController />
        </main>
      </LenisProvider>
    </BrowserRouter>
  );
}
