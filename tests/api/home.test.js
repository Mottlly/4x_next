import { render, screen } from "@testing-library/react";
import Home from "../../src/app/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

test("renders the homepage with a logged-out user", () => {
  useSession.mockReturnValue({ data: null, status: "unauthenticated" });
  useRouter.mockReturnValue({ push: jest.fn() }); // Mock `useRouter()`

  render(<Home />);

  expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
});
