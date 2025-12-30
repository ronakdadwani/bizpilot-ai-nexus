import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Jan", revenue: 186000, expenses: 120000 },
  { month: "Feb", revenue: 205000, expenses: 135000 },
  { month: "Mar", revenue: 237000, expenses: 142000 },
  { month: "Apr", revenue: 273000, expenses: 158000 },
  { month: "May", revenue: 209000, expenses: 131000 },
  { month: "Jun", revenue: 314000, expenses: 175000 },
  { month: "Jul", revenue: 298000, expenses: 168000 },
  { month: "Aug", revenue: 345000, expenses: 192000 },
  { month: "Sep", revenue: 378000, expenses: 201000 },
  { month: "Oct", revenue: 412000, expenses: 215000 },
  { month: "Nov", revenue: 389000, expenses: 198000 },
  { month: "Dec", revenue: 456000, expenses: 234000 },
];

const RevenueChart = () => {
  return (
    <div className="glass-card p-6 h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue vs Expenses</h3>
          <p className="text-sm text-muted-foreground">Monthly comparison for 2024</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-xs text-muted-foreground">Expenses</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 24px hsl(0 0% 0% / 0.2)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="hsl(var(--accent))"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "hsl(var(--accent))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
