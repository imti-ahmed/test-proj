# Capacities API Debugger

## How to Get Your API Token

1. **Open Capacities App**
   - Launch your Capacities desktop application

2. **Navigate to Settings**
   - Go to Settings → API & Integrations
   - Or use the menu: Capacities → Preferences → API & Integrations

3. **Generate API Token**
   - Click "Generate New Token" or "Create API Token" 
   - Copy the generated token (it will look like: `cap_1234567890abcdef...` or similar)

## How to Use the Debugger

1. **Start the App**
   - The debugger interface should be running in your browser

2. **Add Your Token**
   - Paste your API token in the text field labeled "Enter Capacities API token"
   - The token will be visible as you type (not hidden with dots)

3. **Test API Endpoints**
   - Click any of the test buttons:
     - **"Test /spaces"** - Shows your Capacities spaces
     - **"Test /objects"** - Shows your notes and objects  
     - **"Test /me"** - Shows your user information

4. **View Results**
   - Each API call will show:
     - HTTP status code
     - Response headers
     - Raw API response data
     - Any error messages

## Token Format Examples

Your token might look like one of these:
- `cap_1234567890abcdefghijklmnop`
- `sk-1234567890abcdefghijklmnop` 
- `Bearer cap_1234567890abcdefghijklmnop`

## Troubleshooting

If you get CORS errors, that's expected since browsers block cross-origin requests. The debugger will show you exactly what error occurs so we can determine the next steps.