export const menuStyles = {
    continue: `
    w-full bg-transparent text-cyan-300 py-3 px-6 rounded-lg relative text-xl tracking-widest uppercase
    transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-cyan-400
    shadow-[0px_0px_10px_#00ffff] hover:shadow-[0px_0px_20px_#00ffff] 
    before:absolute before:inset-0 before:bg-cyan-500 before:blur-md before:opacity-20 
    backdrop-blur-md
  `,
    start: `
    w-full bg-transparent text-green-400 py-3 px-6 rounded-lg relative text-xl tracking-widest uppercase
    transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-green-400
    shadow-[0px_0px_10px_#00ff00] hover:shadow-[0px_0px_20px_#00ff00] 
    before:absolute before:inset-0 before:bg-green-500 before:blur-md before:opacity-20 
    backdrop-blur-md
  `,
    settings: `
    w-full bg-transparent text-gray-400 py-3 px-6 rounded-lg relative text-xl tracking-widest uppercase
    transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-gray-400
    shadow-[0px_0px_10px_#9ca3af] hover:shadow-[0px_0px_20px_#9ca3af] 
    before:absolute before:inset-0 before:bg-gray-600 before:blur-md before:opacity-20 
    backdrop-blur-md
  ` ,
    logout: `
    w-full bg-transparent text-red-400 py-3 px-6 rounded-lg relative text-xl tracking-widest uppercase
    transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-red-400
    shadow-[0px_0px_10px_#ff0000] hover:shadow-[0px_0px_20px_#ff0000] 
    before:absolute before:inset-0 before:bg-red-600 before:blur-md before:opacity-20 
    backdrop-blur-md
  ` ,
  menuContainer: `grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]
  ` ,
  menuMain: `flex flex-col gap-8 row-start-2 items-center sm:items-start
  ` ,
  menuHeader: `text-2xl font-semibold text-center sm:text-left
  ` ,
  menuButtonContainer: `flex flex-col gap-4 w-full max-w-xs
  ` ,    
  };
  