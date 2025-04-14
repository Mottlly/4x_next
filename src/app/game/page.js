"use client";

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

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch or create board data (Backend now generates tiles)
  useEffect(() => {
    const fetchOrCreateBoard = async () => {
      if (status !== "authenticated" || !userData || !gameID) return;

      try {
        const getResponse = await fetch(`/api/boardTable?game_id=${gameID}`);

        if (getResponse.ok) {
          const boardData = await getResponse.json();
          console.log("Fetched board:", boardData);
          setBoard(boardData);
        } else if (getResponse.status === 404) {
          const postResponse = await fetch("/api/boardTable", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: session.user.id,
              game_id: gameID,
            }),
          });

          if (!postResponse.ok) {
            throw new Error("Failed to create new board.");
          }

          const createdData = await postResponse.json();

          const newBoard = {
            board: createdData.board.boardref,
          };

          console.log("Created new board:", newBoard);
          setBoard(newBoard);
        } else {
          throw new Error("Failed to fetch board data.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateBoard();
  }, [status, session, gameID, userData]);

  // Handle loading/error/empty states
  if (loading) return <LoadingScreen />;
  if (error)
    return (
      <div>
        {t("gamePage.LoadingError")}
        {error}
      </div>
    );
  if (!board || !board.board || !Array.isArray(board.board.tiles)) {
    return <div>{t("gamePage.NoMapData")}</div>;
  }

  const boardTiles = {
    ...board.board,
    cols: 25,
    rows: 25,
    spacing: 1.05,
  };

  console.log(boardTiles);

  return (
    <div className="h-screen w-screen">
      <HexBoard board={boardTiles} />
    </div>
  );
}
