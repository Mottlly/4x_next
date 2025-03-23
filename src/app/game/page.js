"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HexBoard from "@/app/components/HexBoard";

export default function GamePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameID = searchParams.get("gameID");
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);
  //Use Ref and/or context provider!!!
  useEffect(() => {
    const fetchOrCreateBoard = async () => {
      if (status !== "authenticated" || !session?.user?.id || !gameID) return;

      try {
        // ✅ Try to GET the board for this gameID
        const getResponse = await fetch(`/api/boardTable?game_id=${gameID}`);

        if (getResponse.ok) {
          const boardData = await getResponse.json();
          setBoard(boardData);
        } else if (getResponse.status === 404) {
          // ✅ If not found, POST a new board
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

          const newBoard = await postResponse.json();
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
  }, [status, session, gameID]);

  if (loading) return <div>Loading game...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!board) return <div>No board data available</div>;

  return (
    <div className="h-screen w-screen">
      <HexBoard board={board} />
    </div>
  );
}
