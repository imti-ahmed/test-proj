import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { callCapacitiesAPI } from '../utils/capacitiesApi';

export function ApiDebugger() {
  const [token, setToken] = useState('');
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    '/spaces',
    '/objects',
    '/me'
  ];

  const testEndpoint = async (endpoint: string) => {
    if (!token.trim()) {
      alert('Please enter an API token');
      return;
    }

    setLoading(true);
    try {
      const result = await callCapacitiesAPI(endpoint, token.trim());
      const newResponse = {
        endpoint,
        timestamp: new Date().toISOString(),
        ...result
      };
      setResponses(prev => [newResponse, ...prev]);
    } catch (error) {
      const errorResponse = {
        endpoint,
        timestamp: new Date().toISOString(),
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      };
      setResponses(prev => [errorResponse, ...prev]);
    }
    setLoading(false);
  };

  const clearResponses = () => {
    setResponses([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Capacities API Debugger</h1>
        
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder="Enter Capacities API token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="flex-1 font-mono"
          />
          <Button onClick={clearResponses} variant="outline">
            Clear
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {endpoints.map(endpoint => (
            <Button
              key={endpoint}
              onClick={() => testEndpoint(endpoint)}
              disabled={loading}
              variant="outline"
            >
              Test {endpoint}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {responses.map((response, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{response.endpoint}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {response.timestamp}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <p className={`text-sm ${response.status === 200 ? 'text-green-600' : 'text-red-600'}`}>
                    {response.status} {response.statusText}
                  </p>
                </div>

                {response.headers && (
                  <div>
                    <h4 className="font-medium mb-2">Headers</h4>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                      {JSON.stringify(response.headers, null, 2)}
                    </pre>
                  </div>
                )}

                {response.error && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Error</h4>
                    <p className="text-sm text-red-600">{response.error}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Response Data</h4>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-96">
                    {response.data}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {responses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              Enter your API token and click a test button to see API responses
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}