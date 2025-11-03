import { z } from 'zod';

/**
 * Validation Schemas using Zod
 * Provides type-safe form validation with helpful error messages
 */

// Authentication Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  age: z
    .number()
    .min(1, 'Age is required')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than 120'),
  bloodGroup: z
    .string()
    .min(1, 'Blood group is required')
    .refine((val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val), {
      message: 'Please select a valid blood group',
    }),
  gender: z
    .string()
    .min(1, 'Gender is required')
    .refine((val) => ['Male', 'Female', 'Other'].includes(val), {
      message: 'Please select a valid gender',
    }),
});

// Reminder Schema
export const reminderSchema = z.object({
  medicineName: z
    .string()
    .min(1, 'Medicine name is required')
    .min(2, 'Medicine name must be at least 2 characters')
    .max(100, 'Medicine name must be less than 100 characters'),
  dosage: z
    .string()
    .min(1, 'Dosage is required')
    .max(50, 'Dosage must be less than 50 characters'),
  frequency: z
    .string()
    .min(1, 'Frequency is required'),
  times: z
    .array(z.string())
    .min(1, 'At least one time is required'),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Please enter a valid date',
    }),
  endDate: z
    .string()
    .min(1, 'End date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Please enter a valid date',
    }),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Blood Request Schema
export const bloodRequestSchema = z.object({
  patientName: z
    .string()
    .min(1, 'Patient name is required')
    .min(2, 'Patient name must be at least 2 characters')
    .max(100, 'Patient name must be less than 100 characters'),
  bloodGroup: z
    .string()
    .min(1, 'Blood group is required')
    .refine((val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val), {
      message: 'Please select a valid blood group',
    }),
  unitsNeeded: z
    .number()
    .min(1, 'Units needed is required')
    .min(1, 'At least 1 unit is required')
    .max(10, 'Maximum 10 units allowed'),
  hospital: z
    .string()
    .min(1, 'Hospital name is required')
    .min(2, 'Hospital name must be at least 2 characters')
    .max(200, 'Hospital name must be less than 200 characters'),
  location: z
    .string()
    .min(1, 'Location is required')
    .min(2, 'Location must be at least 2 characters')
    .max(200, 'Location must be less than 200 characters'),
  contactNumber: z
    .string()
    .min(1, 'Contact number is required')
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
  urgency: z
    .string()
    .min(1, 'Urgency level is required')
    .refine((val) => ['low', 'medium', 'high', 'critical'].includes(val), {
      message: 'Please select a valid urgency level',
    }),
  requiredBy: z
    .string()
    .min(1, 'Required by date is required')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Please enter a valid date',
    })
    .refine((date) => new Date(date) >= new Date(), {
      message: 'Required by date must be in the future',
    }),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

// Profile Update Schema
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  age: z
    .number()
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than 120')
    .optional(),
  bloodGroup: z
    .string()
    .refine((val) => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(val), {
      message: 'Please select a valid blood group',
    })
    .optional(),
  gender: z
    .string()
    .refine((val) => ['Male', 'Female', 'Other'].includes(val), {
      message: 'Please select a valid gender',
    })
    .optional(),
});

// Type exports for TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ReminderInput = z.infer<typeof reminderSchema>;
export type BloodRequestInput = z.infer<typeof bloodRequestSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

/**
 * Validation helper function
 * Returns { success: true, data } or { success: false, errors }
 */
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const validData = schema.parse(data);
    return { success: true as const, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false as const, errors };
    }
    return { success: false as const, errors: { _form: 'Validation failed' } };
  }
};

/**
 * Get first error message from validation errors
 */
export const getFirstError = (errors: Record<string, string>): string => {
  const firstKey = Object.keys(errors)[0];
  return errors[firstKey] || 'Validation error';
};
