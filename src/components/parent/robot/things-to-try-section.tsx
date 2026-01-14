import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ThingsToTrySectionProps {
  title: string;
  refreshText: string;
  prompts: string[];
  onRefresh: () => void;
}

export function ThingsToTrySection({ title, refreshText, prompts, onRefresh }: ThingsToTrySectionProps) {
  const getRowItems = (start: number, count: number) => {
    if (!prompts || prompts.length === 0) {
      return Array.from({ length: count }, () => "");
    }
    const items: string[] = [];
    for (let i = 0; i < count; i++) {
      items.push(prompts[(start + i) % prompts.length]);
    }
    return items;
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-blue-800">{title}</h2>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-800" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {refreshText}
        </Button>
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-row {
          display: flex;
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: 30s;
          animation-direction: normal;
          will-change: transform;
        }
        .marquee-row:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="overflow-hidden w-full flex flex-col gap-4">
        {[
          { start: 0, count: 12, duration: "30s", direction: "normal" },
          { start: 6, count: 14, duration: "35s", direction: "reverse" },
          { start: 3, count: 13, duration: "32s", direction: "normal" },
        ].map((row, rowIndex) => {
          const items = getRowItems(row.start, row.count);
          return (
            <div
              key={rowIndex}
              className="marquee-row"
              style={{
                animationDuration: row.duration,
                animationDirection: row.direction,
              }}
            >
              {[...items, ...items].map((prompt, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 p-5 bg-white rounded-xl shadow border border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer text-blue-900 font-medium text-base min-w-[260px] mx-2"
                >
                  {prompt}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}