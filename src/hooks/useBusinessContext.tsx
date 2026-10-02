import { useEffect, useState } from "react";
import { BusinessContext, getMyBusiness } from "../apiservice/staff-service";
import { useAppSelector } from "../Redux/reduxCustomHook";
import type { RootState } from "../Redux/store";

// Shared across components so every page with a branch filter makes one request per login.
let cachedToken: string | undefined;
let cachedRequest: Promise<BusinessContext | null> | null = null;

/** Forget the cached business/branches so the next page load re-fetches them (call after branch changes). */
export const invalidateBusinessContext = () => {
  cachedRequest = null;
};

/** The logged-in staff member's business and its branches (null while loading or on error). */
export default function useBusinessContext() {
  const token = useAppSelector((state: RootState) => state.AdminAuthData?.access_token);
  const [context, setContext] = useState<BusinessContext | null>(null);

  useEffect(() => {
    if (!token) {
      setContext(null);
      return;
    }
    if (token !== cachedToken || !cachedRequest) {
      cachedToken = token;
      cachedRequest = getMyBusiness().catch(() => {
        cachedRequest = null;
        return null;
      });
    }
    let active = true;
    cachedRequest.then((result) => active && setContext(result));
    return () => {
      active = false;
    };
  }, [token]);

  return context;
}

/** Display label for a branch id within the current business. */
export const branchLabel = (context: BusinessContext | null, branchId: number | null | undefined) => {
  if (!branchId) return "All branches";
  return context?.branches.find((branch) => branch.id === branchId)?.branch_name || `Branch #${branchId}`;
};
