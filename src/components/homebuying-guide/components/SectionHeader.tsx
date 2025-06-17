
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
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 md:p-12 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-48 h-48 md:w-80 md:h-80 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-blue-500/25">
            <Icon className="w-8 h-8 md:w-12 md:h-12 text-white drop-shadow-lg" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30">
                <span className="text-sm md:text-base font-semibold text-blue-200 tracking-wide">Step {index + 1}</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-white drop-shadow-sm">{title}</h2>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl">
          <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-light mb-4">
            {overview}
          </p>
          <ReadTimeEstimate content={content} />
        </div>
      </div>
    </div>
  );
};
