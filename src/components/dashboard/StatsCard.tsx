import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  moreInfoTo: string;
  variant?: "default" | "success" | "warning" | "info";
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  moreInfoTo,
  variant = "default" 
}: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-success text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-gradient-primary text-white";
    }
  };

  return (
    <Card className="group hover:shadow-medium transition-smooth">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-lg ${getVariantStyles()} group-hover:scale-110 transition-smooth`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground"
          onClick={() => {
            // In a real app, navigate to moreInfoTo route
            console.log(`Navigate to ${moreInfoTo}`);
          }}
        >
          More Info
        </Button>
      </CardContent>
    </Card>
  );
};