import React from "react";

const FilePreview = ({ file, filePreview }) => {
  if (!file || !filePreview) return null;

  const fileType = file.type.split("/")[0];

  return (
    <div className="flex flex-col border border-gray-300 bg-white rounded-lg p-2 shadow-sm relative h-full">
      <div className="w-full mb-2">
        <a
          href={filePreview}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline block truncate"
        >
          {file.name}
        </a>
      </div>

      <div className="flex-grow overflow-auto">
        {fileType === "image" ? (
          <img
            src={filePreview}
            alt="Vista previa"
            className="w-full h-auto max-h-64 object-contain rounded"
          />
        ) : file.type === "application/pdf" ? (
          <iframe
            src={filePreview}
            title="Vista previa de PDF"
            className="w-full h-full rounded"
            style={{ border: "none", minHeight: "200px" }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default FilePreview;