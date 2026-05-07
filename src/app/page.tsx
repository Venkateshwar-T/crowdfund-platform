export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="relative group">
        {/* Subtle glow effect behind the text */}
        <div className="absolute -inset-8 bg-primary/10 blur-3xl rounded-full opacity-50 transition-opacity group-hover:opacity-75" />
        
        <h1 className="relative font-headline text-6xl md:text-8xl font-bold tracking-tight text-primary select-none animate-in fade-in zoom-in duration-1000 ease-out">
          Hello World
        </h1>
        
        {/* Serene accent line */}
        <div className="mt-6 flex justify-center">
          <div className="h-1.5 w-16 rounded-full bg-secondary/60 animate-in slide-in-from-bottom-4 duration-1000 delay-300" />
        </div>
      </div>
    </main>
  );
}
