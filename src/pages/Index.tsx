import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/EventCard";
import { CreateEventForm } from "@/components/CreateEventForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Sparkles } from "lucide-react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["events", searchTerm, locationFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (locationFilter) params.append("location", locationFilter);

      const { data, error } = await supabase.functions.invoke("list-events", {
        body: { search: searchTerm, location: locationFilter }
      });

      if (error) throw error;
      return data.data || [];
    },
  });

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-secondary py-20">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Discover Amazing Events</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Next Adventure
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Connect with people and discover events happening around you
            </p>
            <CreateEventForm onEventCreated={() => refetch()} />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-6">
          <div className="grid md:grid-cols-[1fr,1fr,auto] gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-muted-foreground">Loading events...</div>
          </div>
        ) : events && events.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to create an event in this area!
            </p>
            <CreateEventForm onEventCreated={() => refetch()} />
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;