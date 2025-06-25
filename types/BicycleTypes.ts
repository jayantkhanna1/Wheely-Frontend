// types/BicycleTypes.ts
export interface BicycleForm {
  // Basic Information
  brand: string;
  make: string;
  model: string;
  year: string;
  color: string;
  
  // Pricing & Availability
  pricePerDay: string;
  pricePerHour: string;
  availability: any; // Add this field to match your formData
  
  // Location Details
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  
  // Features
  features: string[];
  
  // Documents & Images
  images: string[];
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface StepProps {
  formData: BicycleForm;
  updateFormData: (field: keyof BicycleForm, value: string | string[] | any) => void;
  showDropdown: string | null;
  setShowDropdown: (value: string | null) => void;
}

// Dropdown options
export const brandOptions: DropdownOption[] = [
    { label: 'Trek', value: 'trek' },
    { label: 'Giant', value: 'giant' },
    { label: 'Specialized', value: 'specialized' },
    { label: 'Cannondale', value: 'cannondale' },
    { label: 'Bianchi', value: 'bianchi' },
    { label: 'Scott', value: 'scott' },
    { label: 'Cervélo', value: 'cervelo' },
    { label: 'Santa Cruz', value: 'santa_cruz' },
    { label: 'Brompton', value: 'brompton' },
    { label: 'Other', value: 'other' }
];

export const availableFeatures = [
    'Helmet',
    'Lock',
    'Lights',
    'Bell',
    'Carrier',
    'Mudguards',
    'Reflectors',
    'Water Bottle Holder',
    'GPS Tracker',
    'Repair Kit'
];