// scripts/ingest_resources.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// Target Directories
const RAW_DIR = path.join(__dirname, '..', 'data', 'raw');
const REPOS_DIR = path.join(RAW_DIR, 'repos');
const BOOKS_DIR = path.join(RAW_DIR, 'books');
const BLOGS_DIR = path.join(RAW_DIR, 'blogs');

// 1. Repositories list for shallow cloning
const REPOSITORIES = [
  { name: 'every-programmer-should-know', url: 'https://github.com/mtdvio/every-programmer-should-know.git' },
  { name: 'ai-engineering-from-scratch', url: 'https://github.com/rohitg00/ai-engineering-from-scratch.git' },
  { name: 'awesome-sre', url: 'https://github.com/dastergon/awesome-sre.git' },
  { name: 'professional-programming', url: 'https://github.com/charlax/professional-programming.git' }
];

// 2. Public educational articles & books for scraping
const RESOURCES = [
  // Google SRE Book Chapters
  {
    category: 'books/google-sre',
    filename: 'introduction.html',
    url: 'https://sre.google/sre-book/introduction/'
  },
  {
    category: 'books/google-sre',
    filename: 'monitoring.html',
    url: 'https://sre.google/sre-book/monitoring-distributed-systems/'
  },
  {
    category: 'books/google-sre',
    filename: 'cascading-failures.html',
    url: 'https://sre.google/sre-book/addressing-cascading-failures/'
  },
  // Key Engineering Outage / Architecture Blogs
  {
    category: 'blogs',
    filename: 'stripe-idempotency.html',
    url: 'https://stripe.com/blog/idempotency'
  },
  {
    category: 'blogs',
    filename: 'discord-scylldadb.html',
    url: 'https://discord.com/blog/how-discord-stores-billions-of-messages'
  }
];

// Helper to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Download URL helper
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', err => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function startIngestion() {
  console.log("=== STARTING KNOWLEDGE LAKE INGESTION ===");
  
  // Create base raw folders
  ensureDir(REPOS_DIR);
  ensureDir(BOOKS_DIR);
  ensureDir(BLOGS_DIR);

  // 1. Clone Repositories (Shallow clone depth 1 to save space and time)
  console.log("\n--- Phase 1: Shallow Cloning Git Repositories ---");
  for (const repo of REPOSITORIES) {
    const targetPath = path.join(REPOS_DIR, repo.name);
    if (fs.existsSync(targetPath)) {
      console.log(`[Repo] ${repo.name} already exists. Skipping.`);
      continue;
    }

    console.log(`[Repo] Cloning ${repo.name} (shallow)...`);
    try {
      execSync(`git clone --depth 1 ${repo.url} "${targetPath}"`, { stdio: 'inherit' });
      console.log(`[Repo] Successfully cloned ${repo.name}.`);
    } catch (err) {
      console.error(`[Repo] [ERROR] Failed to clone ${repo.name}:`, err.message);
    }
  }

  // 2. Download / Scrape Web Documents
  console.log("\n--- Phase 2: Downloading Web Books and Blogs ---");
  for (const resource of RESOURCES) {
    const categoryDir = path.join(RAW_DIR, resource.category);
    ensureDir(categoryDir);
    const destPath = path.join(categoryDir, resource.filename);

    if (fs.existsSync(destPath)) {
      console.log(`[Resource] ${resource.filename} already exists. Skipping.`);
      continue;
    }

    console.log(`[Resource] Downloading ${resource.filename} from ${resource.url}...`);
    try {
      await downloadFile(resource.url, destPath);
      console.log(`[Resource] Successfully downloaded ${resource.filename}.`);
    } catch (err) {
      console.error(`[Resource] [ERROR] Failed to download ${resource.filename}:`, err.message);
    }
  }

  console.log("\n=== KNOWLEDGE LAKE INGESTION SUMMARY ===");
  console.log("Git Repos Cloned in:", REPOS_DIR);
  console.log("Static Books Scraped in:", BOOKS_DIR);
  console.log("Engineering Blogs in:", BLOGS_DIR);
  console.log("=========================================");
}

startIngestion().catch(console.error);
