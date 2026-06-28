import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getDaysUntil(date: string | Date) {
  const now = new Date()
  const target = new Date(date)
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function generateSlug(name: string, age?: number) {
  const base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const suffix = age ? `-turns-${age}` : `-birthday`
  const rand = Math.random().toString(36).substring(2, 6)
  return `${base}${suffix}-${rand}`
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const ALLERGY_OPTIONS = [
  'Peanuts', 'Tree Nuts', 'Milk / Dairy', 'Eggs', 'Wheat / Gluten',
  'Soy', 'Fish', 'Shellfish', 'Sesame',
]

export const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free',
  'Dairy-Free', 'Alcohol-Free', 'Low Sugar',
]

export const PLAN_FEATURES = {
  free: {
    maxEvents: 1,
    maxRsvps: 20,
    themes: ['classic-balloons', 'simple-elegant'],
    features: ['Basic checklist', 'Standard invitation', 'Up to 20 RSVPs', 'Guest list view'],
  },
  premium: {
    maxEvents: Infinity,
    maxRsvps: Infinity,
    themes: 'all',
    features: [
      'Unlimited events',
      'All premium animated themes',
      'Unlimited RSVPs',
      'Gift registry',
      'Advanced analytics',
      'AI Party Planner',
      'Co-planner access',
      'PDF export',
      'WhatsApp sharing',
      'Post-event photo wall',
      'Thank you card builder',
      'Budget tracker',
      'Bar & catering planner',
    ],
  },
}
