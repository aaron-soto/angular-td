export const CELL_TYPE = {
  ENEMY_BASE: 'enemy-base',
  PLAYER_BASE: 'player-base',
  TOWER: 'tower',
};

export enum COLORS {
  DEEP_PURPLE = '#5e315b',
  SOFT_CRIMSON = '#8c3f5d',
  WARM_ROSE = '#ba6156',
  SUNNY_ORANGE = '#f2a65e',
  LIGHT_SUNSHINE = '#ffe478',
  FRESH_LIME = '#cfff70',
  LIGHT_GREEN = '#8fde5d',
  FOREST_GREEN = '#3ca370',
  OCEAN_BLUE = '#3d6e70',
  MIDNIGHT_BLUE = '#323e4f',
  VIOLET_DARK = '#322947',
  INDIGO_DUSK = '#473b78',
  AZURE_SKY = '#4b5bab',
  BRIGHT_BLUE = '#4da6ff',
  AQUA_LIGHT = '#66ffe3',
  PALE_IVORY = '#ffffeb',
  CLOUDY_GREY = '#c2c2d1',
  STORMY_GREY = '#7e7e8f',
  TWILIGHT_GREY = '#606070',
  SHADOW_GREY = '#43434f',
  NIGHT_BLACK = '#272736',
  DARK_MAGENTA = '#3e2347',
  RICH_MAROON = '#57294b',
  REDDISH_BROWN = '#964253',
  CORAL_RED = '#e36956',
  GOLDEN_SUNSET = '#ffb570',
  PEACHY_ORANGE = '#ff9166',
  TOMATO_RED = '#eb564b',
  BERRY_RED = '#b0305c',
  PLUM_PURPLE = '#73275c',
  DARK_ORCHID = '#422445',
  MAJESTIC_PURPLE = '#5a265e',
  ROYAL_MAGENTA = '#80366b',
  VIBRANT_PINK = '#bd4882',
  SOFT_PINK = '#ff6b97',
  BLUSHING_ROSE = '#ffb5b5',
  PURE_BLACK = '#000000',
}

export const Towers = [
  {
    name: 'Laser Tower',
    id: 'laser',
    type: CELL_TYPE.TOWER,
    cost: 100,
    damage: 10,
    range: 100,
    fireRate: 1,
    color: COLORS.SOFT_CRIMSON,
    attackSpeed: 3000,
    shootingCooldown: 0,
    lastShotTime: 0,
  },
  {
    name: 'Missile Tower',
    id: 'missile',
    type: CELL_TYPE.TOWER,
    cost: 150,
    damage: 20,
    range: 150,
    fireRate: 2,
    color: COLORS.AZURE_SKY,
    attackSpeed: 7000,
    shootingCooldown: 0,
    lastShotTime: 0,
  },
  {
    name: 'Cannon Tower',
    id: 'cannon',
    type: CELL_TYPE.TOWER,
    cost: 200,
    damage: 30,
    range: 200,
    fireRate: 3,
    color: COLORS.TOMATO_RED,
    attackSpeed: 13000,
    shootingCooldown: 0,
    lastShotTime: 0,
  },
  {
    name: 'Sniper Tower',
    id: 'sniper',
    type: CELL_TYPE.TOWER,
    cost: 250,
    damage: 40,
    range: 250,
    fireRate: 3,
    color: COLORS.FOREST_GREEN,
    attackSpeed: 10000,
    shootingCooldown: 0,
    lastShotTime: 0,
  },
  {
    name: 'Machine Gun Tower',
    id: 'machine-gun',
    type: CELL_TYPE.TOWER,
    cost: 300,
    damage: 5,
    range: 100,
    fireRate: 5,
    color: COLORS.MIDNIGHT_BLUE,
    attackSpeed: 2000,
    shootingCooldown: 0,
    lastShotTime: 0,
  },
  {
    name: 'Flame Thrower Tower',
    id: 'flame-thrower',
    type: CELL_TYPE.TOWER,
    cost: 350,
    damage: 15,
    range: 100,
    fireRate: 1,
    color: COLORS.VIBRANT_PINK,
    attackSpeed: 3000,
    shootingCooldown: 0,
    lastShotTime: 0,
  },
];

export interface Tower extends Cell {
  name: string;
  id: string;
  cost: number;
  damage: number;
  range: number;
  fireRate: number;
}

export interface Cell {
  type: 'enemy-base' | 'player-base' | 'tower';
  name: string;
  color: string;
}

export interface BaseCamp extends Cell {
  health: number;
}
