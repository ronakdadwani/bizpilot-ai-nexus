import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, XCircle, Loader2, File, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface UploadedFile {
  name: string;
  size: number;
  status: "uploading" | "success" | "error";
  progress: number;
}

const UploadData = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (selectedFiles: File[]) => {
    for (const file of selectedFiles) {
      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        status: "uploading",
        progress: 0,
      };
      
      setFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => 
          prev.map(f => 
            f.name === file.name ? { ...f, progress } : f
          )
        );
      }

      // Mark as complete
      setFiles(prev => 
        prev.map(f => 
          f.name === file.name ? { ...f, status: "success", progress: 100 } : f
        )
      );
      
      toast.success(`${file.name} uploaded successfully`);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />

      <main className="pl-64 pt-16">
        <div className="p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Sales Data</h1>
            <p className="text-muted-foreground">
              Import your sales data to power AI analytics and forecasts
            </p>
          </div>

          {/* Upload Area */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Supported formats: CSV, Excel (.xlsx, .xls)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  isDragging 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">
                  Drag and drop your files here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse from your computer
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  multiple
                  onChange={handleFileSelect}
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Uploaded Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {files.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      {file.status === "uploading" && (
                        <Progress value={file.progress} className="mt-2 h-1" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === "uploading" && (
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      )}
                      {file.status === "success" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {file.status === "error" && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFile(file.name)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadData;
