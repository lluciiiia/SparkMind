import { Card } from "@/components/ui/card";
import React from "react";

type Props = {
  furtherInfo: {
    link: string;
    title: string;
    snippet: string;
    thumbnail: { src: string; width: string; height: string };
  }[];
};

export default function FurtherInfoCard({ furtherInfo }: Props) {
  return (
    <Card className="w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] rounded-t-3xl px-4 overflow-y-scroll pb-5 gap-5 grid">
      {furtherInfo.map((info) => (
        <div
          key={info.link}
          className="flex space-x-4 p-4 border rounded-lg shadow-sm">
          {info.thumbnail && (
            <img
              src={info.thumbnail.src}
              alt={info.title}
              width={info.thumbnail.width}
              height={info.thumbnail.height}
              className="object-cover rounded"
            />
          )}
          <div>
            <a
              href={info.link}
              className="text-blue-600 hover:underline font-semibold text-lg">
              {info.title}
            </a>
            <p className="text-gray-700 mt-2">{info.snippet}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}
