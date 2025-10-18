# Admin Panel Guide

## 🔐 Accessing the Admin Panel

**PRIVATE - For Personal Use Only**

### Access:
- Secret link hidden on main portfolio page
- Look for process ID (pid) in footer terminal output
- Keep this location confidential

### Initial Setup:
1. Access admin panel via secret link
2. Use configured credentials
3. Change password immediately after first login

---

## 📚 Features

### 1. Projects Management
- ✅ Add new projects
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ Manage project details:
  - Title & subtitle
  - Technologies used
  - Code snippets
  - GitHub & demo links
  - Project images

### 2. Experience Management
- ✅ Add work experience
- ✅ Delete experience entries
- ✅ Manage:
  - Job title
  - Company name
  - Period/dates
  - Description

### 3. Skills Management
- ✅ Organize skills by categories:
  - Languages
  - Frontend
  - Backend
  - Security
  - Tools
- ✅ Add/remove skills
- ✅ Add comments for each skill

### 4. Settings
- ✅ Change admin password
- ✅ Export all data (JSON backup)
- ✅ Import data (restore from backup)

---

## 🎯 How to Use

### Adding a Project:

1. Navigate to **Projects** tab
2. Click **"Add New Project"**
3. Fill in the form:
   ```
   Title: My Awesome Project
   Subtitle: Full Stack Web App
   Technologies: React, Node.js, MongoDB
   Code Snippet: [Your code here]
   GitHub: https://github.com/username/project
   Demo: https://project-demo.com
   Image: ./assets/images/project.png
   ```
4. Click **"Save Project"**

### Editing Skills:

1. Navigate to **Skills** tab
2. Edit existing skills or add new ones
3. Format: `skill-name.ext  // Comment`
4. Click **"Save Skills"** when done

### Backing Up Data:

1. Go to **Settings** tab
2. Click **"Export Data"**
3. Save the JSON file somewhere safe
4. To restore: Click **"Import Data"** and select the file

---

## 💾 Data Storage

All data is stored in **localStorage** in your browser:
- `portfolioProjects` - All your projects
- `portfolioExperience` - Work history
- `portfolioSkills` - Skill categories
- `adminPassword` - Encrypted password
- `adminLoggedIn` - Session state

⚠️ **Important Notes:**
- Data persists in your browser only
- Clearing browser data will delete everything
- **Always export backups regularly!**
- Data is NOT synced across devices

---

## 🔒 Security

### Change Your Password:
1. Go to **Settings** tab
2. Enter new password
3. Confirm password
4. Click **"Update Password"**

### Best Practices:
- Use a strong password
- Don't share admin.html link publicly
- Add `.htaccess` protection if hosting on Apache
- Consider using GitHub Pages private repo for admin panel
- Export backups before making major changes

---

## 🚀 Quick Start Checklist

- [ ] Access admin panel
- [ ] Change default password
- [ ] Add your projects
- [ ] Update experience entries
- [ ] Customize skills
- [ ] Export initial backup
- [ ] Test on main site
- [ ] Set up regular backup routine

---

## 🛠️ Troubleshooting

### Can't Login?
- Check username/password (case-sensitive)
- Try default: `admin` / `portfolio2025`
- Clear localStorage and try again

### Changes Not Showing?
- Main site doesn't auto-update yet
- You need to manually update `index.html` based on admin data
- Or implement dynamic loading (see DYNAMIC_LOADING.md)

### Lost Data?
- Check if you have a backup export
- localStorage data might be cleared
- Import your backup JSON file

### Browser Compatibility?
- Works on: Chrome, Firefox, Safari, Edge
- Requires: JavaScript enabled
- Requires: localStorage support

---

## 📝 Tips

1. **Regular Backups**: Export data weekly
2. **Version Control**: Keep exported JSON in git
3. **Preview**: Always preview changes before publishing
4. **Mobile**: Admin panel works on mobile too
5. **Organization**: Use consistent naming for projects

---

## 🔄 Future Enhancements

Potential features to add:
- [ ] Auto-sync to GitHub
- [ ] Image upload functionality
- [ ] Rich text editor for descriptions
- [ ] Analytics dashboard
- [ ] Multi-user support
- [ ] API integration
- [ ] Real-time preview

---

## ⚠️ Limitations

Current limitations:
- No server-side storage
- No image hosting
- Manual HTML updates needed
- Single admin user only
- No version history
- No undo/redo

For a production setup, consider:
- Backend API (Node.js + MongoDB)
- Authentication service (Auth0, Firebase)
- CDN for images (Cloudinary, AWS S3)
- CMS integration (Strapi, Contentful)

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Try exporting/importing data
4. Clear cache and retry
5. Check ADMIN_GUIDE.md for solutions

---

**Built with ❤️ using vanilla JavaScript**
**Terminal theme for authentic dev aesthetic**
