import React from "react";

const SuperUser: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Super User Dashboard</h1>
      <p>This is the Super User area with administrative controls.</p>
      <div className="bg-gray-100 p-4 mt-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Administrative Tools</h2>
        <ul className="list-disc pl-5">
          <li>User Management</li>
          <li>System Configuration</li>
          <li>Access Control</li>
          <li>Audit Logs</li>
        </ul>
      </div>
    </div>
  );
};

export default SuperUser;
