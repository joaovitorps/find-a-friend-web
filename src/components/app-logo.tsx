import { PawIcon } from "./paw-icon";

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <PawIcon className="h-6 w-6.5 text-[#f15156]" />
      <span className="font-extrabold text-2xl tracking-tight">FindAFriend</span>
    </div>
  );
}
