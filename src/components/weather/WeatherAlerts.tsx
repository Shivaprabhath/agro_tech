
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWeather } from "@/contexts/WeatherContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const WeatherAlerts: React.FC = () => {
  const { alerts } = useWeather();
  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Weather Alerts</DrawerTitle>
          <DrawerDescription>
            Important weather notifications for your tracked locations
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[50vh] px-4">
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-lg ${
                    alert.read ? 'bg-background' : 'bg-destructive/10 border-destructive/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{alert.city} - {alert.condition}</div>
                    <Badge variant={alert.read ? "outline" : "destructive"}>
                      {alert.read ? "Read" : "New"}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">{alert.description}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No weather alerts at this time
            </div>
          )}
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default WeatherAlerts;
