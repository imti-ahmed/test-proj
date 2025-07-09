import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CapacitiesStats } from '../utils/capacitiesApi';
import { FileText, Link, AlertTriangle, Edit } from 'lucide-react';

interface ContentInsightsProps {
  stats: CapacitiesStats;
}

export function ContentInsights({ stats }: ContentInsightsProps) {
  const maxWordCount = Math.max(...stats.longestNotes.map(note => note.wordCount));
  const maxLinkCount = Math.max(...stats.mostLinkedNotes.map(note => note.linkCount));
  const maxEditCount = Math.max(...stats.mostEditedNotes.map(note => note.editCount));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Longest Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📚 Longest Notes
            <Badge variant="secondary">By word count</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.longestNotes.map((note, index) => (
              <div key={note.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-sm">{note.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {note.wordCount.toLocaleString()} words
                  </span>
                </div>
                <Progress 
                  value={(note.wordCount / maxWordCount) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Linked Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔗 Most Linked Notes
            <Badge variant="secondary">Connection hubs</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.mostLinkedNotes.map((note, index) => (
              <div key={note.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-sm">{note.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Link className="w-3 h-3" />
                    {note.linkCount}
                  </div>
                </div>
                <Progress 
                  value={(note.linkCount / maxLinkCount) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orphaned Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🕳️ Orphaned Notes
            <Badge variant="destructive">{stats.orphanedNotes.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                These notes have no links to other content
              </span>
            </div>
            {stats.orphanedNotes.map((note) => (
              <div key={note.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-sm">{note.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Edited Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔁 Most Edited Notes
            <Badge variant="secondary">Living documents</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.mostEditedNotes.map((note, index) => (
              <div key={note.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-sm">{note.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Edit className="w-3 h-3" />
                    {note.editCount}
                  </div>
                </div>
                <Progress 
                  value={(note.editCount / maxEditCount) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PKM Health Score */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧠 Knowledge System Health
            <Badge variant="secondary">PKM Score</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round((stats.totalNotes / 15))}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Content Volume</div>
              <Progress value={Math.min((stats.totalNotes / 2000) * 100, 100)} className="h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round((stats.mostLinkedNotes[0]?.linkCount || 0) / 0.5)}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Connectivity</div>
              <Progress value={Math.min(((stats.mostLinkedNotes[0]?.linkCount || 0) / 50) * 100, 100)} className="h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.max(100 - (stats.orphanedNotes.length / stats.totalNotes * 100 * 10), 10)}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Organization</div>
              <Progress value={Math.max(100 - (stats.orphanedNotes.length / stats.totalNotes * 100 * 10), 10)} className="h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {Math.round(stats.createdThisWeek * 12)}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Activity</div>
              <Progress value={Math.min((stats.createdThisWeek / 10) * 100, 100)} className="h-2" />
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold">
                {Math.round((
                  Math.round((stats.totalNotes / 15)) +
                  Math.round((stats.mostLinkedNotes[0]?.linkCount || 0) / 0.5) +
                  Math.max(100 - (stats.orphanedNotes.length / stats.totalNotes * 100 * 10), 10) +
                  Math.round(stats.createdThisWeek * 12)
                ) / 4)}
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <p className="text-sm text-muted-foreground">Overall PKM Health Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}