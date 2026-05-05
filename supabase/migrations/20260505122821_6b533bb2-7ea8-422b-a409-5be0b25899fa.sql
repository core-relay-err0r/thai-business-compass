CREATE TABLE public.submission_rate_limits (
  ip_hash TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.submission_rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies = no public access; service role bypasses RLS.

CREATE INDEX idx_submission_rate_limits_window ON public.submission_rate_limits(window_start);