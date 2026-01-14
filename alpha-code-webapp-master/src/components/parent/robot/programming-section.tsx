import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProgrammingSectionProps {
  title: string;
  items: {
    createActions: string;
    workspace: string;
    myWorks: string;
  };
}

export function ProgrammingSection({ title, items }: ProgrammingSectionProps) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 text-center cursor-pointer bg-white text-blue-900 shadow-lg hover:scale-105 transition-transform border border-gray-200">
          <CardHeader className="flex items-center justify-center">
            <div className="text-4xl">✍️</div>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-lg">{items.createActions}</p>
          </CardContent>
        </Card>
        
        <Card className="p-8 text-center cursor-pointer bg-gray-100 text-blue-900 shadow-lg hover:scale-105 transition-transform border border-gray-200">
          <CardHeader className="flex items-center justify-center">
            <div className="text-4xl">📂</div>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-lg">{items.workspace}</p>
          </CardContent>
        </Card>
        
        <Card className="p-8 text-center cursor-pointer bg-blue-100 text-blue-900 shadow-lg hover:scale-105 transition-transform border border-gray-200">
          <CardHeader className="flex items-center justify-center">
            <div className="text-4xl">🎨</div>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-lg">{items.myWorks}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}