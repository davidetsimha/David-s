// Re-export supabase client from lib for backward compatibility with services
import { createClient } from '@/lib/supabase/client';

export const supabase = createClient();
