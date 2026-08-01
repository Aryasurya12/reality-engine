const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace absolute aliases
  content = content.replace(/@\/components\/Scene[123]\/Core\//g, '@/components/scenes/');
  content = content.replace(/@\/components\/Scene[123]\/Environment\//g, '@/components/environment/');
  content = content.replace(/@\/components\/Scene[123]\/Robot\//g, '@/components/svg/');
  content = content.replace(/@\/components\/Scene[123]\/Machine\//g, '@/components/svg/');
  content = content.replace(/@\/components\/Scene[123]\/Puzzles\//g, '@/components/scenes/');
  content = content.replace(/@\/components\/SceneController/g, '@/components/experience/WorkshopExperience');

  // Replace relative imports from within components
  content = content.replace(/\.\.\/Environment\//g, '../environment/');
  content = content.replace(/\.\.\/Robot\//g, '../svg/');
  content = content.replace(/\.\.\/Machine\//g, '../svg/');
  content = content.replace(/\.\.\/Core\//g, '../scenes/');
  
  // Custom cursor
  content = content.replace(/CustomCursor/g, 'MechanicalCursor');
  content = content.replace(/CinematicRobot/g, 'Robot');
  
  // TransitionParticles path in WorkshopExperience
  if (file.includes('WorkshopExperience')) {
    content = content.replace(/\.\/TransitionParticles/g, '../TransitionParticles');
    content = content.replace(/\.\/Scene1\/Core\/HeroScene/g, './HeroScene');
    content = content.replace(/\.\/Scene2\/Core\/MachineRoom/g, './EngineRoomScene');
    // Also change <MachineRoom /> to <EngineRoomScene />
    content = content.replace(/<MachineRoom \/>/g, '<EngineRoomScene />');
    content = content.replace(/const MachineRoom = /g, 'const EngineRoomScene = ');
  }
  
  if (file.includes('page.tsx')) {
    content = content.replace(/@\/components\/Scene1\/Core\/MechanicalCursor/g, '@/components/cursor/MechanicalCursor');
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
