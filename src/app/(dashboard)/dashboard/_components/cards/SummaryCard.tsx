import React from "react";
type Paragraph = { title: string; data: string };
import "../../../../../styles/css/markdown.css";

import { Card } from "@/components/ui/card";
import { marked } from "marked";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

type Props = { summaryData: string };
export default function SummaryCard({ summaryData }: Props) {
  const [htmlContent, setHtmlContent] = React.useState("");

  useIsomorphicLayoutEffect(() => {
    const fetchData = async () => {
      const content = await marked(summaryData);
      setHtmlContent(content);
    };

    fetchData();
  }, [summaryData]); // Only re-run when summaryData changes

  return (
    <Card className="w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] rounded-t-3xl px-4 overflow-y-scroll pb-5">
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="prose prose-lg markdown-content"
      />
    </Card>
  );
}
