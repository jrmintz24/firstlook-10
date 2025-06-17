
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const rescheduleFormSchema = z.object({
  preferredDate: z.date({
    required_error: "Please select a preferred date",
  }),
  preferredTime: z.string({
    required_error: "Please select a preferred time",
  }),
  reason: z.string().optional(),
});

type RescheduleFormValues = z.infer<typeof rescheduleFormSchema>;

interface ShowingRequest {
  id: string;
  property_address: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
}

interface RescheduleShowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  showing: ShowingRequest | null;
  onRescheduleComplete: () => void;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30"
];

const RescheduleShowingModal = ({
  isOpen,
  onClose,
  showing,
  onRescheduleComplete
}: RescheduleShowingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RescheduleFormValues>({
    resolver: zodResolver(rescheduleFormSchema),
    defaultValues: {
      preferredDate: showing?.preferred_date ? new Date(showing.preferred_date) : undefined,
      preferredTime: showing?.preferred_time || undefined,
      reason: "",
    },
  });

  const handleSubmit = async (values: RescheduleFormValues) => {
    if (!showing) return;

    setIsSubmitting(true);
    try {
      console.log('Rescheduling showing:', showing.id, 'with values:', values);

      const { error } = await supabase
        .from('showing_requests')
        .update({
          preferred_date: format(values.preferredDate, 'yyyy-MM-dd'),
          preferred_time: values.preferredTime,
          status: 'pending', // Reset status to pending for admin review
          status_updated_at: new Date().toISOString(),
          internal_notes: values.reason ? `Reschedule reason: ${values.reason}` : null
        })
        .eq('id', showing.id);

      if (error) {
        console.error('Error rescheduling showing:', error);
        throw error;
      }

      toast({
        title: "Showing Rescheduled",
        description: "Your showing has been rescheduled and is pending confirmation.",
      });

      onRescheduleComplete();
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error rescheduling showing:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule showing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!showing) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reschedule Showing</DialogTitle>
          <DialogDescription>
            Update your showing request for {showing.property_address}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Preferred Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < tomorrow}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Rescheduling (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Let us know why you need to reschedule..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Rescheduling..." : "Reschedule Showing"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleShowingModal;
