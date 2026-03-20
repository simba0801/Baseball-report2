// ===== 인증 & 사용자 =====
export interface User {
  user_id: string;
  email: string;
  created_date: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// ===== 선수 정보 =====
export interface PlayerEducation {
  graduation_year: number;
  school_name?: string;
  team_name?: string;
  grade?: number;
}

export interface Player {
  user_id: string;
  name: string;
  height: number; // cm
  weight: number; // kg
  elementary: PlayerEducation;
  middle: PlayerEducation;
  high_school: PlayerEducation;
  created_date: string;
}

// ===== 투구 데이터 =====
export type PitchType = "직구" | "커브" | "슬라이더" | "체인지업" | "싱크" | "포크" | "기타";

export type SpecialSituation = "폭투" | "패스드볼" | "보크" | "견제";

export interface Pitch {
  pitch_num: number;
  pitch_type: PitchType;
  result: "Strike" | "Ball";
  location: number; // 1-25 Zone
  special_situation?: SpecialSituation;
  ball_count: number;
  strike_count: number;
  out_count: number;
}

// ===== 경기 기록 =====
export type GamePosition = "선발" | "중간" | "마무리";
export type BatterHand = "좌" | "우";

export interface GameSession {
  date: Date;
  opponent: string;
  position: GamePosition;
  current_inning: number;
  current_batter_order: number;
  batter_hand: BatterHand;
  out_count: number;
  ball_count: number;
  strike_count: number;
  bases: {
    first: boolean;
    second: boolean;
    third: boolean;
  };
  runners_home: number;
  pitches: Pitch[];
  runs: number;
  earned_runs: number;
  errors: number;
}

export interface GameRecord {
  record_id?: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  opponent: string;
  position: GamePosition;
  inning: number;
  pitches: Pitch[];
  runs: number;
  earned_runs: number;
  errors: number;
  created_date: string;
}

export interface GameStats {
  total_games: number;
  total_pitches: number;
  total_strikes: number;
  total_balls: number;
  strike_rate: number; // 0-100
  pitch_type_distribution: Record<string, number>;
  zone_distribution: Record<number, number>;
  total_runs: number;
  total_earned_runs: number;
  total_errors: number;
}

// ===== UI 상태 =====
export interface Toast {
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

export interface FormErrors {
  [key: string]: string | undefined;
}
