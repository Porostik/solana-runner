// apps/web/scripts/sync-idl.mjs
import fs from 'node:fs';
import path from 'node:path';

const program = process.argv[2]; // имя программы: runner
if (!program) {
  console.error('Usage: node scripts/sync-idl.mjs <programName>');
  process.exit(1);
}

// абсолютные пути под себя подправь:
const SRC = path.resolve(process.cwd(), 'target/idl', `${program}.json`);
const DST = path.resolve(process.cwd(), 'src/idl', `${program}.json`);

if (!fs.existsSync(SRC)) {
  console.error(
    `IDL not found: ${SRC}. Did you run "anchor build -p ${program}"?`
  );
  process.exit(1);
}

fs.mkdirSync(path.dirname(DST), { recursive: true });
const src = fs.readFileSync(SRC, 'utf8');

// чтобы не «засорять» git — копируем только если изменилось
const old = fs.existsSync(DST) ? fs.readFileSync(DST, 'utf8') : '';
if (old !== src) {
  fs.writeFileSync(DST, src);
  console.log(`IDL updated -> ${DST}`);
} else {
  console.log('IDL is up to date');
}
