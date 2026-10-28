import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pythonScript = path.join(__dirname, 'build-releases.py');

try {
  console.log('Running multi-platform release packager via python3...');
  execSync(`python3 "${pythonScript}"`, { stdio: 'inherit' });
} catch (err) {
  console.error('Packaging failed:', err);
  process.exit(1);
}
