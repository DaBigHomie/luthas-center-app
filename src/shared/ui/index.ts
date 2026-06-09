/**
 * Shared UI primitives — Luthas Center
 * All components are themed via globals.css @theme (no raw hex).
 */

export { Button } from './Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button'

export { Card } from './Card'
export type { CardRootProps, CardVariant } from './Card'

export { Badge } from './Badge'
export type { BadgeProps, BadgeVariant } from './Badge'

export { FormField, TextareaField, SelectField } from './FormField'
export type { FormFieldProps, TextareaFieldProps, SelectFieldProps, SelectOption } from './FormField'

export { Accordion } from './Accordion'
export type { AccordionProps, AccordionItem } from './Accordion'

export { Avatar } from './Avatar'
export type { AvatarProps, AvatarSize } from './Avatar'

export { Pagination } from './Pagination'
export type { PaginationProps, PaginationVariant } from './Pagination'

export { Breadcrumb } from './Breadcrumb'
export type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb'

export { Alert, CtaBanner } from './Alert'
export type { AlertProps, AlertVariant, CtaBannerProps, BannerVariant } from './Alert'

export { Skeleton } from './Skeleton'
export type { SkeletonProps } from './Skeleton'

export { Separator } from './Separator'
export type { SeparatorProps } from './Separator'

// Prose is server-only — import directly from '@/shared/ui/Prose', not from this barrel.
// export { Prose } from './Prose'
