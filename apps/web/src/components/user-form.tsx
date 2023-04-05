import {zodResolver} from "@hookform/resolvers/zod";
import cn from "classnames";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";

import {Degree, Year, type User} from "@echo-webkom/db/types";

import {api} from "@/utils/api";
import {degreeToString, yearToString} from "@/utils/profile";
import Button from "./button";
import {Input} from "./input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const userFormProps = z.object({
  alternativeEmail: z.string().email().or(z.literal("")).nullable().optional(),
  year: z.nativeEnum(Year).nullable().optional(),
  degree: z.nativeEnum(Degree).nullable().optional(),
});
type UserForm = z.infer<typeof userFormProps>;

type UserFormProps = {
  user: User;
};

const UserForm = ({user}: UserFormProps) => {
  const methods = useForm<UserForm>({
    resolver: zodResolver(userFormProps),
    defaultValues: {
      alternativeEmail: user.alternativeEmail,
      year: user.year,
      degree: user.degree,
    },
  });

  const updateProfile = api.auth.update.useMutation();

  const onSubmit = methods.handleSubmit(
    (data) => {
      // eslint-disable-next-line no-console
      console.log(data);
      updateProfile.mutate(data);
    },
    (errors) => {
      // eslint-disable-next-line no-console
      console.log(errors);

      // TODO: Add toast
    },
  );

  const alternativeEmailIsInvalid =
    methods.formState.errors.alternativeEmail?.type === "invalid_string";

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Input
          className={cn({
            "ring-2 ring-red-400 ring-offset-2": alternativeEmailIsInvalid,
          })}
          {...methods.register("alternativeEmail")}
          placeholder="E-post"
        />
        <p className="text-sm text-slate-500">E-post du vil vi skal ende til.</p>
        {alternativeEmailIsInvalid && <p className="text-sm text-red-500">Ugyldig e-postadresse</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Controller
          control={methods.control}
          name="year"
          render={({field}) => (
            <Select value={field.value as Year} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Velg årstrinn" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(yearToString).map(([value, year]) => (
                  <SelectItem key={value} value={value}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Controller
          control={methods.control}
          name="degree"
          render={({field}) => (
            <Select value={field.value as Degree} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Velg studieretning" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bachelor</SelectLabel>
                  {Object.entries(degreeToString.bachelor).map(([value, degree]) => (
                    <SelectItem key={value} value={value}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Master</SelectLabel>
                  {Object.entries(degreeToString.master).map(([value, degree]) => (
                    <SelectItem key={value} value={value}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Annet</SelectLabel>
                  {Object.entries(degreeToString.misc).map(([value, degree]) => (
                    <SelectItem key={value} value={value}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex gap-3">
        <Button>Lagre</Button>
      </div>
    </form>
  );
};

export default UserForm;
