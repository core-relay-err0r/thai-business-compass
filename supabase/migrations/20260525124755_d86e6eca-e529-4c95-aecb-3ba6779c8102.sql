-- submission_rate_limits is written/read only by the send-submission edge function
-- using the service role key (which bypasses RLS). Add explicit restrictive policies
-- so the table cannot be accessed by anon or authenticated clients via the API.

CREATE POLICY "Deny all client access to rate limits"
ON public.submission_rate_limits
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);