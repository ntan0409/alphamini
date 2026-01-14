import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PlayCircle, Camera, UserCheck } from "lucide-react";

interface EntertainmentSectionProps {
  title: string;
  items: {
    action: string;
    album: string;
    friends: string;
  };
  basePath?: string; // Thêm prop để tùy chỉnh path (parent hoặc children)
}

export function EntertainmentSection({ title, items, basePath = "/parent" }: EntertainmentSectionProps) {
  const router = useRouter();

  const entertainmentItems = [
    {
      title: items.action,
      icon: PlayCircle,
      image: "/ic_home_actionsquare.webp",
      gradient: "from-rose-200 via-pink-200 to-purple-200",
      hoverGradient: "from-rose-300 via-pink-300 to-purple-300",
      shadowColor: "shadow-rose-100/40",
      onClick: () => router.push(`${basePath}/robot/action`),
      description: "Điều khiển và ra lệnh cho robot của bạn."
    },
    {
      title: items.album,
      icon: Camera,
      image: "/ic_home_album.webp",
      gradient: "from-orange-200 via-amber-200 to-yellow-200",
      hoverGradient: "from-orange-300 via-amber-300 to-yellow-300",
      shadowColor: "shadow-orange-100/40",
      onClick: () => router.push(`${basePath}/robot/action`),
      description: "Xem ảnh do robot chụp."
    },
    {
      title: items.friends,
      icon: UserCheck,
      image: "/ic_home_friend.webp",
      gradient: "from-emerald-200 via-green-200 to-teal-200",
      hoverGradient: "from-emerald-300 via-green-300 to-teal-300",
      shadowColor: "shadow-emerald-100/40",
      onClick: () => router.push(`${basePath}/robot/action`),
      description: "Quản lý cơ sở dữ liệu khuôn mặt đã nhận dạng."
    }
  ];

  return (
    <section className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent mb-3">
          {title}
        </h2>
        <p className="text-gray-500 text-base font-medium">Khám phá những tính năng giải trí tương tác.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entertainmentItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card 
              key={index}
              className={`
                relative overflow-hidden cursor-pointer border-0 h-60
                bg-gradient-to-br ${item.gradient}
                hover:bg-gradient-to-br hover:${item.hoverGradient}
                shadow-lg hover:shadow-xl ${item.shadowColor}
                transform hover:scale-102 hover:-translate-y-1
                transition-all duration-300 ease-out
                group
              `}
              suppressHydrationWarning
              onClick={item.onClick}
            >
              {/* Animated background overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Floating particles effect */}
              <div className="absolute top-3 right-3 opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                <IconComponent className="h-5 w-5 text-gray-600/60 animate-pulse" />
              </div>
              
              <CardHeader className="flex items-center justify-center relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/15 rounded-full blur-lg scale-110 group-hover:scale-120 transition-transform duration-300" />
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={80}
                      className="object-contain filter brightness-105 group-hover:brightness-115 transition-all duration-300 drop-shadow-md"
                    />
                </div>
              </CardHeader>
              
              <CardContent className="text-center pb-6 px-4 relative z-10">
                <h3 className="font-semibold text-base text-gray-700 mb-1 group-hover:scale-105 transition-transform duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm font-medium leading-relaxed mb-2">
                  {item.description}
                </p>
                
                {/* Redesigned Action Button */}
                <div className="flex items-center justify-center">
                  <div className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:scale-105">
                    <PlayCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600 text-sm font-medium">Khám phá</span>
                  </div>
                </div>
              </CardContent>
              
              {/* Bottom gradient accent */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-400/20 via-gray-500/40 to-gray-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Card>
          );
        })}
      </div>
      
      {/* Decorative elements */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-1.5">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-slate-300 to-slate-400 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
