import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  max_participants: number;
  current_participants: number;
}

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const isFull = event.current_participants >= event.max_participants;
  const spotsLeft = event.max_participants - event.current_participants;

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group"
      onClick={() => navigate(`/event/${event.id}`)}
    >
      <div className="h-32 bg-gradient-to-r from-primary to-accent group-hover:opacity-90 transition-opacity" />
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
          <Badge variant={isFull ? "destructive" : "default"}>
            {isFull ? "Full" : `${spotsLeft} left`}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(event.date), "MMM dd, yyyy")}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {event.current_participants} / {event.max_participants} participants
          </span>
        </div>
      </CardContent>
    </Card>
  );
};