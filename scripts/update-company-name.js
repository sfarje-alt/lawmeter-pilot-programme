import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, '../public/data/alerts_final.json');

// Read the file
const content = readFileSync(filePath, 'utf8');

// Replace all occurrences of "Macquarie Hospital Group" with a generic term
const updatedContent = content.replace(/Macquarie Hospital Group/g, 'the organization');

// Write back to file
writeFileSync(filePath, updatedContent, 'utf8');

console.log('Successfully updated company references in alerts_final.json');
