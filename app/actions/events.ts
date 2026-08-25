'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function listEvents() {
  const userId = await getUserId()
  return db.select().from(events).where(eq(events.userId, userId)).orderBy(asc(events.eventDate), asc(events.startTime))
}

export async function createEvent(input: { title: string; eventDate: string; startTime: string; endTime: string; category: string; color: string; repeatRule: string; linkedTaskId?: number }) {
  const userId = await getUserId()
  if (!input.title.trim()) throw new Error('Title required')
  await db.insert(events).values({ ...input, title: input.title.trim(), linkedTaskId: input.linkedTaskId || null, userId })
  revalidatePath('/')
}

export async function deleteEvent(id: number) {
  const userId = await getUserId()
  await db.delete(events).where(and(eq(events.id, id), eq(events.userId, userId)))
  revalidatePath('/')
}
