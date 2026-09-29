const fs = require('fs');
let file = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');

// Replace the hardcoded white background and text styling
file = file.replace(
  'className="min-h-screen bg-white relative">',
  'className="min-h-screen bg-background text-foreground relative">'
);

// Fix notification cards to match obsidian/gold theme
file = file.replace(
  /className="pointer-events-auto bg-white rounded-lg shadow-xl p-2\.5 border-l-4 border-blue-500/g,
  'className="pointer-events-auto bg-card text-card-foreground rounded-lg shadow-xl p-2.5 border-l-4 border-gold'
);

file = file.replace(
  /className="text-\[11px\] leading-tight text-gray-700"/g,
  'className="text-[11px] leading-tight text-muted-foreground"'
);

file = file.replace(
  /className="font-bold text-gray-900"/g,
  'className="font-bold text-foreground"'
);

file = file.replace(
  /className="text-sm font-bold text-gray-900 mt-0\.5"/g,
  'className="text-sm font-bold text-foreground mt-0.5"'
);

fs.writeFileSync('src/pages/LandingPage.tsx', file);
console.log('Landing page fixed!');
