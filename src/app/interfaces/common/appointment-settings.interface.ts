export interface AppointmentSettings {
  _id?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroPrimaryButtonText?: string;
  heroSecondaryButtonText?: string;
  featuresTitle?: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  benefitsTitle?: string;
  benefitsSubtitle?: string;
  benefitsImage?: string;
  benefits?: Array<{
    icon: string;
    iconColor?: string;
    title: string;
    text: string;
  }>;
  categoriesTitle?: string;
  categories?: Array<{
    icon: string;
    iconColor?: string;
    title: string;
    isFree?: boolean;
    items?: string[];
    buttonText?: string;
    buttonType?: string;
  }>;
  bookingTitle?: string;
  bookingSubtitle?: string;
  bookingSteps?: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  bookingButtonText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
