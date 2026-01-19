// Re-export supabase client from lib for backward compatibility with services
import { createClient } from '@/src/lib/supabase/client';

export const supabase = createClient();
