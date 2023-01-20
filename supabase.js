import { createClient } from "@supabase/supabase-js";

export const supabase = createClient("https://ypticbcztdwpynckjwag.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdGljYmN6dGR3cHluY2tqd2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQxMDYxNDUsImV4cCI6MTk4OTY4MjE0NX0.4DAAziEjQF3FFtK3GcH-g8RYUuz8wrPY6Az0GRxZEJQ")


 export const getSession = async() => {
    const {data, err} = await supabase.auth.getSession();
    return  data
  }

