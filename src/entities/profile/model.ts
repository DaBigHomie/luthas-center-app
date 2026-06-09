import type { Tables } from '@/shared/types/database'

export type ProfileRow = Tables<'profiles'>
export type EnrollmentRow = Tables<'enrollments'>

export type ProfilePublic = Pick<
  ProfileRow,
  'id' | 'username' | 'display_name' | 'avatar_media_id' | 'bio' | 'role'
>
