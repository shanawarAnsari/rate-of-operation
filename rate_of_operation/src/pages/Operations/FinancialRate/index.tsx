import React from "react";

const FinancialRate: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Rate</h1>
      <p>Track and analyze financial performance metrics.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Current Rates</h2>
          <div className="flex justify-between mb-1">
            <span>Q1 2023</span>
            <span className="font-medium">4.2%</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Q2 2023</span>
            <span className="font-medium">3.8%</span>
          </div>
          <div className="flex justify-between">
            <span>Q3 2023</span>
            <span className="font-medium">4.5%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Rate Comparison</h2>
          <p>Financial rate comparison data will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialRate;
