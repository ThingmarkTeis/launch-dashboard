# 🚀 The Testosterone Protocol - Launch Dashboard

A professional static site dashboard for managing your book launch project.

## 🌟 Features

- **🔐 Password Protected Access** (3 user levels)
- **📊 Real-time Project Dashboard** with metrics and alerts
- **👥 Agent Management** - Monitor all 32 specialized agents
- **📁 File Browser** - Access all project deliverables
- **🏗️ Pipeline Tracking** - Visual launch progress
- **📱 Mobile Responsive** - Works on all devices
- **⚡ Auto-refresh** - Updates every 5 minutes

## 🚀 Quick Deploy

### Option 1: Netlify Drop (Easiest)
1. Go to **https://app.netlify.com/drop**
2. Drag the entire `launch-site` folder
3. Get instant live URL
4. Optional: Add custom domain in settings

### Option 2: Vercel
1. Upload folder to GitHub
2. Connect to Vercel
3. Deploy automatically
4. Add custom domain

### Option 3: Own Server
```bash
# Copy files to web server
scp -r launch-site/ user@yourserver:/var/www/
# Point domain to server
# Configure nginx/apache
```

## 🔑 Login Credentials

| Username | Password | Access Level |
|----------|----------|--------------|
| `teis` | `launch2026` | Full Admin |
| `admin` | `testosterone2026` | Full Admin |
| `guest` | `preview123` | Read Only |

**🚨 Change these passwords in `js/auth.js` before going live!**

## 📂 File Structure

```
launch-site/
├── index.html          # Login page
├── dashboard.html      # Main dashboard
├── css/
│   └── style.css      # All styling
├── js/
│   ├── auth.js        # Authentication system
│   └── dashboard.js   # Dashboard functionality
└── pages/
    ├── agents.html    # Agent management
    ├── files.html     # File browser
    └── pipeline.html  # Launch pipeline
```

## ⚙️ Customization

### Update Project Data
Edit the data in `dashboard.html` and page files:
- Launch date countdown
- Metrics and numbers  
- Agent statuses
- File listings
- Timeline milestones

### Change Passwords
Edit `js/auth.js`, update the credentials object:
```javascript
this.credentials = {
    'youruser': 'yourpassword',
    'admin': 'newpassword'
};
```

### Add Custom Domain
- **Netlify**: Site settings → Domain management
- **Vercel**: Project settings → Domains  
- **Own server**: DNS A record to server IP

### Real-time Updates
For live data integration:
1. Replace static data with API calls
2. Update `refreshData()` in `dashboard.js`
3. Connect to your project management system

## 🔄 Auto-Updates

The dashboard includes:
- **Auto-refresh** every 5 minutes
- **Real-time countdown** to launch day
- **Interactive elements** for detailed views
- **Mobile-optimized** responsive design

## 🎨 Design Features

- **Dark theme** optimized for focus
- **Gradient accents** for visual hierarchy
- **Card-based layout** for easy scanning
- **Status indicators** with color coding
- **Smooth animations** and transitions

## 📱 Mobile Support

Fully responsive design works on:
- 📱 Mobile phones
- 📟 Tablets
- 💻 Laptops
- 🖥️ Desktop monitors

## 🔒 Security Features

- **Client-side authentication** (for basic protection)
- **Session timeout** (24 hours)
- **Password masking**
- **No sensitive data exposed**

For production use with sensitive data, consider:
- Server-side authentication
- HTTPS enforcement  
- Rate limiting
- Access logging

## 📊 Dashboard Sections

### Main Dashboard
- Mission critical metrics
- Active blockers
- Agent team status
- Recent deliverables
- Performance metrics
- Next actions

### Agent Management  
- Team overview (32 agents)
- Individual agent status
- Performance metrics
- Workload balancing
- Health monitoring

### File Browser
- Organized by category
- Visual file types
- Quick preview/edit
- Upload capabilities
- Sync status

### Launch Pipeline
- 5-stage visual progress
- Task breakdowns
- Critical path analysis
- Timeline view
- Dependency tracking

## 🛠️ Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid/Flexbox
- **Vanilla JavaScript** - No frameworks, fast loading
- **Progressive Enhancement** - Works without JS
- **Mobile-first** responsive design

## 📈 Performance

- **Lightweight** - ~50KB total size
- **Fast loading** - No external dependencies
- **Offline capable** - Static files cache well
- **SEO friendly** - Clean semantic HTML

## 🆘 Support

Common issues:
- **Login not working**: Check browser console for errors
- **Data not updating**: Refresh page or check auto-refresh
- **Mobile layout broken**: Clear browser cache
- **Files not loading**: Verify all files uploaded correctly

## 🔄 Updates

To update the dashboard:
1. Edit the HTML/CSS/JS files
2. Re-upload to your hosting platform  
3. Changes appear immediately

For automated updates, consider:
- GitHub Actions deployment
- Webhook integrations
- API-driven data updates

---

## 🎯 Built for The Testosterone Protocol Launch

This dashboard was specifically designed for managing a complex book launch with multiple agents, deliverables, and tight deadlines. 

**Launch Date: March 20, 2026 | 30 Days to Go! 🚀**