export const endTurnStyles = {
  container: "absolute bottom-4 right-4 z-20",
  button: `
    neon-circle w-24 h-24 flex flex-col items-center justify-center
    rounded-full bg-[rgba(10,10,30,0.85)] text-cyan-200 font-mono uppercase
    hover:text-white transition
  `,
  turnText: "text-[0.6rem] font-bold leading-none",
  // The neon-circle class is handled by a <style jsx> block in the component
};
