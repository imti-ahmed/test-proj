import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CapacitiesStats } from '../utils/capacitiesApi';
import { FileText, Layers, Calendar, Clock } from 'lucide-react';

interface OverviewCardsProps {
  stats: CapacitiesStats;
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'yesterday';
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">📝 Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Your knowledge base
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🧩 Total Objects</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalObjects.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All content types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">📅 Created This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.createdThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              New this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🔁 Activity Score</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.createdThisWeek / 7) * 10)}
              <span className="text-sm text-muted-foreground">/10</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Daily avg this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recently Updated Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔁 Recently Updated Notes
            <Badge variant="secondary">{stats.recentlyUpdated.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentlyUpdated.map((note, index) => (
              <div key={note.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-medium">{note.title}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {formatDate(note.updatedAt)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}