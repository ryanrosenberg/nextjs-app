import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request) {
    revalidatePath('/tournaments/1987')
    
  return Response.json({ 'message': 'Path revalidated' })
}