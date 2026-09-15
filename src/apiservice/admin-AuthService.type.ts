// Admin Auth Data
export interface IAdminAuthType {
  access_token?: string;
  token_type?: string;
  staff?: IStaffAuthData;
  message?: string;
  data?: IAdminTypeData;
}

export interface IStaffAuthData {
  id: number;
  branch_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  status: string;
  staff_role_id: string;
  created_at: string;
}

export interface IAdminTypeData {
  status: number;
  adminCredentials: Credentials;
  credentials: Credentials;
  id: number
  adminId: number
  apiKey: string
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface Credentials {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  dpUrl: string;
  blocked: boolean;
}

// Admin Dashboard Details
export interface IAdminDashboardType {
  status: string;
  message: string;
  data: IAdminDashboardTypeData;
  meta: any;
}

export interface IAdminDashboardTypeData {
  numberOfStaff: number;
  activeStaff: number;
  inActiveStaff: number;

export interface RoomsBookedPerDay {
  date: string;
  num: number;
}

export interface RecentCheckIn {
  booking_id: number;
  booking_reference: string;
  check_in_date: string;
  room: RecentCheckInRoom;
}

export interface RecentCheckInRoom {
  id: number;
  room_number: string;
  floor: string;
}

export interface TopCustomer {
  guest_id: number;
  first_name: string;
  last_name: string;
  email: string;
  bookings: number;
  amount: number;
}

// Settings

export interface ISettingsConfig {
  status: number;
  message: string;
  data: ISettingsConfigData;
}

export interface ISettingsConfigData {
  maximumDailyTransferOut3pAmount: number;
  maximumDailyTransferOut3pFrequency: number;
  tranferOut3pAutoInitiationEnabled: boolean;
}
