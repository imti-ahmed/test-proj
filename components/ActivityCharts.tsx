import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CapacitiesStats } from '../utils/capacitiesApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ActivityChartsProps {
  stats: CapacitiesStats;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function ActivityCharts({ stats }: ActivityChartsProps) {
  // Prepare heatmap data (simplified grid view)
  const heatmapData = stats.dailyActivity.slice(-35); // Last 35 days for 5x7 grid
  
  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count <= 2) return 'bg-green-200';
    if (count <= 4) return 'bg-green-300';
    if (count <= 6) return 'bg-green-400';
    return 'bg-green-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Activity Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Weekly Note Creation Trend
            <Badge variant="secondary">Last 7 days</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => `Date: ${formatDate(value)}`}
                formatter={(value) => [`${value} notes`, 'Created']}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#0088FE" 
                strokeWidth={3}
                dot={{ fill: '#0088FE', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Activity Heatmap
            <Badge variant="secondary">Last 35 days</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.map((day, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-sm ${getHeatmapColor(day.count)}`}
                  title={`${formatDate(day.date)}: ${day.count} notes`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted" />
                <div className="w-3 h-3 rounded-sm bg-green-200" />
                <div className="w-3 h-3 rounded-sm bg-green-300" />
                <div className="w-3 h-3 rounded-sm bg-green-400" />
                <div className="w-3 h-3 rounded-sm bg-green-500" />
              </div>
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏷️ Most Used Tags
            <Badge variant="secondary">{stats.topTags.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.topTags} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80}
                fontSize={12}
              />
              <Tooltip formatter={(value) => [`${value} uses`, 'Count']} />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Object Types Breakdown */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧠 Object Type Breakdown
            <Badge variant="secondary">{stats.objectTypes.length} types</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.objectTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.objectTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {stats.objectTypes.map((type, index) => (
                <div key={type.type} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{type.type}</span>
                  </div>
                  <Badge variant="outline">{type.count.toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}