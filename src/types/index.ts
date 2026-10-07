export interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  fiatValue: number;
  price: number;
  change24h: number;
  iconBg: string;
  chain: string;
}

export interface ActivityItem {
  id: string;
  type: 'received' | 'sent' | 'swap' | 'payment';
  title: string;
  subtitle: string;
  amount: string;
  fiatAmount: string;
  time: string;
  status: 'completed' | 'pending';
  hash?: string;
}

export interface SupportedNetwork {
  id: string;
  name: string;
  type: 'EVM' | 'L2' | 'Non-EVM';
  tps: string;
  avgFee: string;
  finality: string;
  token: string;
  description: string;
}

export interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  highlights: string[];
}

export interface SecurityPillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  auditor?: string;
  spec: string;
}

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  metric?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'security' | 'transfers' | 'fees';
}
