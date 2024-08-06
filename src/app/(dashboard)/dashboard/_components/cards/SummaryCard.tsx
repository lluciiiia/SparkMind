import React from "react";
import "../../../../../styles/css/markdown.css";
type Paragraph = { title: string; data: string };
type Props = { summaryData: any };
import { marked } from "marked";
import { Card } from "@/components/ui/card";

export default async function SummaryCard({ summaryData }: Props) {
  const htmlContent = await marked(summaryData);
  return (
    <Card className="w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] rounded-t-3xl px-4 overflow-y-scroll pb-5">
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="prose prose-lg markdown-content"
      />
    </Card>
  );
}
