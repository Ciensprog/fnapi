export enum Worlds {
  // Base
  Stonewood = '33A2311D4AE64B361CCE27BC9F313C8B',
  Plankerton = 'D477605B4FA48648107B649CE97FCF27',
  CannyValley = 'E6ECBD064B153234656CB4BDE6743870',
  TwinePeaks = 'D9A801C5444D1C74D1B7DAB5C7C12C5B',

  StormKingsDomain = '0C92E7904E00C6C93406BB9C26ACD2B0',

  // Events
  Dungeons = '394D85EF40B2BF401E6F32B587D7672B',
  VisitTheCrater = '21726CDB473D7BD46C9643AA71DB4C6A',

  // Ventures
  BlastedBadlands = '25D86CC64F0F3EE1831CFD9B2DF6D68C',
  FlannelFalls = 'FF97186D4741CB5F2A980BB0164081D4',
  FrozenFjords = 'D61659064BED28BEA91FD2A343C126B7',
  Hexsylvania = 'DBB6E92A4EDE30B76C94C7BA3852C473',
  ScurvyShoals = '243870C643F8611F25D24287814E1DA4',

  // Extras
  PerfMem = '67EDCFE942260C290B369BA7AA70A0D5',
  Tutorial = '8633333E41A86F67F78EAEAF25BF4735',
}

export enum StormKingZones {
  CannyValley = 'Hard_Zone5_Dudebro',
  TwinePeaks = 'Nightmare_Zone10_Dudebro',
}

export enum Biomes {
  CriticalMission = 'CriticalMission',
  TheOutpost_PvE_01 = 'TheOutpost_PvE_01',
  TheOutpost_PvE_02 = 'TheOutpost_PvE_02',
  TheOutpost_PvE_03 = 'TheOutpost_PvE_03',
  TheOutpost_PvE_04 = 'TheOutpost_PvE_04',

  GhostTown_HighNoon = 'GhostTown_HighNoon',
  GhostTown = 'GhostTown',

  // Tropical zone
  Island = 'Island',

  Lakeside = 'Lakeside',

  TheForest = 'TheForest',

  Route99_Bunker = 'Route99_Bunker',
  Route99_Landmark = 'Route99_Landmark',
  Route99 = 'Route99',

  TheGrasslands_Mansion = 'TheGrasslands_Mansion',
  TheGrasslands = 'TheGrasslands',

  TheCity_Arid = 'TheCity_Arid',
  TheCity = 'TheCity',

  TheIndustrialPark_Arid = 'TheIndustrialPark_Arid',
  TheIndustrialPark = 'TheIndustrialPark',

  TheSuburbs_Arid = 'TheSuburbs_Arid',
  TheSuburbs = 'TheSuburbs',

  Desert_Bunker = 'Desert_Bunker',
  Desert_DeployProbe = 'Desert_DeployProbe',
  Desert_Monument = 'Desert_Monument',
  Desert = 'Desert',
  TheDesert = 'TheDesert',

  // Storm King

  DUDEBRO_HARD = 'DUDEBRO_HARD',
  DUDEBRO = 'DUDEBRO',

  // Quests

  LongWayHome = 'LongWayHome',
  PlankHarbor = 'PlankHarbor',
  StabilizeTheRift = 'StabilizeTheRift',
  BuildOff = 'BuildOff',
  Onboarding_Forest = 'Onboarding_Forest',
  Onboarding_Grasslands = 'Onboarding_Grasslands',
  Onboarding_Suburban = 'Onboarding_Suburban',
  Onboarding_Fort = 'Onboarding_Fort',
  VindermansLab = 'VindermansLab',
  TRV_HF = 'TRV_HF', // /STW_Zones/World/ZoneThemes/Spooky/BP_ZT_TRV_HF.BP_ZT_TRV_HF_C
  Water = 'Water',

  Homebase_02 = 'Homebase_02',
  Homebase_03 = 'Homebase_03',
  Homebase_05 = 'Homebase_05',
  Homebase_06 = 'Homebase_06',
  Homebase_07 = 'Homebase_07',

  // Dungeons

  Starlight_D1 = 'Starlight_D1',
  Starlight_D2 = 'Starlight_D2',
  Starlight_D3 = 'Starlight_D3',
  Starlight_D4 = 'Starlight_D4',
  Starlight_D5_Science = 'Starlight_D5_Science',

  // Extra

  PerfMem = 'PerfMem',
}

export enum WorldModifiers {
  FireStorm = 'elementalzonefireenableitem',
  NatureStorm = 'elementalzonenatureenableitem',
  IceStorm = 'elementalzonewaterenableitem',

  ExplodingDeathbomb = 'gm_basehusk_ondeath_explode',
  MetalCorrosion = 'gm_basehusk_ondmgdealt_metalcorrosion',
  UnchartedEnemies = 'gm_enemy_hideonminimap',
  FrenziedDeathburst = 'gm_enemy_ondeath_applyspeedmods',
  HealingDeathburst = 'gm_enemy_ondeath_areaheal',
  AcidPools = 'gm_enemy_ondeath_spawndamagepool',
  SmokeScreens = 'gm_enemy_ondeath_spawnenemyrangeresistpool',
  SlowingPools = 'gm_enemy_ondeath_spawnplayerslowpool',
  SlowingAttacks = 'gm_enemy_ondmgdealt_slowdownfoe',
  LifeLeechAttacks = 'gm_enemy_ondmgdealt_lifeleech',
  Quickened = 'gm_enemy_ondmgreceived_speedbuff',
  WallWeakening = 'gm_enemy_onhitweakenbuildings',
  EpicMiniBoss = 'minibossenableprimarymissionitem',

  BuildingConstructors = 'gm_constructor_buildcost_buff',
  AdeptConstructors = 'gm_constructor_damage_buff',
  FocusedNinjas = 'gm_ninja_abilityrate_buff',
  AdeptNinjas = 'gm_ninja_damage_buff',
  LeapingNinjas = 'gm_ninja_jumpheight_buff',
  SwordNinjas = 'gm_ninja_sword_damagebuff',
  AdeptOutlander = 'gm_outlander_damage_buff',
  UpgradedOutlanders = 'gm_outlander_tech_buff',
  WellDrilledSoldiers = 'gm_soldier_abilityrate_buff',
  HeadshotSoldiers = 'gm_soldier_assaultrifle_buff',
  AdepSoldier = 'gm_soldier_damage_buff',
  AdeptAbilities = 'gm_hero_tech_buff',
  PowerfulTraps = 'gm_trap_buff',

  PowerfulAssaultRiffles = 'gm_player_assaultrifle_damage_buff',
  PowerfulAxesAndScythes = 'gm_player_axesscythesdamage_buff',
  PowerfulClubsAndHardware = 'gm_player_bluntdamage_buff',
  PowerfulEnergyAttacks = 'gm_player_energy_damagebuff',
  PowerfulExplosives = 'gm_player_explosive_damagebuff',
  KnockbackMeleeAttacks = 'gm_player_meleeknockback_buff',
  MeleeLifeLeech = 'gm_player_ondmgdealt_lifeleech',
  ConcussiveShieldbreak = 'gm_player_onshielddestroyed_aoe',
  PowerfulPistols = 'gm_player_pistol_damagebuff',
  PowerfulShotguns = 'gm_player_shotgun_damagebuff',
  PowerfulSMGs = 'gm_player_smg_damage_buff',
  PowerfulSniperRifles = 'gm_player_sniperrifle_damagebuff',
  PowerfulSwordsAndSpears = 'gm_player_spearsworddamage_buff',
}

export const worldPowerLevels = {
  [Worlds.Stonewood]: {
    Start_Zone1: 1,
    Start_Zone2: 3,
    Start_Zone3: 5,
    Start_Zone4: 9,
    Start_Zone5: 15,
    Normal_Zone1: 19,
  },
  [Worlds.Plankerton]: {
    Normal_Zone1: 19,
    Normal_Zone2: 23,
    Normal_Zone3: 28,
    Normal_Zone4: 34,
    Normal_Zone5: 40,
    Hard_Zone1: 46,
  },
  [Worlds.CannyValley]: {
    Hard_Zone1: 46,
    Hard_Zone2: 52,
    Hard_Zone3: 58,
    Hard_Zone4: 64,
    Hard_Zone5: 70,
  },
  [Worlds.TwinePeaks]: {
    Nightmare_Zone1: 76,
    Nightmare_Zone2: 82,
    Nightmare_Zone3: 88,
    Nightmare_Zone4: 94,
    Nightmare_Zone5: 100,
    Endgame_Zone1: 108,
    Endgame_Zone2: 116,
    Endgame_Zone3: 124,
    Endgame_Zone4: 132,
    Endgame_Zone5: 140,
    Endgame_Zone6: 160,
  },
  ventures: {
    Phoenix_Zone02: 3,
    Phoenix_Zone03: 5,
    Phoenix_Zone05: 15,
    Phoenix_Zone07: 23,
    Phoenix_Zone09: 34,
    Phoenix_Zone11: 46,
    Phoenix_Zone13: 58,
    Phoenix_Zone15: 70,
    Phoenix_Zone17: 82,
    Phoenix_Zone19: 94,
    Phoenix_Zone21: 108,
    Phoenix_Zone23: 124,
    Phoenix_Zone25: 140,
  },
} as const

export const availableWorlds: Array<string> = [
  Worlds.Stonewood,
  Worlds.Plankerton,
  Worlds.CannyValley,
  Worlds.TwinePeaks,

  Worlds.BlastedBadlands,
  Worlds.FlannelFalls,
  Worlds.Hexsylvania,
  Worlds.ScurvyShoals,
  Worlds.FrozenFjords,
]

export const availableBiomes: Array<string> = [
  Biomes.CriticalMission,
  Biomes.TheOutpost_PvE_01,
  Biomes.TheOutpost_PvE_02,
  Biomes.TheOutpost_PvE_03,
  Biomes.TheOutpost_PvE_04,

  Biomes.GhostTown_HighNoon,
  Biomes.GhostTown,

  Biomes.Island,

  Biomes.Lakeside,

  Biomes.TheForest,

  Biomes.Route99_Bunker,
  Biomes.Route99_Landmark,
  Biomes.Route99,

  Biomes.TheGrasslands_Mansion,
  Biomes.TheGrasslands,

  Biomes.TheCity_Arid,
  Biomes.TheCity,

  Biomes.TheIndustrialPark_Arid,
  Biomes.TheIndustrialPark,

  Biomes.TheSuburbs_Arid,
  Biomes.TheSuburbs,

  Biomes.Desert_Bunker,
  Biomes.Desert_DeployProbe,
  Biomes.Desert_Monument,
  Biomes.Desert,
  Biomes.TheDesert,

  Biomes.DUDEBRO_HARD,
  Biomes.DUDEBRO,

  Biomes.LongWayHome,
  Biomes.PlankHarbor,
  Biomes.StabilizeTheRift,
  Biomes.BuildOff,
  Biomes.Onboarding_Forest,
  Biomes.Onboarding_Grasslands,
  Biomes.Onboarding_Suburban,
  Biomes.Onboarding_Fort,
  Biomes.VindermansLab,
  Biomes.TRV_HF,
  Biomes.Water,

  Biomes.Homebase_02,
  Biomes.Homebase_03,
  Biomes.Homebase_05,
  Biomes.Homebase_06,
  Biomes.Homebase_07,

  Biomes.Starlight_D1,
  Biomes.Starlight_D2,
  Biomes.Starlight_D3,
  Biomes.Starlight_D4,
  Biomes.Starlight_D5_Science,

  Biomes.PerfMem,
]

export const zoneCategories = {
  quest: [
    '1stTrapTheStorm',
    'BuildOff',
    'Day1_C',
    'Day18257',
    'DeployTheProbe',
    'DtM',
    'FightTheGunslinger',
    'HotelHuskEscape',
    'Kidnapped',
    'Landmark',
    'MerryHellMaze',
    'PlankHarbor3Gate',
    'PtS',
    'StabilizeTheRift',
    'StC',
    'StormQuest2018Landmark',
    'VindermanMansion',
    'WatchTheSkies',

    // Blockbuster
    'TestTheSuit',

    // Ventures related
    'FinalFrontier',
    'FinalRehearsal',

    // Pirate season related (EventFlag.Phoenix.Adventure)
    'AdventureRevenge',
    'Yarrr',
  ],
  atlas: ['1Gate', 'Cat1FtS', 'GateSingle'],
  'atlas-c2': ['2Gates'],
  'atlas-c3': ['3Gates'],
  'atlas-c4': ['4Gates'],
  dtb: ['DtB'],
  dte: ['DestroyTheEncampments', 'DtE'],
  eac: ['EliminateAndCollect'],
  ets: ['EtS_C', 'EtShelter', 'EvacuateTheSurvivors'],
  'mini-boss': ['DUDEBRO'],
  htm: ['HTM_C'], // Haunt The Titan (Beta Storm)
  htr: ['HitTheRoad', 'Mayday'],
  ptp: ['ProtectThePresents'],
  radar: ['BuildtheRadarGrid'],
  refuel: ['RefuelTheBase'],
  rescue: ['EtSurvivors'],
  resupply: ['Resupply'],
  rocket: ['LtR'],
  rtd: ['RetrieveTheData', 'RtD'],
  rtl: ['LaunchTheBalloon', 'LtB', 'RideTheLightning', 'RtL'],
  rts: ['PowerTheStormShield', 'RtS'],
  stn: ['SurviveTheNight'],
  'storm-shield': ['Outpost'],
  tts: ['TrapTheStorm'],
}
