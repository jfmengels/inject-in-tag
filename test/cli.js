import test from 'ava';
import pify from 'pify';
import fs from 'fs-extra';
import tempfile from 'tempfile';

import cli from '../cli';

const copyP = pify(fs.copy);
const removeP = pify(fs.remove);
const readFileP = pify(fs.readFile);

const expectedContent1 = [
  '# project',
  '',
  '<!-- MY-TAG:START -->my tag content<!-- MY-TAG:END -->',
  '',
  '## Description',
  '',
  '<!-- THAT-TAG:START -->that tag content<!-- THAT-TAG:END -->',
  '',
  'END',
  ''
].join('\n');

const expectedContent2 = [
  '# project',
  '',
  '<!-- THAT-TAG:START -->that tag content<!-- THAT-TAG:END -->',
  '',
  'END',
  ''
].join('\n');

test('should inject the values from a resource file that directly exports data into a file', async t => {
  const file = tempfile('.md');

  await copyP('./fixtures/markdown-base-1.md', file);
  await cli('../test/fixtures/resource-direct-export', [file]);

  const content = await readFileP(file, 'utf8');

  await removeP(file);

  t.is(content, expectedContent1);
});

test('should inject the values from a resource file that exports a Promise into a file', async t => {
  const file = tempfile('.md');

  await copyP('./fixtures/markdown-base-1.md', file);
  await cli('../test/fixtures/resource-promise', [file]);

  const content = await readFileP(file, 'utf8');

  await removeP(file);

  t.is(content, expectedContent1);
});

test('should inject the values from a resource file into multiple files', async t => {
  const tempfile1 = tempfile('.md');
  const tempfile2 = tempfile('.md');

  await Promise.all([
    copyP('./fixtures/markdown-base-1.md', tempfile1),
    copyP('./fixtures/markdown-base-2.md', tempfile2)
  ]);

  await cli('../test/fixtures/resource-direct-export', [tempfile1, tempfile2]);

  const [content1, content2] = await Promise.all([
    readFileP(tempfile1, 'utf8'),
    readFileP(tempfile2, 'utf8')
  ]);

  await Promise.all([
    removeP(tempfile1),
    removeP(tempfile2)
  ]);

  t.is(content1, expectedContent1);
  t.is(content2, expectedContent2);
});

test('should throw if no resource file is given', async t => {
  t.throws(
    () => cli(),
    'Expected a resource file as first argument'
  );
});

test('should throw if no files are given', async t => {
  t.throws(
    () => cli('../test/fixtures/resource-direct-export'),
    'Expected at least one file to inject content into'
  );
});

test('should throw if files is an empty array', async t => {
  t.throws(
    () => cli('../test/fixtures/resource-direct-export'),
    'Expected at least one file to inject content into'
  );
});
