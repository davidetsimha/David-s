import { z } from 'zod';

// Phone number regex for Israeli numbers
const phoneRegex = /^(\+972|0)([23489]|5[0-9]|77)[0-9]{7}$/;

/**
 * Schema for checkout form validation
 */
export const checkoutSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caracteres')
    .max(100, 'Le nom ne peut pas depasser 100 caracteres'),
  customer_email: z
    .string()
    .email('Adresse email invalide'),
  customer_phone: z
    .string()
    .regex(phoneRegex, 'Numero de telephone invalide'),
  delivery_type: z.enum(['delivery', 'pickup'], {
    message: 'Veuillez choisir un mode de livraison',
  }),
  delivery_address: z
    .string()
    .max(500, 'L\'adresse ne peut pas depasser 500 caracteres')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(1000, 'Les notes ne peuvent pas depasser 1000 caracteres')
    .optional()
    .nullable(),
}).refine(
  (data) => {
    if (data.delivery_type === 'delivery') {
      return data.delivery_address && data.delivery_address.trim().length > 0;
    }
    return true;
  },
  {
    message: 'L\'adresse de livraison est requise pour la livraison',
    path: ['delivery_address'],
  }
);

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

/**
 * Schema for quote request form validation
 */
export const quoteRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caracteres')
    .max(100, 'Le nom ne peut pas depasser 100 caracteres'),
  email: z
    .string()
    .email('Adresse email invalide'),
  phone: z
    .string()
    .regex(phoneRegex, 'Numero de telephone invalide'),
  event_type: z.enum(['bar_mitzvah', 'bat_mitzvah', 'brit', 'wedding', 'private_party'], {
    message: 'Veuillez choisir un type d\'evenement',
  }),
  event_date: z
    .string()
    .min(1, 'Veuillez choisir une date'),
  guest_count: z
    .number()
    .int('Le nombre d\'invites doit etre un entier')
    .min(10, 'Minimum 10 invites')
    .max(1000, 'Maximum 1000 invites'),
  message: z
    .string()
    .max(2000, 'Le message ne peut pas depasser 2000 caracteres')
    .optional()
    .nullable(),
});

export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;

/**
 * Schema for contact form validation
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caracteres')
    .max(100, 'Le nom ne peut pas depasser 100 caracteres'),
  email: z
    .string()
    .email('Adresse email invalide'),
  phone: z
    .string()
    .regex(phoneRegex, 'Numero de telephone invalide')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caracteres')
    .max(2000, 'Le message ne peut pas depasser 2000 caracteres'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Schema for product form validation (admin)
 */
export const productSchema = z.object({
  name_fr: z
    .string()
    .min(2, 'Le nom francais doit contenir au moins 2 caracteres')
    .max(200, 'Le nom ne peut pas depasser 200 caracteres'),
  name_he: z
    .string()
    .min(2, 'Le nom hebreu doit contenir au moins 2 caracteres')
    .max(200, 'Le nom ne peut pas depasser 200 caracteres'),
  description_fr: z
    .string()
    .max(1000, 'La description ne peut pas depasser 1000 caracteres')
    .optional()
    .nullable(),
  description_he: z
    .string()
    .max(1000, 'La description ne peut pas depasser 1000 caracteres')
    .optional()
    .nullable(),
  price: z
    .number()
    .positive('Le prix doit etre positif')
    .max(100000, 'Le prix ne peut pas depasser 100000'),
  image_url: z
    .string()
    .url('URL d\'image invalide')
    .optional()
    .nullable()
    .or(z.literal('')),
  category_id: z
    .string()
    .uuid('Categorie invalide'),
  available: z
    .boolean()
    .default(true),
  sort_order: z
    .number()
    .int()
    .min(0)
    .default(0),
});

export type ProductFormData = z.infer<typeof productSchema>;

/**
 * Schema for admin login
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caracteres'),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
