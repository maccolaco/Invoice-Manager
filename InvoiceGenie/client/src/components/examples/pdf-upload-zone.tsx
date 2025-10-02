import { PDFUploadZone } from "../pdf-upload-zone";

export default function PDFUploadZoneExample() {
  return (
    <div className="p-8">
      <PDFUploadZone 
        onFileSelect={(file) => console.log("File selected:", file.name)} 
      />
    </div>
  );
}
