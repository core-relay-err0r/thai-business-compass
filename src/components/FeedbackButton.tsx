import { useState } from "react";
import { MessageSquarePlus, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

type Status = "idle" | "sending" | "success" | "error";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const isMobile = useIsMobile();

  const handleOpen = () => {
    setOpen(true);
    setPageUrl(window.location.href);
    setStatus("idle");
    setErrorMsg("");
    setFeedback("");
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    setStatus("sending");
    try {
      const { data, error } = await supabase.functions.invoke(
        "send-feedback-to-telegram",
        {
          body: {
            feedback: feedback.trim(),
            pageUrl,
            timestamp: new Date().toISOString(),
          },
        }
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setStatus("success");
    } catch (e: any) {
      setErrorMsg(e?.message || "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>

      {isMobile ? (
        /* Mobile: compact bottom-right pill */
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-primary/20 bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-[0_4px_24px_hsl(var(--primary)/0.15),0_1px_4px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_6px_32px_hsl(var(--primary)/0.25),0_2px_8px_rgba(0,0,0,0.25)] active:scale-[0.97]"
          aria-label="Give Feedback"
        >
          <MessageSquarePlus className="h-4 w-4" style={{ stroke: 'url(#gold-gradient)' }} />
          <span className="text-xs">Feedback</span>
        </button>
      ) : (
        /* Desktop: vertical right-edge tab, bottom-right */
        <button
          onClick={handleOpen}
          className="fixed right-0 bottom-8 z-50 flex items-center gap-2 rounded-l-lg border border-r-0 border-primary/20 bg-foreground px-3 py-4 text-background shadow-[0_4px_24px_hsl(var(--primary)/0.15),0_1px_4px_rgba(0,0,0,0.2)] transition-all duration-200 hover:border-primary/40 hover:shadow-[0_6px_32px_hsl(var(--primary)/0.25),0_2px_8px_rgba(0,0,0,0.25)] hover:pr-4"
          style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
          aria-label="Give Feedback"
        >
          <MessageSquarePlus className="h-4 w-4 rotate-90" style={{ stroke: 'url(#gold-gradient)' }} />
          <span className="text-xs font-medium tracking-wider">Give Feedback</span>
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send feedback</DialogTitle>
            <DialogDescription>
              Let us know how we can improve. Write in any language.
            </DialogDescription>
          </DialogHeader>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-sm text-muted-foreground">
                Thank you! Your feedback has been sent.
              </p>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Textarea
                placeholder="Your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                maxLength={5000}
                rows={4}
                disabled={status === "sending"}
              />
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Page URL (optional)
                </label>
                <Input
                  value={pageUrl}
                  onChange={(e) => setPageUrl(e.target.value)}
                  disabled={status === "sending"}
                />
              </div>
              {status === "error" && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}
              <Button
                onClick={handleSubmit}
                disabled={!feedback.trim() || status === "sending"}
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
