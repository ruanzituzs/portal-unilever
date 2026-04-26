git add frontend/package.json frontend/angular.json frontend/.npmrc vercel.json frontend/vercel.json
git commit -m "fix: remove packageManager lock, add zeroConfig false for vercel build"
git push vercel-app main --force
git push origin main
