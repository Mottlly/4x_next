"use client";

// Force dynamic rendering to prevent static generation timeout
export const dynamic = "force-dynamic";

import i18n from "../../i18n";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HexBoard from "@/app/components/hexBoard/HexBoard";
import { useUserData } from "../../library/utililies/hooks/useUserData";
import LoadingScreen from "../components/gameUI/loadingScreen";

export default function GamePage() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameID = searchParams.get("gameID");

  const userData = useUserData(session);

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // redirect if not signed in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  // fetch or create
  useEffect(() => {
    const fetchOrCreate = async () => {
      if (status !== "authenticated" || !userData || !gameID) return;

      try {
        // try GET
        const getResp = await fetch(`/api/boardTable?game_id=${gameID}`);
        if (getResp.ok) {
          const { board: boardRef, board_id } = await getResp.json();
          setBoard({ id: board_id, ...boardRef });
        } else if (getResp.status === 404) {
          // run POST
          const postResp = await fetch("/api/boardTable", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: session.user.id,
              game_id: gameID,
            }),
          });
          if (!postResp.ok) throw new Error("Failed to create board");

          const { board: newRef, board_id: newId } = await postResp.json();
          setBoard({ id: newId, ...newRef });
        } else {
          throw new Error("Failed to fetch board");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreate();
  }, [status, session, userData, gameID]);

  if (loading) return <LoadingScreen />;
  if (error)
    return (
      <div>
        {t("gamePage.LoadingError")}: {error}
      </div>
    );
  if (!board || !Array.isArray(board.tiles)) {
    return <div>{t("gamePage.NoMapData")}</div>;
  }

  const boardTiles = { ...board };

  return (
    <div className="h-screen w-screen">
      <HexBoard board={boardTiles} />
    </div>
  );
}
