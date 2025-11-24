# CI/CD Pipeline Documentation

## Overview

TaskMatrix PWA uses GitHub Actions to automate testing and deployment. Two workflows are configured:

1. **Test Suite** - Runs on every push and pull request
2. **Deploy** - Deploys to GitHub Pages on main branch updates

## Workflows

### 1. Test Suite (`.github/workflows/test.yml`)

Runs the test suite on every commit to ensure code quality.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does:**
- Checks out code
- Sets up Node.js (tests on versions 18.x and 20.x)
- Installs dependencies from `tests/package.json`
- Runs full test suite: `npm test`
- Uploads test artifacts for 30 days

**Status Badge:**
```markdown
![Tests](https://github.com/rskkinfosec/task-matrix/workflows/Test%20Suite/badge.svg)
```

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

Deploys the app to GitHub Pages after tests pass.

**Triggers:**
- Push to `main` branch only (tests must pass first)

**What it does:**
- Checks out code
- Sets up Node.js 20.x
- Runs full test suite (`npm run test:all`)
- Verifies build artifacts (index.html, manifest.json, service-worker.js)
- Deploys to `gh-pages` branch
- Publishes at: `https://rskkinfosec.github.io/TaskMatrix-PWA-iOS/`

**Excluded files in deployment:**
- `.github/` (workflows)
- `.gitignore`
- `tests/` (test files only, not deployed)
- `*.md` files (documentation)
- `*.txt` files (logs, changelogs)

## Running Tests Locally

Before pushing, run tests locally to ensure they pass:

```powershell
cd tests
npm install
npm test
```

Or run specific test suites:
```powershell
npm run test:tasks      # Task operations
npm run test:tabs       # Tab management
npm run test:sync       # Sync & merge
npm run test:scenarios  # Sync scenarios
npm run test:persistence # Data persistence
npm run test:all        # All tests
```

## Test Results

Test results are automatically uploaded as artifacts after each workflow run. View them:

1. Go to: https://github.com/rskkinfosec/task-matrix/actions
2. Click on the workflow run
3. Scroll to "Artifacts" section
4. Download `test-results-X.X` for each Node version tested

## Monitoring Deployments

After pushing to `main`:

1. **Check workflow status:** https://github.com/rskkinfosec/task-matrix/actions
2. **View live app:** https://rskkinfosec.github.io/TaskMatrix-PWA-iOS/
3. **Check service worker:** Browser DevTools > Application > Service Workers

## Troubleshooting

### Tests fail in CI but pass locally
- Check Node version differences (tests run on 18.x and 20.x)
- Ensure all dependencies in `tests/package.json` are installed
- Check for platform-specific issues (Windows vs Linux)

### Deployment fails
- Verify `index.html`, `manifest.json`, and `service-worker.js` exist
- Check GitHub Actions logs for specific error
- Ensure `GITHUB_TOKEN` has repo access (usually automatic)

### App doesn't update after deployment
- Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
- Uninstall PWA and reinstall from home screen
- Wait up to 5 minutes for CDN cache invalidation

## Best Practices

1. **Always run tests before pushing:**
   ```powershell
   npm test && git push
   ```

2. **Use meaningful commit messages:** Helps identify what broke if tests fail

3. **Test on develop branch first:** Merge to main only after tests pass

4. **Monitor test trends:** Check artifacts periodically for test coverage

5. **Keep tests updated:** Add tests for new features before implementation

## GitHub Actions Secrets

The deploy workflow uses:
- `GITHUB_TOKEN` - Automatically provided by GitHub (no setup needed)

No additional secrets are required for this setup.

## Disable/Modify Workflows

To modify workflows:
1. Edit `.github/workflows/test.yml` or `.github/workflows/deploy.yml`
2. Push to `main`
3. Changes take effect immediately

To disable a workflow:
1. Rename the file (e.g., `test.yml.disabled`)
2. Or delete it from GitHub UI
3. Or add `if: false` to job

## Future Enhancements

Possible additions:
- [ ] Code coverage reporting
- [ ] Performance benchmarks
- [ ] Visual regression testing
- [ ] Lighthouse CI for PWA metrics
- [ ] Slack notifications on failures
- [ ] Automatic version bumping
- [ ] Release notes generation

---

**Last Updated:** November 24, 2025  
**Maintained by:** TaskMatrix Team
