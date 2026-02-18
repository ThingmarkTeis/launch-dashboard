# Dashboard Data Structure

This document describes the expected file structure for the dashboard to read agent data.

## Directory Structure

```
workspace-website-boss/
├── status/           # Agent status files
├── tasks/            # Agent task queues
├── insights/         # Agent insights
├── activity/         # Activity logs
├── failures/         # Failure logs
├── analytics/        # Funnel metrics
└── departments/      # Department file storage
```

## File Formats

### Agent Status (`/status/{agent-id}.json`)

```json
{
  "currentStatus": "active",  // active | idle | error
  "lastUpdated": "2024-02-18T10:30:00Z"
}
```

### Agent Tasks (`/tasks/{agent-id}.json`)

```json
{
  "inProgress": [
    "Building landing page header component",
    "Implementing A/B testing framework"
  ],
  "queued": [
    "Review conversion metrics"
  ],
  "completed": [
    "Set up Next.js project",
    "Configure Tailwind CSS",
    "Create component library"
  ]
}
```

### Agent Insights (`/insights/{agent-id}.txt`)

Plain text file with insights, one per line:
```
Landing page conversion improved 23% with new headline
Mobile responsiveness issues fixed across all pages
```

### Activity Log (`/activity/{agent-id}.log`)

The file modification time is used as the last activity timestamp.

### Failures Log (`/failures/{timestamp}-{agent-id}.json`)

```json
{
  "department": "Web Developer",
  "agent": "web-developer",
  "error": "Failed to compile TypeScript: Type 'string' is not assignable to type 'number'",
  "task": "Implementing user authentication",
  "timestamp": "2024-02-18T09:15:00Z",
  "status": "fixed"  // fixed | unresolved | workaround
}
```

### Funnel Analytics (`/analytics/funnel.json`)

```json
{
  "Discovery": {
    "status": "completed",
    "value": "1,234",
    "label": "visitors",
    "description": "SEO and content strategy deployed"
  },
  "Interest": {
    "status": "in-progress",
    "value": "567",
    "label": "engaged users",
    "description": "Landing page optimization ongoing"
  },
  "Consideration": {
    "status": null,
    "value": null,
    "label": null,
    "description": "No data"
  }
}
```

### Department Files (`/departments/`)

Organized by department subdirectories:
```
departments/
├── web-developer/
│   ├── README.md
│   ├── architecture.md
│   └── components/
├── seo-specialist/
│   ├── keyword-research.md
│   └── reports/
└── analytics/
    └── dashboards/
```

## Integration Guide

### 1. Agent Status Updates

When your agent changes state, write to the status file:
```javascript
const status = {
  currentStatus: 'active',
  lastUpdated: new Date().toISOString()
};
fs.writeFileSync(`/status/${agentId}.json`, JSON.stringify(status));
```

### 2. Task Management

Update tasks as they progress:
```javascript
const tasks = {
  inProgress: currentTasks,
  queued: queuedTasks,
  completed: completedTasks.slice(-10) // Keep last 10
};
fs.writeFileSync(`/tasks/${agentId}.json`, JSON.stringify(tasks));
```

### 3. Logging Failures

Log failures when they occur:
```javascript
const failure = {
  department: 'Web Developer',
  agent: agentId,
  error: error.message,
  task: currentTask,
  timestamp: new Date().toISOString(),
  status: 'unresolved'
};
const filename = `${Date.now()}-${agentId}.json`;
fs.writeFileSync(`/failures/${filename}`, JSON.stringify(failure));
```

### 4. Recording Insights

Append insights to the text file:
```javascript
const insight = 'New optimization reduced load time by 2 seconds';
fs.appendFileSync(`/insights/${agentId}.txt`, insight + '\n');
```

### 5. Activity Tracking

Touch the activity file to update last activity:
```bash
touch /activity/${agentId}.log
```

## Best Practices

1. **Real Data Only**: Never write placeholder or theoretical data
2. **Atomic Updates**: Write complete files to avoid partial reads
3. **Clean Old Data**: Rotate logs and completed tasks periodically
4. **Validate JSON**: Ensure all JSON files are valid before writing
5. **Use UTC**: All timestamps should be in UTC format

## Example Agent Integration

```javascript
class AgentReporter {
  constructor(agentId, department) {
    this.agentId = agentId;
    this.department = department;
    this.basePath = process.env.WORKSPACE_PATH;
  }

  reportStatus(status) {
    const data = {
      currentStatus: status,
      lastUpdated: new Date().toISOString()
    };
    this.writeJSON('status', data);
  }

  reportTask(type, task) {
    const tasksFile = this.getPath('tasks');
    const tasks = this.readJSON('tasks') || {
      inProgress: [],
      queued: [],
      completed: []
    };
    
    if (type === 'start') {
      tasks.queued = tasks.queued.filter(t => t !== task);
      tasks.inProgress.push(task);
    } else if (type === 'complete') {
      tasks.inProgress = tasks.inProgress.filter(t => t !== task);
      tasks.completed.push(task);
      // Keep only last 20 completed tasks
      tasks.completed = tasks.completed.slice(-20);
    }
    
    this.writeJSON('tasks', tasks);
  }

  reportInsight(insight) {
    const insightPath = path.join(this.basePath, 'insights', `${this.agentId}.txt`);
    fs.appendFileSync(insightPath, insight + '\n');
  }

  reportFailure(error, task, status = 'unresolved') {
    const failure = {
      department: this.department,
      agent: this.agentId,
      error: error.message || error,
      task: task,
      timestamp: new Date().toISOString(),
      status: status
    };
    
    const filename = `${Date.now()}-${this.agentId}.json`;
    fs.writeFileSync(
      path.join(this.basePath, 'failures', filename),
      JSON.stringify(failure, null, 2)
    );
  }

  touchActivity() {
    const activityPath = path.join(this.basePath, 'activity', `${this.agentId}.log`);
    fs.closeSync(fs.openSync(activityPath, 'w'));
  }
}
```

This structure allows the dashboard to display real, traceable data from your agent system.