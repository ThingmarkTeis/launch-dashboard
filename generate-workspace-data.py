#!/usr/bin/env python3
"""Generate workspace data for the dashboard file browser"""

import os
import json
import datetime
from pathlib import Path
from math import log

WORKSPACE_ROOT = '/home/clawdbot/.openclaw'
OUTPUT_FILE = 'workspace-data.json'

# Department to agent mapping
DEPARTMENT_AGENTS = {
    'content-boss': 'Content Creation',
    'design-boss': 'Design & Visual',
    'funnel-boss': 'Funnel & Sales',
    'ads-boss': 'Marketing & Ads',
    'reviews-boss': 'Reviews & Social Proof',
    'seo-boss': 'SEO & Search',
    'analytics-boss': 'Analytics & Data',
    'launch-boss': 'Launch Operations',
    'thingmark-leader': 'Leadership',
    'operations-boss': 'Operations & Infrastructure'
}

def format_file_size(bytes):
    """Format file size in human-readable format"""
    if bytes == 0:
        return '0 B'
    
    k = 1024
    sizes = ['B', 'KB', 'MB', 'GB']
    i = min(int(log(bytes) / log(k)), len(sizes) - 1) if bytes > 0 else 0
    
    return f"{bytes / (k ** i):.1f} {sizes[i]}"

def get_file_type(ext):
    """Determine file type based on extension"""
    type_map = {
        '.md': 'document',
        '.txt': 'document',
        '.json': 'data',
        '.js': 'code',
        '.py': 'code',
        '.html': 'code',
        '.css': 'code',
        '.pdf': 'document',
        '.png': 'image',
        '.jpg': 'image',
        '.jpeg': 'image',
        '.gif': 'image',
        '.svg': 'image',
        '.mp3': 'audio',
        '.wav': 'audio',
        '.mp4': 'video',
        '.mov': 'video',
        '.zip': 'archive',
        '.tar': 'archive',
        '.gz': 'archive'
    }
    
    return type_map.get(ext.lower(), 'file')

def scan_directory(dir_path, base_path='', max_depth=3, current_depth=0):
    """Scan directory and return file information"""
    files = []
    
    if current_depth >= max_depth:
        return files
    
    try:
        for item in os.listdir(dir_path):
            # Skip hidden files and common directories
            if item.startswith('.') or item in ['node_modules', '__pycache__', '.git']:
                continue
            
            item_path = os.path.join(dir_path, item)
            relative_path = os.path.join(base_path, item)
            
            try:
                stats = os.stat(item_path)
                
                if os.path.isdir(item_path):
                    # Recursively scan subdirectories
                    sub_files = scan_directory(item_path, relative_path, max_depth, current_depth + 1)
                    files.extend(sub_files)
                else:
                    # Add file info
                    ext = os.path.splitext(item)[1]
                    files.append({
                        'name': item,
                        'path': relative_path,
                        'size': format_file_size(stats.st_size),
                        'sizeBytes': stats.st_size,
                        'modified': datetime.datetime.fromtimestamp(stats.st_mtime).isoformat(),
                        'type': get_file_type(ext),
                        'extension': ext
                    })
            except (OSError, IOError) as e:
                print(f"Error accessing {item_path}: {e}")
                
    except (OSError, IOError) as e:
        print(f"Error scanning directory {dir_path}: {e}")
    
    return files

def scan_workspace():
    """Scan all workspace directories"""
    workspace_data = {
        'timestamp': datetime.datetime.now().isoformat(),
        'departments': {},
        'recentActivity': [],
        'stats': {
            'totalFiles': 0,
            'totalDepartments': 0,
            'activeDepartments': 0,
            'lastUpdate': None
        }
    }
    
    # Scan each workspace directory
    for agent, dept_name in DEPARTMENT_AGENTS.items():
        agent_path = os.path.join(WORKSPACE_ROOT, f'workspace-{agent}')
        
        if os.path.exists(agent_path):
            print(f"Scanning {agent}...")
            files = scan_directory(agent_path)
            
            workspace_data['departments'][agent] = {
                'name': dept_name,
                'path': agent_path,
                'files': files,
                'fileCount': len(files),
                'lastModified': max([f['modified'] for f in files], default=None) if files else None
            }
            
            workspace_data['stats']['totalFiles'] += len(files)
            if len(files) > 0:
                workspace_data['stats']['activeDepartments'] += 1
    
    workspace_data['stats']['totalDepartments'] = len(workspace_data['departments'])
    workspace_data['stats']['lastUpdate'] = datetime.datetime.now().isoformat()
    
    # Get recent activity across all workspaces
    all_files = []
    for dept_key, dept in workspace_data['departments'].items():
        for f in dept['files']:
            f['department'] = dept['name']
            f['departmentKey'] = dept_key
            all_files.append(f)
    
    # Sort by modified date and take top 20
    all_files.sort(key=lambda x: x['modified'], reverse=True)
    workspace_data['recentActivity'] = all_files[:20]
    
    return workspace_data

def main():
    """Generate workspace data file"""
    print("Generating workspace data file...")
    data = scan_workspace()
    
    # Write to file
    output_path = Path(__file__).parent / OUTPUT_FILE
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Generated {OUTPUT_FILE} with data from {data['stats']['totalDepartments']} departments and {data['stats']['totalFiles']} files")
    
    # Also write a minified version
    min_path = Path(__file__).parent / 'workspace-data.min.json'
    with open(min_path, 'w') as f:
        json.dump(data, f)
    
    return data

if __name__ == '__main__':
    main()