# GitHub Upload Instructions

Your local Git repository is ready! Follow these simple steps to upload to GitHub:

## Option 1: Create Repository via GitHub Website (Recommended)

### Step 1: Create Repository on GitHub
1. Go to https://github.com/new
2. **Repository name:** `codsoft_tasks`
3. **Description:** `CodSoft Web Development Internship - Level 1 Tasks: Personal Portfolio, Landing Page, and Calculator`
4. **Visibility:** Public
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

### Step 2: Push Your Code
After creating the repository, GitHub will show you commands. Use these:

```bash
cd C:\Users\Mandar\OneDrive\Desktop\DM\CODSOFT_TASKSNO
git remote add origin https://github.com/Mandar-Sonkusare/codsoft_tasks.git
git branch -M main
git push -u origin main
```

**OR if you prefer SSH:**
```bash
cd C:\Users\Mandar\OneDrive\Desktop\DM\CODSOFT_TASKSNO
git remote add origin git@github.com:Mandar-Sonkusare/codsoft_tasks.git
git branch -M main
git push -u origin main
```

---

## Option 2: Use GitHub Desktop (Easy GUI Method)

1. Download GitHub Desktop from https://desktop.github.com/
2. Install and sign in with your GitHub account
3. Click **"Add"** → **"Add Existing Repository"**
4. Browse to: `C:\Users\Mandar\OneDrive\Desktop\DM\CODSOFT_TASKSNO`
5. Click **"Publish repository"**
6. Name: `codsoft_tasks`
7. Uncheck "Keep this code private"
8. Click **"Publish repository"**

---

## Option 3: Install GitHub CLI (For Future Use)

```bash
winget install --id GitHub.cli
```

After installation, authenticate:
```bash
gh auth login
```

Then create and push:
```bash
cd C:\Users\Mandar\OneDrive\Desktop\DM\CODSOFT_TASKSNO
gh repo create codsoft_tasks --public --source=. --description "CodSoft Web Development Internship - Level 1 Tasks" --push
```

---

## What's Already Done ✅

- ✅ Git repository initialized
- ✅ All files staged and committed
- ✅ Commit message: "Initial commit: CodSoft Web Development Internship - Level 1 Tasks"
- ✅ .gitignore file created
- ✅ Git configured with your name and email

---

## Repository Contents

```
codsoft_tasks/
├── README.md (Main documentation)
├── TESTING_GUIDE.md (Testing instructions)
├── Task-1-Portfolio/ (Personal Portfolio)
├── Task-2-Landing-Page/ (FINTECH AI Landing Page)
└── Task-3-Calculator/ (Functional Calculator)
```

---

## After Uploading to GitHub

### Enable GitHub Pages (Optional - Make Projects Live)

1. Go to your repository: `https://github.com/Mandar-Sonkusare/codsoft_tasks`
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Branch: **main** → Folder: **/ (root)**
5. Click **Save**
6. Wait 1-2 minutes

**Your projects will be live at:**
- Portfolio: `https://mandar-sonkusare.github.io/codsoft_tasks/Task-1-Portfolio/`
- Landing Page: `https://mandar-sonkusare.github.io/codsoft_tasks/Task-2-Landing-Page/`
- Calculator: `https://mandar-sonkusare.github.io/codsoft_tasks/Task-3-Calculator/`

### Add Topics (Tags for Discovery)

1. Go to your repository
2. Click the gear icon ⚙️ next to "About"
3. Add topics: `html` `css` `javascript` `portfolio` `landing-page` `calculator` `codsoft` `internship` `web-development`
4. Click **Save changes**

---

## Share on LinkedIn

Once uploaded, share with:

```
🎉 Excited to share my CodSoft Web Development Internship projects!

I've completed three Level 1 tasks demonstrating HTML, CSS, and JavaScript skills:

✅ Personal Portfolio - Technology × Finance × AI focused
✅ Landing Page - Modern FINTECH AI platform design
✅ Calculator - Fully functional with keyboard support

All projects are responsive, accessible, and built with clean code.

🔗 GitHub: https://github.com/Mandar-Sonkusare/codsoft_tasks
🔗 Live Demo: [Add GitHub Pages URL]

#WebDevelopment #HTML #CSS #JavaScript #CodSoft #Internship #FrontendDevelopment #Portfolio
```

---

## Need Help?

If you encounter any issues:
1. Make sure you're logged into GitHub
2. Check your internet connection
3. Verify Git is installed: `git --version`
4. If authentication fails, you may need to set up a Personal Access Token

Let me know if you need assistance with any step!
