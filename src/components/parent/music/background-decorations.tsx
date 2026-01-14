"use client"

export default function BackgroundDecorations() {
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
      ></div>
      
      {/* Decorative Grid Squares - Music Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Left Squares */}
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-purple-200 rounded-lg rotate-12 opacity-50 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-12 h-12 border-2 border-pink-200 rounded-md rotate-45 opacity-45 animate-bounce"></div>
        <div className="absolute top-60 left-10 w-8 h-8 border-2 border-violet-200 rounded-sm -rotate-12 opacity-55 animate-spin" style={{animationDuration: '8s'}}></div>
        
        {/* Top Right Squares */}
        <div className="absolute top-32 right-24 w-20 h-20 border-2 border-fuchsia-200 rounded-xl -rotate-6 opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-16 right-48 w-14 h-14 border-2 border-rose-200 rounded-lg rotate-30 opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-72 right-16 w-10 h-10 border-2 border-indigo-200 rounded-md -rotate-45 opacity-45 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
        
        {/* Bottom Left Squares */}
        <div className="absolute bottom-40 left-32 w-18 h-18 border-2 border-cyan-200 rounded-lg rotate-15 opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-16 w-12 h-12 border-2 border-teal-200 rounded-md -rotate-30 opacity-55 animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-60 left-60 w-8 h-8 border-2 border-emerald-200 rounded-sm rotate-60 opacity-45 animate-spin" style={{animationDuration: '10s'}}></div>
        
        {/* Bottom Right Squares */}
        <div className="absolute bottom-32 right-40 w-16 h-16 border-2 border-purple-200 rounded-lg -rotate-20 opacity-50 animate-pulse" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-16 right-20 w-14 h-14 border-2 border-pink-200 rounded-md rotate-45 opacity-45 animate-bounce" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-48 right-64 w-10 h-10 border-2 border-violet-200 rounded-sm -rotate-15 opacity-55 animate-spin" style={{animationDuration: '7s', animationDirection: 'reverse'}}></div>
        
        {/* Center Area Squares - Music themed */}
        <div className="absolute top-1/2 left-1/4 w-6 h-6 border border-purple-200 rounded-sm rotate-45 opacity-35 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 border border-pink-200 rounded-md -rotate-30 opacity-35 animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-4 h-4 border border-violet-200 rounded-sm rotate-12 opacity-40 animate-pulse" style={{animationDelay: '1.2s'}}></div>
        
        {/* Musical Note Styled Squares */}
        <div className="absolute top-1/4 left-1/3 w-10 h-10 border-2 border-fuchsia-300 rounded-full rotate-0 opacity-30 animate-bounce" style={{animationDelay: '2.8s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 border-2 border-rose-300 rounded-full rotate-0 opacity-35 animate-pulse" style={{animationDelay: '3.5s'}}></div>
      </div>
    </>
  )
}