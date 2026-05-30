import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isMock = !supabaseUrl || !supabaseAnonKey;

let supabase = null;
if (!isMock) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

if (isMock) {
  console.warn('[Supabase] No credentials found. Running with mock data. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
}

// Contact form
export async function submitMessage({ name, email, message }) {
  if (isMock) {
    console.log('[Mock] Message submitted:', { name, email, message });
    return { success: true };
  }
  const { error } = await supabase
    .from('messages')
    .insert([{ name, email, message }]);
  if (error) throw error;
  return { success: true };
}

// Project likes
export async function getLikes(projectSlug) {
  if (isMock) return Math.floor(Math.random() * 50) + 5;
  const { data, error } = await supabase
    .from('project_likes')
    .select('likes')
    .eq('project_slug', projectSlug)
    .single();
  if (error) return 0;
  return data?.likes || 0;
}

export async function incrementLike(projectSlug) {
  if (isMock) return Math.floor(Math.random() * 50) + 6;
  const { data: existing } = await supabase
    .from('project_likes')
    .select('likes')
    .eq('project_slug', projectSlug)
    .single();
  
  if (existing) {
    const { data, error } = await supabase
      .from('project_likes')
      .update({ likes: existing.likes + 1 })
      .eq('project_slug', projectSlug)
      .select('likes')
      .single();
    if (error) throw error;
    return data.likes;
  } else {
    const { data, error } = await supabase
      .from('project_likes')
      .insert([{ project_slug: projectSlug, likes: 1 }])
      .select('likes')
      .single();
    if (error) throw error;
    return data.likes;
  }
}

// Visitor counter
export async function getVisitorCount() {
  if (isMock) return 1337;
  const { data, error } = await supabase
    .from('visitors')
    .select('count')
    .single();
  if (error) return 0;
  return data?.count || 0;
}

export async function incrementVisitor() {
  if (isMock) return 1338;
  const { data: existing } = await supabase
    .from('visitors')
    .select('id, count')
    .single();
  
  if (existing) {
    const { data, error } = await supabase
      .from('visitors')
      .update({ count: existing.count + 1, last_updated: new Date().toISOString() })
      .eq('id', existing.id)
      .select('count')
      .single();
    if (error) return existing.count;
    return data.count;
  } else {
    const { data, error } = await supabase
      .from('visitors')
      .insert([{ count: 1, last_updated: new Date().toISOString() }])
      .select('count')
      .single();
    if (error) return 1;
    return data.count;
  }
}

export { supabase, isMock };
