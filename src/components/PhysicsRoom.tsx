'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export default function PhysicsRoom() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Module aliases
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Composite = Matter.Composite,
      Bodies = Matter.Bodies;

    // Provide a physical engine
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    // Create a renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: 600,
        background: 'transparent',
        wireframes: false,
      },
    });
    renderRef.current = render;

    // Create objects
    const ground = Bodies.rectangle(window.innerWidth / 2, 590, window.innerWidth, 40, { isStatic: true, render: { fillStyle: '#b58953' } });
    const wallLeft = Bodies.rectangle(0, 300, 40, 600, { isStatic: true, render: { visible: false } });
    const wallRight = Bodies.rectangle(window.innerWidth, 300, 40, 600, { isStatic: true, render: { visible: false } });

    // Gears / Mechanical parts
    const parts = [];
    for (let i = 0; i < 15; i++) {
      const isCircle = Math.random() > 0.5;
      const x = Math.random() * (window.innerWidth - 100) + 50;
      const y = Math.random() * 300;
      
      if (isCircle) {
        parts.push(Bodies.circle(x, y, Math.random() * 30 + 20, { 
          render: { fillStyle: Math.random() > 0.5 ? '#b58953' : '#c45b36' },
          restitution: 0.8 
        }));
      } else {
        parts.push(Bodies.rectangle(x, y, Math.random() * 60 + 30, Math.random() * 60 + 30, { 
          render: { fillStyle: Math.random() > 0.5 ? '#2c1a0e' : '#b58953' },
          restitution: 0.6
        }));
      }
    }

    // Add all of the bodies to the world
    Composite.add(world, [ground, wallLeft, wallRight, ...parts]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Run the renderer
    Render.run(render);

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Resize handler
    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: 590 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden group cursor-none">
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
         <h2 className="font-serif text-5xl text-[rgba(235,178,111,0.2)] mix-blend-screen transition-opacity duration-500 group-hover:opacity-0">The Physics Lab</h2>
      </div>
      <div ref={sceneRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
