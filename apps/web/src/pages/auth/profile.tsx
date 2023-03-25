import type {GetServerSideProps} from "next";
import Head from "next/head";
import Link from "next/link";
import Button from "@/components/button";
import Layout from "@/components/layout";
import {getServerSession} from "@echo-webkom/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {Degree, Role, Year} from "@prisma/client";
import {useSession} from "next-auth/react";
import {useForm, type SubmitHandler} from "react-hook-form";
import {z} from "zod";

const profileSchema = z.object({
  alternativeEmail: z.string().email().optional().or(z.literal("")),
  degree: z.nativeEnum(Degree),
  year: z.nativeEnum(Year),
});
type ProfileFormType = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const {data: session} = useSession({
    required: true,
  });

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      alternativeEmail: session?.user.alternativeEmail ?? "",
      degree: session?.user.degree ?? "",
      year: session?.user.year ?? "",
    },
  });

  const onSubmit: SubmitHandler<ProfileFormType> = async (data) => {
    await new Promise((r) => setTimeout(r, 100));

    console.log(data);
  };

  return (
    <>
      <Head>
        <title>Profil</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-3">
          <h1 className="mb-3 text-4xl font-bold md:text-6xl">Din profil</h1>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-lg text-neutral-500">Navn:</p>
              <p className="text-xl font-bold">{session?.user.name}</p>
            </div>
            <div>
              <p className="text-lg text-neutral-500">E-post:</p>
              <p className="text-xl font-bold">{session?.user.email}</p>
            </div>
            <div>
              <p className="text-lg text-neutral-500">Studentgruppe:</p>
              <p className="text-xl font-bold">
                {session?.user.studenteGroups ? session.user.studenteGroups.toString() : "Ingen"}
              </p>
            </div>
          </div>
          <hr className="my-4" />
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1">
              <p className="text-lg text-neutral-500">Alternativ e-post:</p>
              <input {...register("alternativeEmail")} className="form-input rounded-md" />
              {errors.alternativeEmail?.message && (
                <p className="text-sm text-red-500">
                  Alternativ e-post må være en gyldig e-postadresse
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg text-neutral-500">Studieretning:</p>
              <select {...register("degree")} className="form-select rounded-md">
                <option value="" disabled>
                  Velg studieretning
                </option>
                <option value="DTEK">Datateknologi</option>
                <option value="DSIK">Datasikkerhet</option>
                <option value="DVIT">Datavitenskap</option>
                <option value="BINF">Bioinformatikk</option>
                <option value="IMO">Informatikk-matematikk-økonomi</option>
                <option value="INF">Master i Informatikk</option>
                <option value="PROG">Programvareutvikling</option>
                <option value="DSC">Master i Data Science</option>
                <option value="ARMNINF">Årsstudie i informatikk</option>
                <option value="POST">Post-Bachelor</option>
                <option value="MISC">Annet</option>
              </select>
              {errors.degree?.message && (
                <p className="text-sm text-red-500">Velg en studieretning fra listen</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg text-neutral-500">Årstrinn:</p>
              <select {...register("year")} className="form-select rounded-md">
                <option value="" disabled>
                  Velg årstrinn
                </option>
                <option value="FIRST">1. året</option>
                <option value="SECOND">2. året</option>
                <option value="THIRD">3. året</option>
                <option value="FOURTH">4. året</option>
                <option value="FIFTH">5. året</option>
              </select>
              {errors.year?.message && (
                <p className="text-sm text-red-500">Velg et årstrinn fra listen</p>
              )}
            </div>

            <Button>Lagre</Button>
          </form>

          {session?.user.role === Role.ADMIN && (
            <div>
              <Link href="/dashboard">Til dashboard</Link>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default ProfilePage;
