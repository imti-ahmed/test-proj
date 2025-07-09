import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { CapacitiesStats } from '../utils/capacitiesApi';
import { Database, Users, Clock } from 'lucide-react';

interface SpaceInfoCardProps {
  stats: CapacitiesStats;
  lastSync?: Date;
}

export function SpaceInfoCard({ stats, lastSync }: SpaceInfoCardProps) {
  const formatLastSync = (date?: Date) => {
    if (!date) return 'Just now';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getTotalObjects = () => {
    return stats.objectTypes.reduce((sum, type) => sum + type.count, 0);
  };

  return (
    <Card className="bg-muted/50 border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Database className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Personal Knowledge Space</span>
                <Badge variant="secondary" className="text-xs">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {stats.objectTypes.length} object types
                </div>
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  {getTotalObjects().toLocaleString()} total items
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Synced {formatLastSync(lastSync)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {stats.objectTypes.slice(0, 4).map((type) => (
              <Badge key={type.type} variant="outline" className="text-xs">
                {type.type}: {type.count}
              </Badge>
            ))}
            {stats.objectTypes.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{stats.objectTypes.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}