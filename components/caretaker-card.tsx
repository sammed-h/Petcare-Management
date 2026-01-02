'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Star, MapPin, Building2, Phone, Award, CreditCard, ShieldCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CaretakerProps {
  caretaker: {
    _id: string;
    name: string;
    role: string;
    specialization?: string;
    experience?: string;
    rating?: number;
    serviceCharge?: number;
    companyName?: string;
    phone?: string;
    profilePhoto?: string;
    address?: string;
    verification?: {
      aadhaarUrl?: string;
      companyIdUrl?: string;
      companyIdNumber?: string;
    };
  }
}

export function CaretakerCard({ caretaker }: CaretakerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={caretaker.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${caretaker.name}`} className="object-cover" />
              <AvatarFallback>{caretaker.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{caretaker.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-3 w-3" />
                {caretaker.companyName || 'Independent'}
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            {typeof caretaker.rating === 'number' ? caretaker.rating.toFixed(1) : 'New'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Award className="h-4 w-4 text-primary" />
            <span>{caretaker.experience || 'Entry Level'} Exp</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CreditCard className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-700">₹{caretaker.serviceCharge || 'N/A'}/visit</span>
          </div>
        </div>

        {caretaker.specialization && (
          <div className="bg-primary/5 p-2 rounded-md">
            <span className="font-medium text-primary block text-xs uppercase tracking-wide mb-1">Expertise</span>
            <p className="line-clamp-2">{caretaker.specialization}</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{caretaker.address || 'Location not specified'}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2">
              <ShieldCheck className="h-4 w-4" /> View Verified Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Verifier Profile: {caretaker.name}</DialogTitle>
              <DialogDescription>
                Official verification documents and contact details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm border-b pb-1">Contact Details</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center gap-2">
                     <Phone className="h-4 w-4 text-gray-500" />
                     <span>{caretaker.phone || 'Hidden'}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Building2 className="h-4 w-4 text-gray-500" />
                     <span className="truncate">{caretaker.companyName || 'Independent'}</span>
                   </div>
                </div>
              </div>

              {/* Verification Proofs */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm border-b pb-1">Verification Proofs</h4>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Company ID</span>
                      <Badge variant="outline">{caretaker.verification?.companyIdNumber || 'N/A'}</Badge>
                    </div>
                    {caretaker.verification?.companyIdUrl ? (
                      <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                        {/* In a real app, this would be an <Image> */}
                        [Company ID Card Image would be here]
                      </div>
                    ) : (
                      <div className="text-xs text-red-400 italic">Document pending</div>
                    )}
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Aadhaar Card</span>
                      <Badge variant="outline" className={caretaker.verification?.aadhaarUrl ? "bg-green-50" : ""}>
                        {caretaker.verification?.aadhaarUrl ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
