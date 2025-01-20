import { supabase } from '@/lib/supabase'
import UserRegistrationTableClient from './UserRegistrationTableClient'

export default async function UserRegistrationTable() {
  const { data, error } = await supabase
    .from('user_registration')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching user registrations:', error)
    return <div>Error loading user registrations</div>
  }

  return <UserRegistrationTableClient initialData={data} />
}

