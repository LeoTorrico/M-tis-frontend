import React from "react";

export default function ContentCard({ header, content, className = "" }) {
  return (
    <div className={`bg-semi-blue text-white p-4 rounded-lg m-4 ${className}`}>
      <h1 className="text-3xl font-bold">{header}</h1>
      <p className="text-xl">{content}</p>
    </div>
  );
}
