import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Camera, 
  Shield, 
  Heart, 
  Clock, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  PawPrint
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">PetCare</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="lg">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              Trusted by 1000+ Pet Owners
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Travel Worry-Free with
              <span className="text-blue-600"> Real-Time Pet Care</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with certified pet caretakers and track your pet's activities, 
              location, and health in real-time. Peace of mind, guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=user">
                <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                  Find a Caretaker
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register?role=zoo_manager">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Become a Caretaker
                </Button>
              </Link>

            </div>

            {/* Search Bar */}
            <div className="mt-12 max-w-lg mx-auto bg-white p-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2">
              <MapPin className="ml-3 h-5 w-5 text-gray-400" />
              <form action="/caretakers" className="flex-1 flex gap-2">
                <input 
                  name="pincode"
                  type="text" 
                  placeholder="Enter Pincode (e.g. 560001)"
                  className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit pincode"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Everything You Need for Pet Care
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides complete transparency and peace of mind while you're away
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Real-Time GPS Tracking</CardTitle>
                <CardDescription className="text-base">
                  Know exactly where your pet is at all times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Live GPS location updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Google Maps integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Address lookup and history</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Daily Photo Updates</CardTitle>
                <CardDescription className="text-base">
                  See your pet's activities throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Multiple photos per activity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Photo gallery with timestamps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Instant notifications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Health & Activity Logs</CardTitle>
                <CardDescription className="text-base">
                  Complete digital records of pet care
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Feeding, walking, playing logs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Medical check records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Activity statistics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Verified Caretakers</CardTitle>
                <CardDescription className="text-base">
                  All caretakers are certified and approved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Admin verification required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Verified pet caretakers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Background checked</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">24/7 Monitoring</CardTitle>
                <CardDescription className="text-base">
                  Round-the-clock care and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Continuous activity tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Real-time notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Emergency alerts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Transparent Communication</CardTitle>
                <CardDescription className="text-base">
                  Direct connection with your caretaker
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Activity-based updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Contact information shared</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Complete transparency</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Account</h3>
              <p className="text-gray-600">
                Sign up as a pet owner and add your pet's details including medical information
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Find a Caretaker</h3>
              <p className="text-gray-600">
                Browse verified pet caretakers and request care for your desired dates
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Track & Relax</h3>
              <p className="text-gray-600">
                Receive real-time updates, photos, and location tracking while you travel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Happy Pet Owners</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Verified Caretakers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Care Sessions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Ready to Give Your Pet the Best Care?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of pet owners who trust PetCare for their pet's safety and happiness
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=user">
                <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                  Get Started as Pet Owner
                </Button>
              </Link>
              <Link href="/register?role=zoo_manager">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Become a Caretaker
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">PetCare</span>
              </div>
              <p className="text-sm">
                Professional pet care with real-time tracking and complete transparency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Pet Owners</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register?role=user" className="hover:text-white">Find a Caretaker</Link></li>
                <li><Link href="/login" className="hover:text-white">Track Your Pet</Link></li>
                <li><Link href="#" className="hover:text-white">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Caretakers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register?role=zoo_manager" className="hover:text-white">Become a Caretaker</Link></li>
                <li><Link href="/login" className="hover:text-white">Caretaker Login</Link></li>
                <li><Link href="#" className="hover:text-white">Requirements</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">About Us</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 PetCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
