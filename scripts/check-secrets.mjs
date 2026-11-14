import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean);

const rules = [
  {
    name: 'known credential prefix',
    expression:
      /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16})\b/g,
  },
  {
    name: 'browser-exposed privileged environment variable',
    expression: /\bVITE_(?:EARTHDATA_TOKEN|SUPABASE_SERVICE_ROLE_KEY)\s*=/g,
  },
  {
    name: 'populated privileged environment variable',
    expression:
      /\b(?:EARTHDATA_TOKEN|SUPABASE_SERVICE_ROLE_KEY)\s*=[ \t]*(?!$|#)/gm,
  },
];

const findings = [];

for (const file of trackedFiles) {
  const content = readFileSync(file);
  if (content.includes(0)) continue;

  const text = content.toString('utf8');
  for (const { name, expression } of rules) {
    expression.lastIndex = 0;
    let match;
    while ((match = expression.exec(text))) {
      const line = text.slice(0, match.index).split('\n').length;
      findings.push(`${file}:${line}: ${name}`);
    }
  }
}

if (findings.length > 0) {
  console.error('Potential secrets or unsafe environment variables found:');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log(`Secret scan passed: ${trackedFiles.length} tracked files checked.`);
