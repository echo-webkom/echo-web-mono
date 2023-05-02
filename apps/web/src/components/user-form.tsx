import {Controller, useForm} from "react-hook-form";

import {type Degree, type User} from "@echo-webkom/db/types";

import {useToast} from "@/hooks/use-toast";
import {api} from "@/utils/api";
import {Button} from "./ui/button";
import Input from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// TODO: Add client side form validation?
type FormValues = {
  alternativeEmail?: string;
  year?: string;
  degree?: string;
};

type UserFormProps = {
  user: User;
  refetchUser: () => void;
};

const UserForm = ({user, refetchUser}: UserFormProps) => {
  const {toast} = useToast();

  const userMutation = api.auth.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Profil oppdatert",
        description: "Din profil har blitt oppdatert.",
        variant: "success",
      });
      void methods.reset();
      void refetchUser();
    },
    onError: () => {
      toast({
        title: "Noe gikk galt",
        description: "Fikk ikke til å oppdatere profilen din",
        variant: "warning",
      });
    },
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      alternativeEmail: user.alternativeEmail ?? undefined,
      year: user.year?.toString() ?? undefined,
      degree: user.degree ?? undefined,
    },
  });

  const onSubmit = methods.handleSubmit(
    (data) => {
      userMutation.mutate({
        alternativeEmail: data.alternativeEmail ?? null,
        year: data.year ? parseInt(data.year, 10) : undefined,
        degree: data.degree as Degree,
      });
    },
    (err) => {
      console.error(err);
    },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Input {...methods.register("alternativeEmail")} placeholder="Alternativ e-post" />
      </div>

      <div className="flex flex-col gap-2">
        <Controller
          name="year"
          control={methods.control}
          render={({field}) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Velg årstrinn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1. trinn</SelectItem>
                <SelectItem value="2">2. trinn</SelectItem>
                <SelectItem value="3">3. trinn</SelectItem>
                <SelectItem value="4">4. trinn</SelectItem>
                <SelectItem value="5">5. trinn</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Controller
          name="degree"
          control={methods.control}
          render={({field}) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Velg studieretning" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bachelor</SelectLabel>
                  <SelectItem value="DSIK">Datasikkerhet</SelectItem>
                  <SelectItem value="DTEK">Datateknologi</SelectItem>
                  <SelectItem value="IMO">Informatikk-matematikk-økonomi</SelectItem>
                  <SelectItem value="DVIT">Datavitenskap</SelectItem>
                  <SelectItem value="BINF">Bioinformatikk</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Master</SelectLabel>
                  <SelectItem value="DSC">Master i datascience</SelectItem>
                  <SelectItem value="INF">Master i informatikk</SelectItem>
                  <SelectItem value="PROG">Programvareutvikling</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Annet</SelectLabel>
                  <SelectItem value="MISC">Annet</SelectItem>
                  <SelectItem value="ARMNINF">Årstudium i informatikk</SelectItem>
                  <SelectItem value="POST">Post-bachelor</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={!methods.formState.isDirty}>
          {userMutation.isLoading ? "Lagrer..." : "Lagre"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
