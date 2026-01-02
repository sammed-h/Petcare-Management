import { Suspense } from 'react'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { CaretakerCard } from '@/components/caretaker-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

// This would be a server component
async function getCaretakers(pincode?: string, page: number = 1) {
  await dbConnect()
  const limit = 9; // Grid of 3x3
  const skip = (page - 1) * limit;

  const query: any = { role: 'zoo_manager' };
  if (pincode) {
    query.pincode = pincode;
  }

  const caretakers = await User.find(query)
    .select('-password')
    .skip(skip)
    .limit(limit)
    .lean();
    
  const total = await User.countDocuments(query);
  
  return {
    caretakers: caretakers.map(c => ({
      ...c,
      _id: c._id.toString(),
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
  searchParams?: { pincode?: string; page?: string };
}) {
  // Await searchParams before accessing properties
  const params = await Promise.resolve(searchParams);
  const pincode = params?.pincode || '';
  const page = Number(params?.page) || 1;
  
  const { caretakers, totalPages, currentPage } = await getCaretakers(pincode, page);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {pincode ? `Caretakers near ${pincode}` : 'All Professional Caretakers'}
          </h1>
          <p className="text-gray-600">Browse our verified pet caretakers and experts.</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form className="relative flex-1 max-w-md w-full flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                name="pincode" 
                defaultValue={pincode} 
                placeholder="Search by pincode..." 
                className="pl-10" 
              />
            </div>
            <Button type="submit" variant="secondary">Filter</Button>
            {pincode && (
                <Button variant="ghost" asChild>
                    <a href="/caretakers">Clear</a>
                </Button>
            )}
          </form>
          <div className="text-sm text-gray-500">
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
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500 text-lg">No caretakers found {pincode && `in pincode ${pincode}`}.</p>
              <p className="text-sm text-gray-400">Try a different area or clear the search.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
             <Button 
                variant="outline" 
                disabled={currentPage <= 1}
                asChild
             >
                <a href={`/caretakers?pincode=${pincode}&page=${currentPage - 1}`}>Previous</a>
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
                   <a href={`/caretakers?pincode=${pincode}&page=${p}`}>{p}</a>
                 </Button>
               ))}
             </div>
             <Button 
                variant="outline" 
                disabled={currentPage >= totalPages}
                asChild
             >
                <a href={`/caretakers?pincode=${pincode}&page=${currentPage + 1}`}>Next</a>
             </Button>
          </div>
        )}
      </div>
    </div>
  )
}
