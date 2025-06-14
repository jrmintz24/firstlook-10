
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
    <div className="mb-8 md:mb-12">
      <h3 className="text-xl md:text-2xl font-light text-gray-900 mb-6 md:mb-8 text-center">FirstLook vs. Traditional Agent</h3>
      <div className="overflow-hidden rounded-xl md:rounded-2xl border border-gray-200 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="p-3 md:p-6 text-left font-medium text-gray-900 border-r border-gray-200 text-sm md:text-base">Comparison</th>
                <th className="p-3 md:p-6 text-left font-medium text-purple-900 bg-gradient-to-r from-purple-50 to-indigo-50 border-r border-gray-200 text-sm md:text-base">FirstLook Approach</th>
                <th className="p-3 md:p-6 text-left font-medium text-gray-700 text-sm md:text-base">Traditional Agent</th>
              </tr>
            </thead>
            <tbody>
              {comparison.aspects.map((aspect, aspectIndex) => (
                <tr key={aspectIndex} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 md:p-6 font-medium text-gray-900 border-r border-gray-200 bg-gray-50/30 text-sm md:text-base">
                    {aspect.category}
                  </td>
                  <td className="p-3 md:p-6 text-gray-700 border-r border-gray-200 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 text-sm md:text-base">
                    {aspect.firstlook}
                  </td>
                  <td className="p-3 md:p-6 text-gray-700 text-sm md:text-base">
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
