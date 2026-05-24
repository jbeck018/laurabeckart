import * as migration_20260401_212212 from './20260401_212212';
import * as migration_20260524_183053_add_media_fields from './20260524_183053_add_media_fields';
import * as migration_20260524_190044_add_artwork_flags_and_fulfillments from './20260524_190044_add_artwork_flags_and_fulfillments';

export const migrations = [
  {
    up: migration_20260401_212212.up,
    down: migration_20260401_212212.down,
    name: '20260401_212212',
  },
  {
    up: migration_20260524_183053_add_media_fields.up,
    down: migration_20260524_183053_add_media_fields.down,
    name: '20260524_183053_add_media_fields',
  },
  {
    up: migration_20260524_190044_add_artwork_flags_and_fulfillments.up,
    down: migration_20260524_190044_add_artwork_flags_and_fulfillments.down,
    name: '20260524_190044_add_artwork_flags_and_fulfillments'
  },
];
