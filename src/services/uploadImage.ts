import { supabase } from '@/lib/supabase/supabase';

export async function uploadOrderImage(orderId: string, file: File) {
  if (!file) return null;

  const filePath = `orders/${orderId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('cnc-laundry')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from('cnc-laundry').getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadPaymentProof(orderId: string, file: File) {
  if (!file) return null;

  const filePath = `bukti-bayar/${orderId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('cnc-laundry')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from('cnc-laundry').getPublicUrl(filePath);

  return publicUrl;
}
