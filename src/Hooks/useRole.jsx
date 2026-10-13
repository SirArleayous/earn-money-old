import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

// The role always comes from the server. No localStorage or email overrides: those showed the
// wrong dashboard whenever the request failed or another person used the same browser.
const useRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const { data: role = "", isPending } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => (await axiosSecure.get(`/api/users/role/${user.email}`)).data?.role || "",
    retry: 1,
    staleTime: 60 * 1000,
  });

  return [role, loading || (!!user?.email && isPending)];
};

export default useRole;