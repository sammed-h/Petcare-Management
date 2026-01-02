import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Find Verified Pet Caretakers | PetCare',
  description: 'Browse and hire professional, verified pet caretakers near you. Filter by location, specialization, and specialized services.',
}

export default function CaretakersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
