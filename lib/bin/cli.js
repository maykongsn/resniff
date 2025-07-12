#!/usr/bin/env node

import { analyzeProject } from '../index.js';

const input = process.argv[2] ?? null;

input
  ? analyzeProject(input)
    .then((results) => {
      console.log(`\nSmells found:\n`)
      results.forEach((r) =>
        console.log(`• ${r.type} in ${r.file} (method: ${r.method})`)
      )
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    })
  : (console.error('Please provide the path to a ReScript project.'), process.exit(1));
