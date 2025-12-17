"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarLayout } from "@/components/sidebar-layout";
import { HealthRecords } from "@/components/health-records";

export default function UserDashboard() {
  const [pets, setPets] = useState([]);
  const [careRequests, setCareRequests] = useState([]);
  const [zooManagers, setZooManagers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showAddPet, setShowAddPet] = useState(false);
  const [showRequestCare, setShowRequestCare] = useState(false);
  const [showHealthRecords, setShowHealthRecords] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedRequestForActivities, setSelectedRequestForActivities] =
    useState<string | null>(null);

  const [petForm, setPetForm] = useState({
    name: "",
    breed: "",
    age: "",
    medicalInfo: "",
  });

  const [careForm, setCareForm] = useState({
    petId: "",
    zooManagerId: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchPets();
    fetchCareRequests();
    fetchZooManagers();
  }, []);

  const fetchPets = async () => {
    const res = await fetch("/api/pets");
    const data = await res.json();
    if (res.ok) setPets(data.pets);
  };

  const fetchCareRequests = async () => {
    const res = await fetch("/api/care-requests");
    const data = await res.json();
    if (res.ok) setCareRequests(data.requests);
  };

  const fetchZooManagers = async () => {
    const res = await fetch("/api/zoo-managers");
    const data = await res.json();
    if (res.ok) setZooManagers(data.zooManagers);
  };

  const fetchActivities = async (careRequestId: string) => {
    setIsLoadingActivities(true);
    setShowHealthRecords(true);
    setActivities([]); // Clear previous activities
    try {
      const res = await fetch(`/api/activities?careRequestId=${careRequestId}`);
      const data = await res.json();
      if (res.ok) {
        setActivities(data.activities);
        setSelectedRequestForActivities(careRequestId);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...petForm, age: parseInt(petForm.age) }),
    });
    if (res.ok) {
      setShowAddPet(false);
      fetchPets();
      setPetForm({ name: "", breed: "", age: "", medicalInfo: "" });
    }
  };

  const handleRequestCare = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/care-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(careForm),
    });
    if (res.ok) {
      setShowRequestCare(false);
      fetchCareRequests();
      setCareForm({
        petId: "",
        zooManagerId: "",
        startDate: "",
        endDate: "",
        notes: "",
      });
    }
  };

  const pendingRequests = careRequests.filter(
    (r: any) => r.status === "pending"
  );
  const acceptedRequests = careRequests.filter(
    (r: any) => r.status === "accepted"
  );
  const completedRequests = careRequests.filter(
    (r: any) => r.status === "completed"
  );

  return (
    <SidebarLayout userRole="user">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
          <p className="text-blue-100">
            Manage your pets and track their care activities
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                My Pets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-900">
                {pets.length}
              </p>
              <p className="text-xs text-purple-600">Registered pets</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Care Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-900">
                {careRequests.length}
              </p>
              <p className="text-xs text-blue-600">Total requests</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Active Care
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-900">
                {acceptedRequests.length}
              </p>
              <p className="text-xs text-green-600">Currently active</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">
                Available Caretakers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-900">
                {zooManagers.length}
              </p>
              <p className="text-xs text-orange-600">Verified managers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">My Pets</h2>
              <Dialog open={showAddPet} onOpenChange={setShowAddPet}>
                <DialogTrigger asChild>
                  <Button>Add Pet</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Pet</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddPet} className="space-y-4">
                    <div>
                      <Label>Pet Name</Label>
                      <Input
                        value={petForm.name}
                        onChange={(e) =>
                          setPetForm({ ...petForm, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Breed</Label>
                      <Input
                        value={petForm.breed}
                        onChange={(e) =>
                          setPetForm({ ...petForm, breed: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={petForm.age}
                        onChange={(e) =>
                          setPetForm({ ...petForm, age: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Medical Info</Label>
                      <Textarea
                        value={petForm.medicalInfo}
                        onChange={(e) =>
                          setPetForm({
                            ...petForm,
                            medicalInfo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button type="submit">Add Pet</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {pets.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl">🐾</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Pets Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm text-center mb-6">
                      Add your first pet to start requesting care services from
                      verified caretakers.
                    </p>
                    <Button onClick={() => setShowAddPet(true)} size="lg">
                      Add Your First Pet
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                pets.map((pet: any) => (
                  <Card
                    key={pet._id}
                    className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{pet.name}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {pet.breed} • {pet.age} years old
                          </CardDescription>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🐕</span>
                        </div>
                      </div>
                    </CardHeader>
                    {pet.medicalInfo && (
                      <CardContent className="pt-0">
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                          <p className="text-sm font-semibold text-red-900 mb-1">
                            ⚕️ Medical Information:
                          </p>
                          <p className="text-sm text-red-700">
                            {pet.medicalInfo}
                          </p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Care Requests
              </h2>
              <Dialog open={showRequestCare} onOpenChange={setShowRequestCare}>
                <DialogTrigger asChild>
                  <Button>Request Care</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Request Pet Care</DialogTitle>
                    <DialogDescription>
                      Select a pet and verified caretaker to request care
                      services
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRequestCare} className="space-y-4">
                    {pets.length === 0 ? (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          Please add a pet first before requesting care.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <Label>Select Pet</Label>
                          <Select
                            value={careForm.petId}
                            onValueChange={(value) =>
                              setCareForm({ ...careForm, petId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a pet" />
                            </SelectTrigger>
                            <SelectContent>
                              {pets.map((pet: any) => (
                                <SelectItem key={pet._id} value={pet._id}>
                                  {pet.name} ({pet.breed}, {pet.age} years)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Select Caretaker</Label>
                          {zooManagers.length === 0 ? (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-2">
                              <p className="text-sm text-blue-800 font-medium mb-1">
                                No verified caretakers available yet
                              </p>
                              <p className="text-xs text-blue-700">
                                Please wait for zoo managers to register and get
                                verified by the admin. Check back later or
                                contact support.
                              </p>
                            </div>
                          ) : (
                            <>
                              <Select
                                value={careForm.zooManagerId}
                                onValueChange={(value) =>
                                  setCareForm({
                                    ...careForm,
                                    zooManagerId: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a caretaker" />
                                </SelectTrigger>
                                <SelectContent>
                                  {zooManagers.map((manager: any) => (
                                    <SelectItem
                                      key={manager._id}
                                      value={manager._id}
                                    >
                                      <div className="flex flex-col">
                                        <span className="font-medium">
                                          {manager.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {manager.email}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-1">
                                {zooManagers.length} verified caretaker
                                {zooManagers.length > 1 ? "s" : ""} available
                              </p>
                            </>
                          )}
                        </div>
                      </>
                    )}
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={careForm.startDate}
                        onChange={(e) =>
                          setCareForm({
                            ...careForm,
                            startDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={careForm.endDate}
                        onChange={(e) =>
                          setCareForm({ ...careForm, endDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Special Notes (Optional)</Label>
                      <Textarea
                        value={careForm.notes}
                        onChange={(e) =>
                          setCareForm({ ...careForm, notes: e.target.value })
                        }
                        placeholder="Any special instructions, dietary requirements, or important information..."
                        rows={3}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={pets.length === 0 || zooManagers.length === 0}
                    >
                      Submit Care Request
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {careRequests.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl">📋</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No Care Requests
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm text-center mb-6">
                      You haven't requested any care services yet. Create a
                      request to find a caretaker for your pet.
                    </p>
                    {pets.length > 0 && zooManagers.length > 0 && (
                      <Button
                        onClick={() => setShowRequestCare(true)}
                        size="lg"
                      >
                        Request Care Now
                      </Button>
                    )}
                    {pets.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Add a pet first to request care
                      </p>
                    )}
                    {zooManagers.length === 0 && pets.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Waiting for verified caretakers to become available
                      </p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                careRequests.map((request: any) => (
                  <Card
                    key={request._id}
                    className={`hover:shadow-lg transition-shadow border-l-4 ${
                      request.status === "accepted"
                        ? "border-l-green-500 bg-green-50/30"
                        : request.status === "pending"
                        ? "border-l-yellow-500 bg-yellow-50/30"
                        : request.status === "rejected"
                        ? "border-l-red-500 bg-red-50/30"
                        : "border-l-gray-500"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">
                              {request.pet?.name}
                            </CardTitle>
                            <Badge
                              variant={
                                request.status === "accepted"
                                  ? "default"
                                  : request.status === "pending"
                                  ? "secondary"
                                  : request.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {request.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-base">
                            {request.pet?.breed} • {request.pet?.age} years old
                          </CardDescription>
                          <CardDescription className="mt-1 flex items-center gap-1">
                            <span className="font-medium">Caretaker:</span>{" "}
                            {request.zooManager?.name}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Care Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.startDate).toLocaleDateString()} -{" "}
                          {new Date(request.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      {request.notes && (
                        <div>
                          <p className="text-sm font-medium">Your Notes</p>
                          <p className="text-sm text-muted-foreground">
                            {request.notes}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">Caretaker Contact</p>
                        <p className="text-sm text-muted-foreground">
                          {request.zooManager?.email}
                        </p>
                        {request.zooManager?.phone && (
                          <p className="text-sm text-muted-foreground">
                            {request.zooManager.phone}
                          </p>
                        )}
                      </div>
                      {request.status === "accepted" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fetchActivities(request._id)}
                          className="w-full mt-2"
                        >
                          📊 View Activities & Health Records
                        </Button>
                      )}
                      {request.status === "pending" && (
                        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-xs text-yellow-800">
                            ⏳ Waiting for caretaker to accept your request
                          </p>
                        </div>
                      )}
                      {request.status === "rejected" && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-xs text-red-800">
                            ❌ This request was declined. Try requesting from
                            another caretaker.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Health Records Modal */}
        <Dialog open={showHealthRecords} onOpenChange={setShowHealthRecords}>
          <DialogContent className="sm:max-w-[1200px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Activity History & Health Records</DialogTitle>
              <DialogDescription>
                View detailed logs of all activities and health updates during
                this care session.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 w-full">
              <HealthRecords activities={activities} isLoading={isLoadingActivities} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
}
