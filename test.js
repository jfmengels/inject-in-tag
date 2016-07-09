import test from 'ava';
import inject from './';

test('should replace the content inside a tag', t => {
  const newContent = {
    'MY-AWESOME-TAG': 'I want to break free'
  };
  const previousContent = [
    '# project',
    '',
    '<!-- MY-AWESOME-TAG:START -->FOO BAR BAZ<!-- MY-AWESOME-TAG:END -->',
    '',
    'End'
  ].join('\n');
  const expected = [
    '# project',
    '',
    '<!-- MY-AWESOME-TAG:START -->I want to break free<!-- MY-AWESOME-TAG:END -->',
    '',
    'End'
  ].join('\n');

  const result = inject(newContent, previousContent);

  t.true(result === expected);
});

test('should not replace anything if tag is not found', t => {
  const newContent = {
    'MY-AWESOME-TAG': 'I want to break free'
  };
  const previousContent = [
    '# project',
    '',
    'End'
  ].join('\n');

  const result = inject(newContent, previousContent);

  t.true(result === previousContent);
});

test('should replace multiple tags', t => {
  const newContent = {
    'MY-TAG-1': 'this is tag 1',
    'MY-TAG-2': 'this is tag 2',
    'I-AM-NOT-THERE': 'I should not appear'
  };
  const previousContent = [
    '# project',
    '',
    '<!-- MY-TAG-1:START -->FOO BAR BAZ<!-- MY-TAG-1:END -->',
    '',
    '<!-- MY-TAG-2:START -->FOO BAR BAZ<!-- MY-TAG-2:END -->',
    '',
    'End'
  ].join('\n');
  const expected = [
    '# project',
    '',
    '<!-- MY-TAG-1:START -->this is tag 1<!-- MY-TAG-1:END -->',
    '',
    '<!-- MY-TAG-2:START -->this is tag 2<!-- MY-TAG-2:END -->',
    '',
    'End'
  ].join('\n');

  const result = inject(newContent, previousContent);

  t.true(result === expected);
});

test('should be able to inject multiline content', t => {
  const newContent = {
    'MY-TAG-1': '\n\nI\nAm\nOn multiple\nlines\n\n'
  };
  const previousContent = [
    '# project',
    '',
    '<!-- MY-TAG-1:START -->FOO BAR BAZ<!-- MY-TAG-1:END -->',
    '',
    'End'
  ].join('\n');
  const expected = [
    '# project',
    '',
    '<!-- MY-TAG-1:START -->',
    '',
    'I',
    'Am',
    'On multiple',
    'lines',
    '',
    '<!-- MY-TAG-1:END -->',
    '',
    'End'
  ].join('\n');

  const result = inject(newContent, previousContent);

  t.true(result === expected);
});
