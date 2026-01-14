export function BackgroundDecorations() {
  return (
    <>
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-purple-200 rounded-lg rotate-12 opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-40 w-12 h-12 border-2 border-pink-200 rounded-md rotate-45 opacity-45 animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-10 h-10 border-2 border-violet-200 rounded-sm -rotate-30 opacity-55 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-20 right-20 w-14 h-14 border-2 border-fuchsia-200 rounded-lg rotate-15 opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
    </>
  )
}