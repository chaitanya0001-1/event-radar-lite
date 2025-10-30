import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-event", {
        body: { id }
      });
      if (error) throw error;
      return data.data;
    },
  });

  const handleJoinEvent = async () => {
    if (!event || event.current_participants >= event.max_participants) {
      toast.error("Event is full!");
      return;
    }

    try {
      const { error } = await supabase
        .from("events")
        .update({ current_participants: event.current_participants + 1 })
        .eq("id", event.id);

      if (error) throw error;
      
      toast.success("Successfully joined the event!");
      // Refresh the data
      window.location.reload();
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("Failed to join event");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Button onClick={() => navigate("/")}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const isFull = event.current_participants >= event.max_participants;
  const spotsLeft = event.max_participants - event.current_participants;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <Card className="overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-primary to-accent" />
          
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                <CardDescription className="text-lg">
                  {event.description}
                </CardDescription>
              </div>
              <Badge variant={isFull ? "destructive" : "default"} className="text-sm">
                {isFull ? "Full" : `${spotsLeft} spots left`}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span className="text-lg">
                  {format(new Date(event.date), "MMMM dd, yyyy")}
                </span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span className="text-lg">
                  {format(new Date(event.date), "h:mm a")}
                </span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{event.location}</span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span className="text-lg">
                  {event.current_participants} / {event.max_participants} participants
                </span>
              </div>
            </div>

            <div className="pt-6">
              <Button
                onClick={handleJoinEvent}
                disabled={isFull}
                className="w-full text-lg py-6"
                size="lg"
              >
                {isFull ? "Event Full" : "Join Event"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetail;