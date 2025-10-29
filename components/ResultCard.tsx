import React from 'react';
import { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

const SeverityBadge: React.FC<{ severity: AnalysisResult['severity'] }> = ({ severity }) => {
  const severityClasses = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-orange-100 text-orange-800',
    Unknown: 'bg-slate-100 text-slate-800',
  };

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${severityClasses[severity]}`}>
      Severity: {severity}
    </span>
  );
};

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-teal-800">{result.conditionName}</h2>
        <SeverityBadge severity={result.severity} />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-teal-700 mb-2 border-b pb-2">Description</h3>
          <p className="text-gray-600">{result.description}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-teal-700 mb-2 border-b pb-2">Suggested Home Remedies</h3>
          {result.homeRemedies.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {result.homeRemedies.map((remedy, index) => (
                <li key={index}>{remedy}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No specific home remedies suggested.</p>
          )}
        </div>

        <div>
           <h3 className="text-lg font-semibold text-orange-600 mb-2 border-b pb-2">Advice</h3>
           <p className="text-gray-600 bg-orange-50 p-4 rounded-md border border-orange-200">{result.advice}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;