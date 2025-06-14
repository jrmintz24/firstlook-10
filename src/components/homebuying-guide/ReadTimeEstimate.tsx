
import { Clock } from "lucide-react";

interface ReadTimeEstimateProps {
  content: string[];
  wordsPerMinute?: number;
}

export const ReadTimeEstimate = ({ content, wordsPerMinute = 200 }: ReadTimeEstimateProps) => {
  const totalWords = content.join(' ').split(/\s+/).length;
  const readTime = Math.ceil(totalWords / wordsPerMinute);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <Clock className="w-4 h-4" />
      <span>{readTime} min read</span>
    </div>
  );
};
