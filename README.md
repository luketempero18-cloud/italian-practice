# Italian Practice

A static Italian study website built with HTML, CSS, and JavaScript. It does not require a backend, database, account, package manager, or build step.

## Run locally

The simplest option is to open `index.html` in a browser.

You can also serve the folder with a small local web server. From inside the `italian-practice` folder, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in your browser.

## Deploy with GitHub Pages

For the simplest setup, make `italian-practice` its own repository. The repository root should contain `index.html`, `styles.css`, `studyData.js`, `unit2Data.js`, `practiceTest.js`, and `app.js`.

1. Create a new GitHub repository, or use an existing repository dedicated to this site.
2. Push or upload the contents of the `italian-practice` folder. Upload the files themselves—not an extra folder around them—so `index.html` is at the repository root.
3. Open the repository on GitHub and go to **Settings**.
4. Select **Pages** in the sidebar.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and the `/ (root)` folder.
7. Click **Save**.
8. Wait a few minutes for GitHub to publish the site. The Pages screen will show a public URL similar to `https://username.github.io/italian-practice/`.

The site's relative CSS and JavaScript paths work when GitHub Pages hosts it under `/italian-practice/`.

## Deploy with Netlify

### Drag-and-drop option

1. Sign in to Netlify and open its manual deployment area.
2. Drag the entire `italian-practice` folder into the deployment area.
3. Netlify will generate a public URL after the upload finishes.

### GitHub option

1. Put the contents of `italian-practice` in a GitHub repository.
2. In Netlify, choose **Add new site** and then **Import an existing project**.
3. Connect the GitHub repository.
4. Leave the build command empty and set the publish directory to `.` because this is a plain static site.
5. Deploy the site.

## Deploy with Vercel

1. Put the contents of `italian-practice` in a GitHub repository.
2. In Vercel, choose **Add New Project** and import that repository.
3. Select **Other** if Vercel asks for a framework preset.
4. Leave the build command empty and use `.` as the output directory.
5. Deploy to receive a public URL.

No Vercel configuration file is required.

## Progress and privacy

Progress, mistakes, statistics, selected topics, and settings are stored with browser `localStorage`.

- Every visitor gets independent progress in their own browser.
- Progress is not uploaded to a server.
- Progress does not automatically sync between browsers, devices, or private browsing sessions.
- Clearing browser site data will clear that browser's saved progress.
