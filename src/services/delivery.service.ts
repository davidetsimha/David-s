import { supabase } from './supabase';
import type { DeliveryZone } from '../types';

export interface CreateDeliveryZoneDTO {
  name_fr: string;
  name_he: string;
  price: number;
  sort_order?: number;
  active?: boolean;
}

export async function getDeliveryZones(activeOnly = true): Promise<DeliveryZone[]> {
  let query = supabase
    .from('delivery_zones')
    .select('*')
    .order('sort_order', { ascending: true });

  if (activeOnly) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as DeliveryZone[];
}

export async function getDeliveryZoneById(id: string): Promise<DeliveryZone> {
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as DeliveryZone;
}

export async function createDeliveryZone(zoneData: CreateDeliveryZoneDTO): Promise<DeliveryZone> {
  const { data, error } = await supabase
    .from('delivery_zones')
    .insert(zoneData)
    .select('*')
    .single();

  if (error) throw error;
  return data as DeliveryZone;
}

export async function updateDeliveryZone(
  id: string,
  zoneData: Partial<CreateDeliveryZoneDTO>
): Promise<DeliveryZone> {
  const { data, error } = await supabase
    .from('delivery_zones')
    .update({ ...zoneData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as DeliveryZone;
}

export async function deleteDeliveryZone(id: string): Promise<void> {
  const { error } = await supabase.from('delivery_zones').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleDeliveryZoneActive(id: string, active: boolean): Promise<DeliveryZone> {
  return updateDeliveryZone(id, { active });
}
