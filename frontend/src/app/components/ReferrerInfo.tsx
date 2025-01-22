import { supabase } from '@/lib/supabase'
import ReferrerInfoTable from './ReferrerTable'


export default async function ReferrerTable() {
    const { data, error } = await supabase
    .from('referrer-info')
    .select('*')
    .order('created_at', {ascending: false})
    .limit(100)

    if (error) {
        console.error('Error fetching referrer info:', error)
        return <div>Error loading referrer info</div>
    }

    return <ReferrerInfoTable initialData={data} />
}