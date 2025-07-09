import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Key, ExternalLink, Info, Loader2, Shield } from 'lucide-react';
import { testCapacitiesConnection } from '../utils/capacitiesApi';

interface TokenInputProps {
  onTokenSubmit: (token: string) => void;
  existingToken?: string;
  compact?: boolean;
}

export function TokenInput({ onTokenSubmit, existingToken, compact = false }: TokenInputProps) {
  const [token, setToken] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsConnecting(true);

    if (!token.trim()) {
      setError('Please enter your API token');
      setIsConnecting(false);
      return;
    }

    // Basic token format validation
    if (!token.startsWith('Bearer ') && !token.startsWith('sk-') && !token.startsWith('cap_') && token.length < 20) {
      setError('Invalid token format. Please check your API token.');
      setIsConnecting(false);
      return;
    }

    try {
      // Test the connection first via CORS proxy
      const testResult = await testCapacitiesConnection(token.trim());
      
      if (testResult.success) {
        onTokenSubmit(token.trim());
        setIsOpen(false);
        setToken('');
      } else {
        setError(`Connection failed: ${testResult.message}`);
      }
    } catch (err) {
      setError('Failed to test connection via CORS proxy. Please check your token and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {compact ? (
          <Button variant="outline" size="sm">
            <Key className="w-4 h-4 mr-2" />
            {existingToken ? 'Update Token' : 'Connect API'}
          </Button>
        ) : (
          <Button variant="default" className="w-full">
            <Key className="w-4 h-4 mr-2" />
            Connect to Capacities
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <Label className="font-medium">Capacities API Token</Label>
              {existingToken && (
                <Badge variant="secondary" className="text-xs">
                  Connected
                </Badge>
              )}
            </div>
            <Input
              type="password"
              placeholder="Enter your Capacities API token..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm">
                <div className="space-y-2">
                  <p className="text-blue-800"><strong>CORS Proxy Notice:</strong></p>
                  <p className="text-blue-700">
                    This app uses a CORS proxy to bypass browser restrictions when accessing the Capacities API. 
                    Your token will be transmitted through a third-party proxy service.
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <div className="space-y-2">
                  <p><strong>How to get your API token:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Open Capacities desktop app</li>
                    <li>Go to Settings → API & Integrations</li>
                    <li>Generate a new API token</li>
                    <li>Copy and paste it here</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Token expires in 1 hour</span>
              <a 
                href="https://capacities.io/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                API Docs
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing via Proxy...
                </>
              ) : (
                existingToken ? 'Update' : 'Connect'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isConnecting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}