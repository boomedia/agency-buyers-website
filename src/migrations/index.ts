import * as migration_20250820_035858_init from './20250820_035858_init';
import * as migration_20250822_033702 from './20250822_033702';

export const migrations = [
  {
    up: migration_20250820_035858_init.up,
    down: migration_20250820_035858_init.down,
    name: '20250820_035858_init',
  },
  {
    up: migration_20250822_033702.up,
    down: migration_20250822_033702.down,
    name: '20250822_033702'
  },
];
