
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          onFileSelect(file);
          toast({
            title: "File uploaded successfully",
            description: `${file.name} has been uploaded and is ready for analysis.`,
          });
        }
      }, 100);
    }
  }, [onFileSelect, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav'],
      'video/*': ['.mp4']
    },
    maxSize: 30 * 1024 * 1024, // 30MB
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`glass-card p-8 rounded-lg text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-primary border-2' : ''
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">
          {isDragActive ? 'Drop your file here' : 'Drag & drop your sales call recording'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Supports MP3, WAV, and MP4 files (max 30MB)
        </p>
        <Button variant="outline" className="mt-2">
          Browse Files
        </Button>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
