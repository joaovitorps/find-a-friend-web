import petHeroUrl from "@/assets/KMHcr.png";
import { AppLogo } from "@/components/app-logo";

export function CardLogo() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center rounded-[30px] bg-[#f15156] px-8 py-10 lg:h-full">
      <div className="px-[57px] pt-[30px]">
        <AppLogo />
      </div>
      <div className="mt-auto w-full px-[52px]">
        <img src={petHeroUrl} alt="Ilustração de animais de estimação" className="w-full" />
      </div>
    </div>
  );
}
