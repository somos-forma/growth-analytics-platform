import { FileSpreadsheetIcon, Upload, X } from "lucide-react";
import type React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

interface CsvUploaderProps {
  value: File | undefined;
  onChange: (file: File | undefined) => void;
  error?: boolean;
}
export const CsvUploader = ({ value, onChange }: CsvUploaderProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 10485760, // 10MB
    accept: {
      "text/csv": [".csv"],
    },
    onDrop: (acceptedFiles) => {
      onChange(acceptedFiles[0]);
    },
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className="space-y-5">
      <div
        className=" border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary/70 transition-colors"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-500">
          Arrastra y suelta tu archivo CSV aquí, o haz clic para seleccionar archivos
        </p>
      </div>
      <div>
        {value && (
          <div className="bg-card p-4 rounded-md flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileSpreadsheetIcon className=" h-8 w-8 " />
              <div className="flex flex-col ">
                <p>{value.name}</p>
                <div className="text-sm text-gray-500">{Math.round(value.size / 1024)} KB</div>
              </div>
            </div>
            <Button onClick={removeFile} variant="ghost">
              <X />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
