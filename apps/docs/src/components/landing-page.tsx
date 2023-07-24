import Image from "next/image";

export const LandingPage = () => {
  return (
    <div className="mx-auto w-full max-w-lg space-y-10 py-24">
      <Image
        src="/images/webkom.png"
        alt="echo Webkom"
        width={128}
        height={128}
        className="mx-auto"
      />

      <h1 className="text-center text-6xl font-semibold">echo Webkom</h1>

      <p className="text-center">
        Velkommen til dokumentasjonen for echo Webkom. Her finner du informasjon om hvordan vi
        jobber, og hvordan du kan bidra.
      </p>
    </div>
  );
};
