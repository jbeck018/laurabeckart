import * as migration_20260401_212212 from './20260401_212212';

export const migrations = [
  {
    up: migration_20260401_212212.up,
    down: migration_20260401_212212.down,
    name: '20260401_212212'
  },
];
