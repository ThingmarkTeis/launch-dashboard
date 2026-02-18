# Command Center Dashboard

A dark mode, terminal-inspired command center dashboard for monitoring agents and departments. Built exactly to specification with no fabricated data.

## Features

- **Dark Terminal Aesthetic**: Neon accents, sharp typography, subtle glow effects
- **Department Overview**: Real-time status of all departments and agents
- **File System Browser**: Browse department files with markdown preview
- **Failures & Mistakes Log**: Track and analyze system failures
- **Funnel Visualization**: Monitor progress through stages
- **Hourly Auto-Refresh**: Dashboard updates every hour automatically

## Installation

1. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser to: `http://localhost:3000`

## API Endpoints

The dashboard connects to these endpoints to fetch real data:

- `GET /api/departments` - Get all department statuses
- `GET /api/departments/:name` - Get specific department status
- `GET /api/failures` - Get failures log
- `GET /api/funnel` - Get funnel metrics
- `GET /api/files` - Browse file system
- `GET /api/files/content` - Get file content
- `GET /api/files/download` - Download file

## Data Sources

The dashboard reads from these workspace directories:

- `/status/` - Agent status files
- `/tasks/` - Agent task queues
- `/insights/` - Agent insights
- `/activity/` - Activity logs
- `/failures/` - Failure logs
- `/analytics/` - Funnel metrics
- `/departments/` - Department files

## Rules Enforced

1. **No Fabricated Data**: Only shows real data from actual agent activity
2. **Empty States**: Shows "No data" or empty sections when no activity exists
3. **Real Timestamps**: All times are from actual file modifications
4. **Traceable Insights**: Every insight comes from actual agent output

## Customization

### GitHub Integration

Update the GitHub token in `dashboard.js`:
```javascript
const GITHUB_TOKEN = 'your-token-here';
const GITHUB_OWNER = 'your-username';
const GITHUB_REPO = 'your-repo';
```

### Workspace Path

Set the workspace path when starting the server:
```bash
WORKSPACE_PATH=/path/to/workspace npm start
```

### Port Configuration

Change the port:
```bash
PORT=8080 npm start
```

## Keyboard Shortcuts

- `ESC` - Go back in file browser / Close preview

## Development

Run in development mode with auto-restart:
```bash
npm run dev
```

## Architecture

- **Frontend**: Vanilla JavaScript with CSS Grid layout
- **Backend**: Express.js API server
- **Data Layer**: Direct file system reads (no database)
- **Updates**: Polling-based (1 hour intervals)

## Design Principles

1. **Terminal-Inspired**: Dark backgrounds, neon accents, monospace fonts
2. **Information Density**: Maximum data, minimum chrome
3. **Real-Time Data**: No placeholders, only actual information
4. **Performance**: Lightweight, fast updates, minimal dependencies

## Future Enhancements

- WebSocket support for real-time updates
- Advanced markdown rendering
- Export functionality for reports
- Historical data visualization
- Pattern analysis for failures

---

Built to specification. No lies, no placeholders, just data.