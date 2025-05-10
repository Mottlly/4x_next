export function handleAction(action, activeAction, setActiveAction) {
  if (action === "build") {
    setActiveAction((prev) => (prev === "build" ? null : "build"));
  } else {
    setActiveAction(action);
  }
}
