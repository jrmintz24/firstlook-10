
import { useToast } from "@/hooks/use-toast";

export const createToastHelper = () => {
  const { toast } = useToast();

  return {
    success: (title: string, description?: string) => {
      toast({
        title,
        description,
      });
    },
    error: (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: "destructive"
      });
    }
  };
};
