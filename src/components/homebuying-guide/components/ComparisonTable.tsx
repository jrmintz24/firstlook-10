
interface ComparisonTableProps {
  comparison: {
    aspects: Array<{
      category: string;
      firstlook: string;
      traditional: string;
    }>;
  };
}

export const ComparisonTable = ({ comparison }: ComparisonTableProps) => {
  return (
    <div className="mb-12 md:mb-16">
      <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-8 md:mb-10 text-center tracking-wide">FirstLook vs. Traditional Agent</h3>
      <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-gray-200 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="p-5 md:p-8 text-left font-semibold text-gray-900 border-r border-gray-200 text-base md:text-lg tracking-wide">Comparison</th>
                <th className="p-5 md:p-8 text-left font-semibold text-purple-900 bg-gradient-to-r from-purple-50 to-indigo-50 border-r border-gray-200 text-base md:text-lg tracking-wide">FirstLook Approach</th>
                <th className="p-5 md:p-8 text-left font-semibold text-gray-700 text-base md:text-lg tracking-wide">Traditional Agent</th>
              </tr>
            </thead>
            <tbody>
              {comparison.aspects.map((aspect, aspectIndex) => (
                <tr key={aspectIndex} className="border-b border-gray-200 hover:bg-gray-50/80 transition-all duration-200 group">
                  <td className="p-5 md:p-8 font-semibold text-gray-900 border-r border-gray-200 bg-gray-50/50 text-sm md:text-base leading-relaxed">
                    {aspect.category}
                  </td>
                  <td className="p-5 md:p-8 text-gray-700 border-r border-gray-200 bg-gradient-to-r from-purple-50/70 to-indigo-50/70 text-sm md:text-base leading-relaxed group-hover:from-purple-50 group-hover:to-indigo-50 transition-all duration-200">
                    {aspect.firstlook}
                  </td>
                  <td className="p-5 md:p-8 text-gray-700 text-sm md:text-base leading-relaxed">
                    {aspect.traditional}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
