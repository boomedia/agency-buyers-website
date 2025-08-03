import * as migration_20250726_113914_initial from './20250726_113914_initial';
import * as migration_20250801_055635 from './20250801_055635';

export const migrations = [
  {
    up: migration_20250726_113914_initial.up,
    down: migration_20250726_113914_initial.down,
    name: '20250726_113914_initial',
  },
  {
    up: migration_20250801_055635.up,
    down: migration_20250801_055635.down,
    name: '20250801_055635'
  },
];
