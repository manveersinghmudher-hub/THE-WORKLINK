import { User } from './types';

export async function login(data: { name: string; password: string }): Promise<{ user: User; token: string }> {
  // TODO: Replace with actual API call
  // Simulating API network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return {
    user: {
      id: 'mock-user-id',
      name: data.name,
    },
    token: 'mock-jwt-token',
  };
}

export async function register(data: { name: string; phone: string; city: string; password: string }): Promise<{ user: User; token: string }> {
  // TODO: Replace with actual API call
  // Simulating API network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  return {
    user: {
      id: 'mock-user-id',
      name: data.name,
      phone: data.phone,
      city: data.city,
    },
    token: 'mock-jwt-token',
  };
}

export async function fetchSavedWorkers(userId: string): Promise<any[]> {
  await new Promise((r) => setTimeout(r, 500));
  return [
    { id: 'w1', name: 'Ravi Kumar', initials: 'RK', speciality: 'Electrician', rating: 4.8, completedJobs: 120, hourlyRate: 350, badge: 'Pro' }
  ];
}

export async function fetchPromotions(): Promise<any[]> {
  await new Promise((r) => setTimeout(r, 500));
  return [
    { id: 'p1', title: '50% off First Order', description: 'Up to ₹200 off', code: 'WELCOME50', bgColor: 'bg-green-50' }
  ];
}

export async function fetchOrderHistory(userId: string): Promise<any[]> {
  await new Promise((r) => setTimeout(r, 500));
  return [];
}

export async function createBooking(data: any): Promise<{ bookingId: string }> {
  await new Promise((r) => setTimeout(r, 500));
  return { bookingId: 'bk_' + Date.now() };
}

export async function fetchWorkers(serviceId?: string): Promise<any[]> {
  await new Promise((r) => setTimeout(r, 800));
  return [
    { id: 'w1', name: 'Ravi Kumar', initials: 'RK', speciality: 'Electrician', rating: 4.8, completedJobs: 120, hourlyRate: 350, badge: 'Pro' },
    { id: 'w2', name: 'Amit Singh', initials: 'AS', speciality: 'General', rating: 4.5, completedJobs: 80, hourlyRate: 250, badge: 'Verified' },
  ];
}

export async function autoAssignWorker(bookingId: string): Promise<any> {
  await new Promise((r) => setTimeout(r, 800));
  return { id: 'w3', name: 'WorkLink Pro', initials: 'WL', speciality: 'Expert', rating: 5.0, completedJobs: 300, hourlyRate: 450, badge: 'Employee' };
}

export async function startWork(bookingId: string) {
  await new Promise((r) => setTimeout(r, 500));
}

export async function processPayment(data: { bookingId: string; amount: number; type: string }): Promise<any> {
  await new Promise((r) => setTimeout(r, 800));
  return { id: 'pay_' + Date.now(), amount: data.amount, status: 'success', type: data.type };
}

export async function completeWork(bookingId: string) {
  await new Promise((r) => setTimeout(r, 500));
}

export async function submitFeedback(data: any) {
  await new Promise((r) => setTimeout(r, 500));
}
