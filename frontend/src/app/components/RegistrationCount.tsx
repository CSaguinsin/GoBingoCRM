import { supabase } from '@/lib/supabase'

export default async function RegistrationCount() {
  const { count, error } = await supabase
    .from('user_registration')
    .select('created_at', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching registration count:', error)
    return <div className="text-red-500">Error loading registration count</div>
  }

  return (
    <div className="text-4xl font-bold">
      {count?.toLocaleString() ?? 0}
    </div>
  )
}