// One-off mechanical conversion: explicit text components, no document traversal at runtime.
import ts from 'typescript';
import { readFileSync, writeFileSync } from 'node:fs';
const files = process.argv.slice(2);
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const visit = (node) => {
    if (ts.isJsxText(node) && /[А-Яа-яЁё]/u.test(node.text)) {
      const value = node.text.replace(/\s+/g, ' ').trim();
      edits.push({
        start: node.pos,
        end: node.end,
        value: `<LocalizedText>{${JSON.stringify(value)}}</LocalizedText>`,
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  if (!edits.length) continue;
  let result = source;
  for (const edit of edits.sort((a, b) => b.start - a.start))
    result = result.slice(0, edit.start) + edit.value + result.slice(edit.end);
  const insert = source.startsWith("'use client';") ? "'use client';".length : 0;
  result =
    result.slice(0, insert) +
    "\nimport { LocalizedText } from '@/features/i18n';\n" +
    result.slice(insert);
  writeFileSync(file, result);
}
