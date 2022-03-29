#!/usr/bin/env node
import { Command } from 'commander';
import { writeFileSync } from 'fs';
import compareFiles from '../src/gendiff-index.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2) => {
    /* const actualStylish = readFileSync('__fixtures__/result_plain.txt', 'utf-8');
    console.log(actualStylish); */
    console.log(compareFiles(filepath1, filepath2, program.opts().format));
    // writeFileSync('__fixtures__/result_plain1.txt', compareFiles(filepath1, filepath2, program.opts().format));
  });

program.parse(process.argv);
