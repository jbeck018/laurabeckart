import * as migration_20260401_212212 from './20260401_212212';
import * as migration_20260524_183053_add_media_fields from './20260524_183053_add_media_fields';

export const migrations = [
  {
    up: migration_20260401_212212.up,
    down: migration_20260401_212212.down,
    name: '20260401_212212',
  },
  {
    up: migration_20260524_183053_add_media_fields.up,
    down: migration_20260524_183053_add_media_fields.down,
    name: '20260524_183053_add_media_fields'
  },
];
