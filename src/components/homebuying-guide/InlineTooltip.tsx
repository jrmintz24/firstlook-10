
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface InlineTooltipProps {
  children: ReactNode;
  content: string;
}

export const InlineTooltip = ({ children, content }: InlineTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="relative inline-flex items-center gap-1 border-b border-dotted border-gray-400 cursor-help">
            {children}
            <HelpCircle className="w-3 h-3 text-gray-400" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-gray-900 text-white p-3 rounded-lg">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
