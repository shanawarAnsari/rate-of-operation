
import { useEffect } from "react";
import { useUserStore } from "../../store/userStore"
import { useFilterStore } from "../../store/rateOfOperationsFilterStore";
import { useWrenchtimeFilterStore } from "../../store/wrenchtimeFilterStore";

const SyncInterfaces = () => {
  const userAssignedInterfaces = useUserStore((state) => state.userAssignedInterfaces);
  const isUserSynced = useUserStore((state) => state.isUserSynced);
  const setIsUserSynced = useUserStore((state) => state.setIsUserSynced);

  const updateRateOfOpsInterface = useFilterStore((state) => state.updateFilterSelection);
  const updateWrenchtimeInterface = useWrenchtimeFilterStore((state) => state.updateFilterSelection);

  useEffect(() => {
    if (!isUserSynced && userAssignedInterfaces.length > 0) {
      updateRateOfOpsInterface("INTERFACE", userAssignedInterfaces);
      updateWrenchtimeInterface("INTERFACE", userAssignedInterfaces);
      setIsUserSynced(true);
    }
  }, [userAssignedInterfaces, isUserSynced]);

  return null;

};

export default SyncInterfaces;
