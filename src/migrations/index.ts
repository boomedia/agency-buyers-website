import * as migration_20250803_234643_fresh_start from './20250803_234643_fresh_start'

export const migrations = [
  {
    up: migration_20250803_234643_fresh_start.up,
    down: migration_20250803_234643_fresh_start.down,
    name: '20250803_234643_fresh_start',
  },
]
