// types/VehicleTypes.ts
export interface VehicleForm {
  // Basic Information
  brand: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vehicleType: string;
  
  // Vehicle Details
  fuelType: string;
  transmission: string;
  seatingCapacity: string;
  category: string;
  
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
  pincode: string;

  // Features
  features: string[];
  
  // Documents & Images
  images: string[];
  rcDocument: any;
  insuranceDocument: any;
  pucDocument: any;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface StepProps {
  formData: VehicleForm;
  updateFormData: (field: keyof VehicleForm, value: string | string[] | any) => void;
  showDropdown: string | null;
  setShowDropdown: (value: string | null) => void;
}

export const vehicleTypeOptions: DropdownOption[] = [
  { label: '2 Wheeler', value: '2_wheeler' },
  { label: '4 Wheeler', value: '4_wheeler' },
  { label: 'Other', value: 'Other' },
];

// Dropdown options
export const brandOptions: DropdownOption[] = [
  { label: 'Maruti Suzuki', value: 'maruti' },
  { label: 'Hyundai', value: 'hyundai' },
  { label: 'Honda', value: 'honda' },
  { label: 'Toyota', value: 'toyota' },
  { label: 'Mahindra', value: 'mahindra' },
  { label: 'Tata', value: 'tata' },
  { label: 'Ford', value: 'ford' },
  { label: 'Volkswagen', value: 'volkswagen' },
  { label: 'BMW', value: 'bmw' },
  { label: 'Mercedes-Benz', value: 'mercedes' },
  { label: 'Audi', value: 'audi' },
  { label: 'Other', value: 'other' },
];

export const fuelTypes: DropdownOption[] = [
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'CNG', value: 'cng' },
  { label: 'Electric', value: 'electric' },
  { label: 'Hybrid', value: 'hybrid' },
];

export const transmissionTypes: DropdownOption[] = [
  { label: 'Manual', value: 'manual' },
  { label: 'Automatic', value: 'automatic' },
  { label: 'CVT', value: 'cvt' },
];

export const seatingOptions: DropdownOption[] = [
  { label: '2 Seater', value: '2' },
  { label: '4 Seater', value: '4' },
  { label: '5 Seater', value: '5' },
  { label: '7 Seater', value: '7' },
  { label: '8+ Seater', value: '8+' },
];

export const categoryOptions: DropdownOption[] = [
  { label: 'Hatchback', value: 'hatchback' },
  { label: 'Sedan', value: 'sedan' },
  { label: 'SUV', value: 'suv' },
  { label: 'MUV', value: 'muv' },
  { label: 'Luxury', value: 'luxury' },
  { label: 'Sports', value: 'sports' },
];

export const availableFeatures = [
  'Air Conditioning',
  'Bluetooth',
  'GPS Navigation',
  'Backup Camera',
  'Sunroof',
  'Leather Seats',
  'Cruise Control',
  'Parking Sensors',
  'Music System',
  'USB Charging',
  'Power Windows',
  'Central Locking',
];