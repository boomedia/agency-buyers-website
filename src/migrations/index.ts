import * as migration_20250804_075330_fix_column_names from './20250804_075330_fix_column_names';

export const migrations = [
  {
    up: migration_20250804_075330_fix_column_names.up,
    down: migration_20250804_075330_fix_column_names.down,
    name: '20250804_075330_fix_column_names'
  },
];
