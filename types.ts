
export enum CoolingType {
  AIR = 'Воздушное',
  OIL = 'Масляное',
  LIQUID = 'Жидкостное'
}

export enum StrokeType {
  TWO = '2Т',
  FOUR = '4Т'
}

export enum EngineBrand {
  YX = 'YX',
  ZONGSHEN = 'Zongshen',
  LIFAN = 'Lifan',
  LONCIN = 'Loncin',
  DAYTONA = 'Daytona',
  NC = 'NC Series',
  CB = 'CB/CBB Series',
  CG = 'CG Series',
  SHINERAY = 'Shineray',
  GENERIC = 'Generic China',
  HONDA = 'Honda',
  YAMAHA = 'Yamaha',
  KAWASAKI = 'Kawasaki',
  SUZUKI = 'Suzuki',
  FANTIC = 'Fantic'
}

export type EngineStatus = 'pending' | 'approved' | 'rejected';

export enum BreakdownCategory {
  TIMING = 'ГРМ',
  PISTON = 'ЦПГ',
  GEARBOX = 'КПП',
  CLUTCH = 'Сцепление',
  STARTER = 'Стартер',
  FUEL = 'Система питания',
  OVERHEAT = 'Перегрев',
  ELECTRIC = 'Электрика'
}

export interface ReliabilityReport {
  id: string;
  engineId: string;
  userId: string;
  mileage: number; // км или м.ч.
  mileageUnit: 'km' | 'h';
  usageStyle: 'Спокойный' | 'Любительский' | 'Жёсткий / Спорт';
  usageType: 'Эндуро' | 'Кросс' | 'Питбайк' | 'Смешанный';
  hasBreakdowns: boolean;
  breakdownCategories: BreakdownCategory[];
  description: string;
  maintenanceRating: number; // 1-5
  createdAt: string;
}

export interface Build {
  id: string;
  userId: string;
  userName: string;
  name: string;
  engineId: string;
  frame: string;
  carburetor: string;
  exhaust: string;
  gears: string; // Напр: 13/43
  description: string;
  photos: string[]; // Base64 or URLs
  likes: string[]; // User IDs
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  targetId: string; // Build ID or Engine ID
  text: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  type: 'NEW_BUILD' | 'UPDATE_MILEAGE' | 'NEW_REPORT';
  targetId: string;
  targetName: string;
  timestamp: string;
}

export interface AIPrediction {
  riskLevel: 'Низкий' | 'Средний' | 'Высокий';
  riskScore: number; // 0-100
  potentialIssues: {
    category: BreakdownCategory;
    probability: number;
    mileageWindow: string;
    reason: string;
  }[];
  personalAdvice: string;
  maintenanceForecast: string;
  dataConfidence: number;
}

export interface EngineStats {
  engineId: string;
  engineName: string;
  brand: EngineBrand;
  ownersCount: number;
  buildsCount: number;
  avgMileageToFailure: number;
  failureRate: number; // %
  topFailureReason: BreakdownCategory | 'Нет данных';
  reliabilityScore: number; // 0-100
  popularityScore: number; // 0-100
}

export interface Engine {
  id: string;
  name: string;
  index: string;
  brand: EngineBrand;
  volume: number;
  stroke: StrokeType;
  cooling: CoolingType;
  power: number;
  torque: number;
  valves: number;
  timingType: string;
  fuelSystem: string;
  bestFor: ('Питбайк' | 'Эндуро' | 'Кросс' | 'Универсал' | 'Мотард')[];
  resource: number; 
  tuningPotential: number;
  maintenanceDifficulty: number;
  priceCategory: 'Бюджет' | 'Средний' | 'Премиум';
  pros: string[];
  cons: string[];
  commonIssues: string[];
  maintenanceTips: string[];
  compatibleFrames: string;
  commonBikes: string[];
  description: string;
  images: any[];
  originCountry: 'Китай' | 'Япония' | 'Европа' | 'Тайвань';
  designOrigin: 'Оригинал' | 'Лицензия' | 'Копия' | 'Модернизация';
  status?: EngineStatus;
  authorId?: string;
  createdAt?: string;
  reliabilityIndex?: number;
  reportsCount?: number;
  moderatorComment?: string;
  views?: number;
}

export type RiderLevel = 'Новичок' | 'Механик' | 'Эксперт' | 'Гуру' | 'Модератор';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  favorites: string[]; 
  savedComparisons: string[][];
  following: string[]; // User IDs
  role: 'user' | 'moderator';
  reputation: number;
  reportsCount: number;
  level: RiderLevel;
  settings: {
    notifications: boolean;
    experienceLevel: string;
  };
}
