import { Link } from "@tanstack/react-router";

import petHeroUrl from "@/assets/KMHcr.png";
import { AppLogo } from "@/components/app-logo";

export function LandingHero() {
  return (
    <main className="flex min-h-svh flex-col bg-[#f15156] text-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-7 pt-6 sm:px-8 sm:pt-7 lg:px-[113px] lg:pt-[25px]">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between">
          <AppLogo />
          <nav className="flex items-center gap-4 sm:gap-5">
            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center rounded-[24px] bg-white px-6 text-sm font-extrabold text-[#0d3b66] transition hover:bg-white/90"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="inline-flex h-12 items-center justify-center rounded-[24px] bg-[#f4d35e] px-6 text-sm font-extrabold text-[#0d3b66] transition hover:bg-[#f4d35e]/90"
            >
              Cadastrar ONG
            </Link>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="flex flex-1 flex-col lg:flex-row lg:items-start">
          {/* Text Content */}
          <div className="flex flex-col pt-16 sm:pt-24 lg:w-[55%] lg:pt-[170px]">
            <h1 className="max-w-[487px] text-[3rem] font-extrabold leading-[0.9] tracking-[-0.02em] sm:text-[3.8rem] lg:text-[4.5rem]">
              Leve{" "}
              <br />
              a felicidade
              <br />
              para o seu lar
            </h1>

            <p className="mt-8 max-w-[487px] text-lg font-semibold leading-[1.416] text-white/90 sm:text-xl lg:mt-auto lg:pb-12 lg:pt-10 lg:text-2xl">
              Encontre o animal de estimação ideal
              <br className="hidden sm:block" /> para seu estilo de vida!
            </p>
          </div>

          {/* Image */}
          <div className="mt-10 w-full sm:mt-14 lg:mt-0 lg:w-[45%] lg:max-w-[592px] lg:pt-[200px]">
            <img
              src={petHeroUrl}
              alt="Ilustração de animais de estimação"
              className="w-full rounded-[30px] drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
