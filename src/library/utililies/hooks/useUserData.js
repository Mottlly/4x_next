import { useState, useEffect, useRef } from "react";
import { fetchUserData, createNewUser } from "../menu/menuUtilities";

export function useUserData(session) {
  const [userData, setUserData] = useState(null);
  // A ref to track if data has already been fetched
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (session?.user?.id && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchUserData(session.user.id, setUserData, () =>
        createNewUser(setUserData)
      );
    }
  }, [session]);

  return userData;
}
