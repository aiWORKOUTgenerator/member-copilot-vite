export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    // Allow any case for subject (no strict lower-case)
    'subject-case': [0],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Subject does not have to avoid a full stop
    'subject-full-stop': [0],
    // Allow a bit longer headers, but still recommend a limit
    'header-max-length': [1, 'always', 120],
  },
};
