import { Suspense } from 'react'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { CaretakerCard } from '@/components/caretaker-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

// This would be a server component
// This would be a server component
async function getCaretakers(filters: { pincode?: string; name?: string; company?: string }, page: number = 1) {
  await dbConnect()
  const limit = 9; // Grid of 3x3
  const skip = (page - 1) * limit;

  const query: any = { role: 'zoo_manager' };
  
  if (filters.pincode) {
    query.pincode = filters.pincode;
  }
  
  if (filters.name) {
    query.name = { $regex: filters.name, $options: 'i' };
  }
  
  if (filters.company) {
    query.companyName = { $regex: filters.company, $options: 'i' };
  }

  const caretakers = await User.find(query)
    .select('-password')
    .skip(skip)
    .limit(limit)
    .lean();
    
  const total = await User.countDocuments(query);
  
  return {
    caretakers: caretakers.map((c: any) => ({
      ...c,
      _id: c._id?.toString(),
      createdAt: c.createdAt?.toString(),
      verification: c.verification || {}
    })),
    totalPages: Math.ceil(total / limit),
    currentPage: page
  }
}

export default async function CaretakersPage({
  searchParams,
}: {
  searchParams?: { pincode?: string; name?: string; company?: string; page?: string };
}) {
  // Await searchParams before accessing properties
  const params = await Promise.resolve(searchParams);
  const pincode = params?.pincode || '';
  const name = params?.name || '';
  const company = params?.company || '';
  const page = Number(params?.page) || 1;
  
  const { caretakers, totalPages, currentPage } = await getCaretakers({ pincode, name, company }, page);

  const hasFilters = pincode || name || company;
  const filterSummary = [
    pincode && `pincode "${pincode}"`,
    name && `name "${name}"`,
    company && `company "${company}"`
  ].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hasFilters ? 'Search Results' : 'All Professional Caretakers'}
          </h1>
          <p className="text-gray-600">
            {hasFilters 
              ? `Found ${caretakers.length} caretakers matching ${filterSummary}`
              : 'Browse our verified pet caretakers and experts.'}
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Caretaker Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="name"
                  name="name" 
                  defaultValue={name} 
                  placeholder="e.g. John Doe" 
                  className="pl-9" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium text-gray-700">Company Name</label>
               <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="company"
                  name="company" 
                  defaultValue={company} 
                  placeholder="e.g. Paws & Claws" 
                  className="pl-9" 
                />
              </div>
            </div>

            <div className="space-y-2">
               <label htmlFor="pincode" className="text-sm font-medium text-gray-700">Pincode</label>
               <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  id="pincode"
                  name="pincode" 
                  defaultValue={pincode} 
                  placeholder="e.g. 560001" 
                  className="pl-9" 
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">Search</Button>
              {hasFilters && (
                  <Button variant="outline" asChild className="px-3">
                      <a href="/caretakers">Reset</a>
                  </Button>
              )}
            </div>
          </form>
          
          <div className="mt-4 text-xs text-right text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {caretakers.length > 0 ? (
            caretakers.map((caretaker) => (
              <CaretakerCard key={caretaker._id} caretaker={caretaker as any} />
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-lg border border-dashed">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No caretakers found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                We couldn't find any caretakers matching your current filters. Try adjusting your search criteria.
              </p>
              {hasFilters && (
                 <Button variant="link" asChild className="mt-2 text-blue-600">
                    <a href="/caretakers">View all caretakers</a>
                 </Button>
              )}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
             <Button 
                variant="outline" 
                disabled={currentPage <= 1}
                asChild
             >
                <a href={`/caretakers?${new URLSearchParams({ ...params as any, page: (currentPage - 1).toString() }).toString()}`}>Previous</a>
             </Button>
             <div className="flex items-center gap-1">
               {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                 <Button
                   key={p}
                   variant={p === currentPage ? "default" : "ghost"}
                   size="icon"
                   className="w-8 h-8"
                   asChild
                 >
                   <a href={`/caretakers?${new URLSearchParams({ ...params as any, page: p.toString() }).toString()}`}>{p}</a>
                 </Button>
               ))}
             </div>
             <Button 
                variant="outline" 
                disabled={currentPage >= totalPages}
                asChild
             >
                <a href={`/caretakers?${new URLSearchParams({ ...params as any, page: (currentPage + 1).toString() }).toString()}`}>Next</a>
             </Button>
          </div>
        )}
      </div>
    </div>
  )
}
