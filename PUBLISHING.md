# Publication and sharing

## Current status

This repository is public and GitHub Pages was enabled for main → /docs during setup. M/M/1 Queueing v0.2.1, Bottlenecks v0.4 and Batching & Setups v0.4 are owner-approved Operations visualizations, included in the catalog with single HTML downloads. Check the Pages deployment after each push.

## Recommended route: GitHub Pages

Classmates should receive the Pages catalog URL. Once demos are ready, they can select Open or Download HTML with no GitHub account. The download is the same offline-capable file used online. Publish only docs/, which contains the generated catalog, .nojekyll and the ready downloads.

For an authorized publication:

1. Run python3 scripts/manage.py build and python3 scripts/manage.py check. Complete the ready demos' browser evidence.
2. Review all files to be committed for original course documents, personal information, secrets, machine paths and unapproved assets. Resolve the license decision in RIGHTS.md.
3. Commit reviewed source and generated output, then push main to the configured origin.
4. In GitHub repository Settings → Pages → Build and deployment, select Deploy from a branch, main, /docs, then Save.
5. Wait for the Pages deployment to finish. Verify the actual URL, the catalog's Open/Download actions and a detached download before sharing the link.

No custom domain, app hosting provider, student login or backend is required. No automatic deployment workflow is included; branch-based Pages can serve the checked-in files.

## Sharing fallback

Before Pages is available, send a tested ready HTML file directly through the class's normal sharing channel. Classmates download it, keep the .html extension, and double-click it. On GitHub, a student can also open docs/downloads/<slug>.html and use Download raw file; do not send them an HTML source-code view as though it runs the visualization. ZIP extraction is unnecessary for one demo.

The catalog's same-origin download attribute is designed for Pages. Test the actual deployed browser behavior; browsers may open a file instead, in which case Save page is the fallback. Online Open is the simpler phone experience; local HTML behavior varies across mobile file handlers.

## Official references checked during setup

- [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Choose branch and /docs publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)

Class catalog: [Operations visualizations](https://bpdiehl.github.io/ops_visualizations/).
Direct visualization: [M/M/1 Queueing](https://bpdiehl.github.io/ops_visualizations/downloads/mm1.html). Verify the deployed version after pushing.
