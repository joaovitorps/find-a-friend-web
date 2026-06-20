import { PawIcon } from "./paw-icon";

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <PawIcon className="h-6 w-[26px] text-white" />
      <span className="text-2xl font-extrabold tracking-tight">
        FindAFriend
      </span>
    </div>
  );
}
