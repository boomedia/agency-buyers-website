import * as migration_20250820_035858_init from './20250820_035858_init';

export const migrations = [
  {
    up: migration_20250820_035858_init.up,
    down: migration_20250820_035858_init.down,
    name: '20250820_035858_init'
  },
];
