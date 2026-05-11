export type Trip = {
  id: string;
  batch_number: number;
  date: string;
  seats: string[];
};

export type Booking = {
  id: string;
  user_name: string;
  user_email: string;
  trip_id: string;
  batch_number: number;
  seat_number: string;
  serial_number: string;
  status: 'booked' | 'cancelled';
  created_at: string;
};

export type Waitlist = {
  id: string;
  user_name: string;
  user_email: string;
  trip_id: string;
  batch_number: number;
  position: number;
};

export type Emergency = {
  id: string;
  user_name?: string;
  latitude: number;
  longitude: number;
  status: 'REQUESTED' | 'DISPATCHED' | 'ARRIVING';
  created_at: string;
};
