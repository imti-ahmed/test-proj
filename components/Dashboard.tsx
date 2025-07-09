import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TokenInput } from './TokenInput';
import { SpaceInfoCard } from './SpaceInfoCard';
import { OverviewCards } from './OverviewCards';
import { ActivityCharts } from './ActivityCharts';
import { ContentInsights } from './ContentInsights';
import { fetchCapacitiesStats, clearToken, getTokenExpiry, CapacitiesStats } from '../utils/capacitiesApi';
import { RefreshCw, LogOut, BarChart3, TrendingUp, Brain, Key, AlertTriangle, ExternalLink, Shield, Info } from 'lucide-react';

interface DashboardProps {
  token?: string;
  onTokenSubmit: (token: string) => void;
  onTokenExpired: () => void;
}

export function Dashboard({ token, onTokenSubmit, onTokenExpired }: DashboardProps) {
  const [stats, setStats] = useState<CapacitiesStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [showCorsNotice, setShowCorsNotice] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (token) {
      loadStats();
      
      // Set up token expiry timer
      const expiry = getTokenExpiry();
      if (expiry) {
        const remaining = expiry - Date.now();
        if (remaining > 0) {
          setTimeLeft(remaining);
        }
      }
    }
  }, [token]);

  useEffect(() => {
    // Update countdown timer
    if (timeLeft && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (!prev || prev <= 1000) {
            // Token expired
            clearToken();
            onTokenExpired();
            return null;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft, onTokenExpired]);

  const loadStats = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError('');
      console.log('Loading stats...');
      const data = await fetchCapacitiesStats(token);
      setStats(data);
      setLastSync(new Date());
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error loading stats:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(errorMessage);
      
      // If token error, clear and ask for re-auth
      if (errorMessage.includes('token') || errorMessage.includes('Invalid') || errorMessage.includes('401')) {
        clearToken();
        onTokenExpired();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    onTokenExpired();
    setStats(null);
    setError('');
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadStats();
  };

  const CorsNotice = () => (
    showCorsNotice && (
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="font-medium text-blue-800">Using CORS Proxy for API Access</div>
              <div className="text-sm text-blue-700">
                Due to browser security restrictions, this app uses a CORS proxy to access the Capacities API. 
                Your API token is transmitted securely but passes through a third-party proxy service.
              </div>
              <div className="text-xs text-blue-600">
                • Multiple proxy services are tried automatically
                • API tokens are not stored by the proxy
                • JSON responses are validated for security
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCorsNotice(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  );

  const EmptyState = () => (
    <div className="space-y-6">
      {/* Empty Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: '📝 Total Notes', value: '---' },
          { title: '🧩 Total Objects', value: '---' },
          { title: '📅 Created This Week', value: '---' },
          { title: '🔁 Activity Score', value: '---' }
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{item.value}</div>
              <p className="text-xs text-muted-foreground">Connect API to view data</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Connect Your Capacities Account</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Enter your Capacities API token to unlock your personal knowledge analytics and insights.
          </p>
          
          <Alert className="max-w-md mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Need an API token?</strong>
              <br />
              Open Capacities → Settings → API & Integrations → Generate Token
            </AlertDescription>
          </Alert>

          <div className="space-y-2 text-sm text-muted-foreground max-w-md">
            <p>• View your note-taking patterns and trends</p>
            <p>• Analyze your knowledge graph connections</p>
            <p>• Track your productivity and content insights</p>
            <p>• Discover orphaned notes and optimization opportunities</p>
          </div>

          <div className="mt-6">
            <TokenInput onTokenSubmit={onTokenSubmit} />
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-4">
            <a 
              href="https://capacities.io/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              View API Documentation
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ErrorDisplay = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="space-y-3">
        <div>
          <div className="font-medium mb-1">Connection Error</div>
          <div className="text-sm">{error}</div>
        </div>
        
        {/* Specific guidance for different error types */}
        {error.includes('JSON') && (
          <div className="text-xs bg-red-50 p-3 rounded border border-red-200">
            <div className="font-medium mb-1">JSON Parsing Error</div>
            <div className="space-y-1">
              <p>The API returned invalid or malformed data. This could be due to:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Proxy service returning HTML instead of JSON</li>
                <li>API token being invalid or expired</li>
                <li>Temporary API service issues</li>
              </ul>
              <p className="mt-2"><strong>Try:</strong> Retry the connection or generate a new API token.</p>
            </div>
          </div>
        )}
        
        {error.includes('proxy') && (
          <div className="text-xs bg-red-50 p-3 rounded border border-red-200">
            <div className="font-medium mb-1">Proxy Service Issues</div>
            <div className="space-y-1">
              <p>The CORS proxy services are experiencing issues. We automatically try multiple proxy services.</p>
              <p><strong>Try:</strong> Wait a moment and retry, or check your internet connection.</p>
            </div>
          </div>
        )}
        
        {retryCount > 0 && (
          <div className="text-xs text-muted-foreground">
            Retry attempt: {retryCount}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {retryCount > 0 ? 'Retry Again' : 'Retry'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
          >
            New Token
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open('https://capacities.io/support', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Get Help
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">🧠 Capacities Analytics</h1>
          <p className="text-muted-foreground">
            Your personal knowledge management insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {token && timeLeft && (
            <Badge variant="outline" className="text-sm">
              🔐 Expires in {Math.floor(timeLeft / 60000)}:{Math.floor((timeLeft % 60000) / 1000).toString().padStart(2, '0')}
            </Badge>
          )}
          
          {token && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </>
          )}

          <TokenInput 
            onTokenSubmit={onTokenSubmit}
            existingToken={token}
            compact={true}
          />
        </div>
      </div>

      {/* CORS Notice */}
      <CorsNotice />

      {/* Space Info Card */}
      {stats && (
        <SpaceInfoCard stats={stats} lastSync={lastSync} />
      )}

      {/* Error Display */}
      {error && token && <ErrorDisplay />}

      {/* Loading State */}
      {isLoading && token && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      )}

      {/* Analytics Tabs or Empty State */}
      {!token || (!stats && !isLoading) ? (
        <EmptyState />
      ) : stats ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewCards stats={stats} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityCharts stats={stats} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <ContentInsights stats={stats} />
          </TabsContent>
        </Tabs>
      ) : null}

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-6">
        <p>
          Your data is processed securely and never stored on our servers. 
          API token expires automatically after 1 hour.
        </p>
        <p className="mt-2">
          Data is fetched directly from your Capacities account via their official API using CORS proxy services.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <a 
            href="https://capacities.io/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline text-xs"
          >
            <ExternalLink className="w-3 h-3" />
            Capacities API Docs
          </a>
          <a 
            href="https://github.com/Rob--W/cors-anywhere" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline text-xs"
          >
            <Info className="w-3 h-3" />
            About CORS Proxies
          </a>
        </div>
      </div>
    </div>
  );
}