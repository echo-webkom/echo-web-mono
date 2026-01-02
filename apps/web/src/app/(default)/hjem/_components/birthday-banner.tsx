import { auth } from "@/auth/session";
import ConfettiForBDay from "./confetti";

export default async function BirthdayBanner() {
  const user = await auth();
  const userName = user?.name;
  const firstName = userName?.split(" ")[0]?.toUpperCase();
  const hasBirthday =
    user?.birthday?.getMonth() === new Date().getMonth() &&
    user?.birthday?.getDate() === new Date().getDate();

  if (!hasBirthday) {
    return null;
  }

  return (
    <div className="bg-secondary flex h-14 items-center justify-center text-center">
      <h1 className="text-md mt-3 font-extrabold text-[#c26ce4] sm:mt-0 sm:text-2xl">
        🎉 GRATTIS MED DAGEN {firstName}! 🎉
      </h1>
      <ConfettiForBDay />
    </div>
  );
}
