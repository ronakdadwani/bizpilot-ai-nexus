import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TrendType = "up" | "down" | "stable";
type FilterType = "all" | "seasonality" | "profit";

interface Product {
  id: number;
  name: string;
  category: string;
  soldUnits: number;
  margin: number;
  trend: TrendType;
  seasonal: boolean;
}

const products: Product[] = [
  { id: 1, name: "Premium Wireless Headphones", category: "Electronics", soldUnits: 12847, margin: 42, trend: "up", seasonal: false },
  { id: 2, name: "Winter Thermal Jacket", category: "Apparel", soldUnits: 8934, margin: 58, trend: "up", seasonal: true },
  { id: 3, name: "Organic Coffee Beans", category: "Food & Beverage", soldUnits: 23456, margin: 35, trend: "stable", seasonal: false },
  { id: 4, name: "Smart Fitness Watch", category: "Electronics", soldUnits: 6721, margin: 48, trend: "up", seasonal: false },
  { id: 5, name: "Beach Umbrella Set", category: "Outdoor", soldUnits: 3245, margin: 62, trend: "down", seasonal: true },
  { id: 6, name: "Yoga Mat Pro", category: "Fitness", soldUnits: 15632, margin: 55, trend: "up", seasonal: false },
  { id: 7, name: "Christmas Decoration Set", category: "Home", soldUnits: 4521, margin: 71, trend: "down", seasonal: true },
  { id: 8, name: "Bluetooth Speaker", category: "Electronics", soldUnits: 9876, margin: 38, trend: "stable", seasonal: false },
];

const TrendIcon = ({ trend }: { trend: TrendType }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-400" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const TopProductsTable = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredProducts = products
    .filter((product) => {
      if (filter === "seasonality") return product.seasonal;
      return true;
    })
    .sort((a, b) => {
      if (filter === "profit") return b.margin - a.margin;
      return b.soldUnits - a.soldUnits;
    });

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Products</h3>
          <p className="text-sm text-muted-foreground">Performance by category</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {filter !== "all" && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                  {filter === "seasonality" ? "Seasonal" : "By Profit"}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setFilter("all")}>
              All Products
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("seasonality")}>
              Seasonal Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("profit")}>
              Sort by Profit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Product Name</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground text-right">Sold Units</TableHead>
              <TableHead className="text-muted-foreground text-right">Margin %</TableHead>
              <TableHead className="text-muted-foreground text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow 
                key={product.id} 
                className="border-border/30 hover:bg-secondary/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {product.name}
                  {product.seasonal && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-accent/20 text-accent rounded">
                      Seasonal
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{product.category}</TableCell>
                <TableCell className="text-right text-foreground">
                  {product.soldUnits.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-medium ${product.margin >= 50 ? "text-green-400" : "text-foreground"}`}>
                    {product.margin}%
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <TrendIcon trend={product.trend} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TopProductsTable;
