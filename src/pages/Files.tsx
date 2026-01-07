import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Trash2, Eye, FolderOpen, Search, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, FileItem } from "@/lib/api";
import { toast } from "sonner";

const Files = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      const result = await api.getFiles();
      if (result.data) {
        setFiles(result.data);
      } else if (result.error) {
        toast.error("Failed to load files: " + result.error);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchFiles();
    }
  }, [user]);

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

  const formatFileSize = (size: string | number) => {
    if (typeof size === "string") return size;
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />

      <main className="pl-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Files</h1>
              <p className="text-muted-foreground">
                Manage your uploaded data files
              </p>
            </div>
            <Button onClick={() => navigate("/upload-data")}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Upload New File
            </Button>
          </div>

          {/* Search */}
          <Card className="glass-card mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Files Table */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Your Files</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredFiles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-primary" />
                            {file.name}
                          </div>
                        </TableCell>
                        <TableCell>{file.type}</TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell>{file.uploadedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No files found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Files;