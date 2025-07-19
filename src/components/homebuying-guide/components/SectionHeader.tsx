
import { ReadTimeEstimate } from "../ReadTimeEstimate";

interface SectionHeaderProps {
  title: string;
  icon: any;
  index: number;
  overview: string;
  content: string[];
}

export const SectionHeader = ({ title, icon: Icon, index, overview, content }: SectionHeaderProps) => {
  return (
    <div className="bg-gray-900 text-white p-8 md:p-12 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="px-3 py-1 bg-white/10 rounded-full">
                <span className="text-sm font-medium text-white/80">Step {index + 1}</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight leading-tight text-white">{title}</h2>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
          <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light mb-4">
            {overview}
          </p>
          <ReadTimeEstimate content={content} />
        </div>
      </div>
    </div>
  );
};
