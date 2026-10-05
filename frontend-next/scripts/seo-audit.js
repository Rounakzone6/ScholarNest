const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

// 1. Check for layout.js and page.js metadata
function checkMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('export const metadata') && !content.includes('export async function generateMetadata')) {
    errors.push(`Missing metadata export in ${filePath}`);
  }
}

// 2. Check for Robots.txt and Sitemap.js
function checkCoreFiles() {
  const appDir = path.join(__dirname, '../src/app');
  
  if (!fs.existsSync(path.join(appDir, 'robots.js')) && !fs.existsSync(path.join(appDir, 'robots.ts'))) {
    errors.push('Missing robots.js/ts configuration');
  }
  
  if (!fs.existsSync(path.join(appDir, 'sitemap.js')) && !fs.existsSync(path.join(appDir, 'sitemap.ts'))) {
    errors.push('Missing dynamic sitemap.js/ts configuration');
  }
}

// 3. Scan all page.js files
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath);
    } else if (file === 'page.js' || file === 'page.jsx' || file === 'page.tsx') {
      checkMetadata(fullPath);
      
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('"use client"')) {
        warnings.push(`Client component used for page route: ${fullPath} (Consider Server Components for SEO)`);
      }
      
      if (!content.includes('<h1>') && !content.includes('<h1')) {
        warnings.push(`No <h1> tag found in ${fullPath}`);
      }
    }
  }
}

console.log('🔍 Starting ScholarNest Technical SEO Audit...\n');

checkCoreFiles();
scanDirectory(path.join(__dirname, '../src/app'));

if (errors.length > 0) {
  console.error('❌ SEO Audit Failed with Critical Errors:');
  errors.forEach(e => console.error(`  - ${e}`));
} else {
  console.log('✅ All Core SEO Requirements Met.');
}

if (warnings.length > 0) {
  console.warn('\n⚠️  SEO Warnings (Action Recommended):');
  warnings.forEach(w => console.warn(`  - ${w}`));
} else {
  console.log('✅ No SEO Warnings.');
}

if (errors.length > 0) process.exit(1);
process.exit(0);
