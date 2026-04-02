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

type Status = "idle" | "sending" | "success" | "error";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_32px_rgba(0,0,0,0.3)] active:scale-[0.97] sm:px-5 sm:py-3"
        style={{
          border: '1.5px solid transparent',
          backgroundClip: 'padding-box',
          WebkitBackgroundClip: 'padding-box',
        }}
        aria-label="Ask a question"
      >
        <span className="pointer-events-none absolute inset-0 rounded-full" style={{ padding: '1.5px', background: 'linear-gradient(135deg, #d4a843, #f0d78c, #ffffff, #f0d78c, #d4a843)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
        <MessageSquarePlus className="relative h-4 w-4 sm:h-5 sm:w-5" />
        <span className="relative text-xs sm:text-sm">Ask a question</span>
      </button>

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
