import { useEffect, useState } from "react";
import { getMyPermissions } from "../apiservice/leave-service";
import { StaffPermissions } from "../components/admincomponents/Approvals/approvals.types";
import { useAppSelector } from "../Redux/reduxCustomHook";
import type { RootState } from "../Redux/store";

// Shared across components so the sidebar and route guards make a single request per login.
let cachedToken: string | undefined;
let cachedRequest: Promise<StaffPermissions> | null = null;

const NO_ACCESS: StaffPermissions = {
  is_manager: false,
  can_filter_branches: false,
  can_approve_leave: false,
  can_approve_requests: false,
};

/**
 * Permissions of the logged-in staff member. `permissions` is null while loading.
 * If the request fails, the user is treated as regular staff (least access).
 */
export default function useStaffPermissions() {
  const token = useAppSelector((state: RootState) => state.AdminAuthData?.access_token);
  const [permissions, setPermissions] = useState<StaffPermissions | null>(null);

  useEffect(() => {
    if (!token) {
      setPermissions(null);
      return;
    }
    if (token !== cachedToken || !cachedRequest) {
      cachedToken = token;
      cachedRequest = getMyPermissions().catch(() => {
        cachedRequest = null;
        return NO_ACCESS;
      });
    }
    let active = true;
    cachedRequest.then((result) => active && setPermissions(result));
    return () => {
      active = false;
    };
  }, [token]);

  return { permissions, loading: Boolean(token) && permissions === null };
}
