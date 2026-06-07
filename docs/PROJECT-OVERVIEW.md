# Luthas Center for Excellence — Project Overview

## Summary
LMS + Nonprofit site — courses, mental health resources, donation portal

## Migration Source
- **WordPress site**: luthascenter.com
- **Backup source**: UpdraftPlus (Google Drive)
- **Dev domain**: luthas-center.damieus.app

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **Architecture**: Feature-Sliced Design (FSD)
- **Deployment**: Vercel

## Routes
- `/`
- `/courses`
- `/courses/[slug]`
- `/resources`
- `/resources/[slug]`
- `/donate`
- `/blog`
- `/blog/[slug]`
- `/about`
- `/contact`
- `/admin`
- `/admin/courses`
- `/admin/resources`
- `/admin/donations`

## Status
- [ ] WordPress content extracted
- [ ] Supabase schema designed
- [ ] Frontend built
- [ ] Deployed to luthas-center.damieus.app
