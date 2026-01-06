import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Trash2, Eye, FolderOpen, Search } from "lucide-react";
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

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

const Files = () => {
  const { user, loading } = useCustomAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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

  // Mock data - will be replaced with API data
  const files: FileItem[] = [
    { id: "1", name: "sales_q4_2025.csv", type: "CSV", size: "2.4 MB", uploadedAt: "Jan 5, 2026" },
    { id: "2", name: "inventory_report.xlsx", type: "Excel", size: "1.8 MB", uploadedAt: "Jan 4, 2026" },
    { id: "3", name: "customer_data.csv", type: "CSV", size: "5.2 MB", uploadedAt: "Jan 3, 2026" },
    { id: "4", name: "revenue_analysis.xlsx", type: "Excel", size: "890 KB", uploadedAt: "Jan 2, 2026" },
  ];

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
              {filteredFiles.length > 0 ? (
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
                        <TableCell>{file.size}</TableCell>
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
