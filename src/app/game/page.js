"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HexBoard from "@/app/components/HexBoard";

export default function GamePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const createAndFetchBoard = async () => {
        try {
          // ✅ Step 1: POST a new board to the database
          const postResponse = await fetch("/api/boardTable", {
            // ✅ Correct path
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: session.user.id }),
          });

          if (!postResponse.ok) {
            throw new Error("Failed to create board.");
          }

          const postData = await postResponse.json();
          const boardId = postData.board.id; // Assuming the API returns the new board ID

          // ✅ Step 2: GET the newly created board
          const getResponse = await fetch(`/api/board?id=${boardId}`);
          if (!getResponse.ok) {
            throw new Error("Failed to fetch board data.");
          }

          const boardData = await getResponse.json();
          setBoard(boardData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      createAndFetchBoard();
    }
  }, [status, session]);

  if (loading) return <div>Loading game...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!board) return <div>No board data available</div>;

  return (
    <div className="h-screen w-screen">
      <HexBoard board={board} />
    </div>
  );
}
