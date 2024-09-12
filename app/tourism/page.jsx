"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const RouteTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch the Excel file from the public folder
    fetch("/routes.xlsx")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Use header: 1 to get an array of arrays
        console.log(jsonData); // Log the data to verify structure

        // Assuming the first row is the header row
        const [headers, ...rows] = jsonData;
        const formattedData = rows.map(row => {
          return {
            From: row[0] || "",
            To: row[1] || "",
            Route: row[2] || ""
          };
        });
        setData(formattedData);
      })
      .catch((error) => console.error("Error loading Excel file:", error));
  }, []);

  const createGoogleMapsUrl = (from, to) => {
    const baseUrl = "https://www.google.com/maps/dir/";
    const encodedFrom = encodeURIComponent(from);
    const encodedTo = encodeURIComponent(to);
    return `${baseUrl}${encodedFrom}/${encodedTo}`;
  };

  const handleViewMap = (from, to) => {
    const url = createGoogleMapsUrl(from, to);
    window.open(url, "_blank"); // Open in a new tab
  };

  return (
    <div className="container mx-auto p-4 mt-32">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-4 border-b border-r border-gray-200 text-left">From (Departure)</th>
              <th className="py-3 px-4 border-b border-r border-gray-200 text-left">To (Destination)</th>
              <th className="py-3 px-4 border-b border-r border-gray-200 text-left">Route</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left">Google Maps Route</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-r border-gray-200">{item.From || "N/A"}</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{item.To || "N/A"}</td>
                <td className="py-2 px-4 border-b border-r border-gray-200">{item.Route || "N/A"}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.From && item.To ? (
                    <button
                      onClick={() => handleViewMap(item.From, item.To)}
                      className="text-blue-600 hover:underline"
                    >
                      View Map
                    </button>
                  ) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default RouteTable;