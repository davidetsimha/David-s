import { supabase } from './supabase';
import type { EventFormula, UpdateEventFormulaDTO } from '../types';

export async function getEventFormulas(): Promise<EventFormula[]> {
  const { data, error } = await supabase
    .from('event_formulas')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as EventFormula[];
}

export async function updateEventFormula(
  id: string,
  formulaData: UpdateEventFormulaDTO
): Promise<EventFormula> {
  const { data, error } = await supabase
    .from('event_formulas')
    .update({ ...formulaData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as EventFormula;
}
