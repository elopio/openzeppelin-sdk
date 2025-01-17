#!/usr/bin/env node

import program from '../../src/bin/program';
import { writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';
import path from 'path';

const outputPath = '../docs/modules/api';

function render(cmd) {
  const description = cmd.description() || '';
  const options = cmd.options.map(o => `\`${o.flags}\`:: ${o.description}`).join('\n');

  return `\
[[${cmd.name()}]]
== ${cmd.name()}

Usage: \`${cmd.name()} ${cmd.usage()}\`

${description}

${options}
`;
}

function run() {
  ensureDirSync(outputPath);
  ensureDirSync(path.join(outputPath, 'pages'));

  const main = render(program);

  const cmds = program.commands
    // TODO: remove filtering status command before next major release
    .filter(command => command.name() !== 'status')
    .map(render);

  const docs = [main, ...cmds].join('\n');

  writeFileSync(path.resolve(outputPath, 'pages/cli.adoc'), docs);
}

run();
console.log(`Docs generated in ${path.resolve(outputPath)}`);
