import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Storage Bucket Name ────────────────────────────────────
export const BUCKET_NAME = 'images'

// ─── Helper: resolve any image value to a displayable URL ───
// Accepts:
//   • Full URL  → returned as-is
//   • Filename  → public URL from Supabase Storage "images" bucket
//   • null/undefined → returns fallback
export function getImageUrl(value, fallback = '/gallary/images.jpg') {
  if (!value) return fallback
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('/')) return value          // local /gallary/ path

  // Otherwise treat it as a filename inside the bucket
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(value)
  return data?.publicUrl || fallback
}

// ─── Upload a file to the "images" bucket ───────────────────
// Returns the filename on success or null on error.
export async function uploadImage(file, folder = 'products') {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) {
    console.error('Upload error:', error.message)
    return null
  }
  return fileName          // store this in the DB column
}

// ─── Delete a file from the "images" bucket ─────────────────
export async function deleteImage(fileName) {
  if (!fileName || fileName.startsWith('http') || fileName.startsWith('/')) return
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName])
  if (error) console.error('Delete error:', error.message)
}
