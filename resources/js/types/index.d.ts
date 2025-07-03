import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface User {
    id: number;
    fname: string;
    lname: string;
    role: 'ADMIN' | 'USER' | 'WORKER';
    email: string;
    email_verified_at: string | null;
    last_on: string;
    created_at: string;
    updated_at: string;
}

export interface Messages {
    id: number;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    description: string;
    created_at: string;
    status: boolean;
    updated_at: string;
}


export interface Auth {
    user: User;
    cars: Car[];
    appointments: Appointment[];
}

export interface Car {
    id: number;
    user_id: number;
    brand: string;
    model: string;
    year: number;
    color: string;
    license_plate: string;
    vin: string;
    created_at: string;
    updated_at: string;
}

export interface CarsData {
    cars: Car[];
}

export interface Appointment {
    id: number;
    car_id: number;
    description: string;
    estimated_date: string | null;
    attachment_path: string | null;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    created_at: string;
    updated_at: string;
    car?: Car; 
}

export interface AppointmentData {
    appointments: Appointment[];
    cars: Car[];
}
export interface Reviews {
    id: number;
    lname: string;
    fname: string;
    stars: number;
    occupation: string;
    description: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    cars: CarData;
    messages: Messages[];
    appointmentss: Appointment[];
    reviews: Reviews[];
    users: User[];
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}
