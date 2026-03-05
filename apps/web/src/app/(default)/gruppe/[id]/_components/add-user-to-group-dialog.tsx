"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { RxPlus as Plus } from "react-icons/rx";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBodyOverflow,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addUserToGroupSchema } from "@/lib/schemas/add-user-to-group";
import { useUnoClient } from "@/providers/uno";
import { addUserToGroup } from "../actions";

type User = {
  id: string;
  name: string;
};

type AddUserToGroupDialogProps = {
  group: {
    id: string;
    name: string;
  };
};

export const AddUserToGroupDialog = ({ group }: AddUserToGroupDialogProps) => {
  const unoClient = useUnoClient();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<Array<User>>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<z.infer<typeof addUserToGroupSchema>>({
    defaultValues: {
      userId: "",
    },
    resolver: standardSchemaResolver(addUserToGroupSchema),
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setUsers([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startSearchTransition(async () => {
        try {
          const searchedUsers = await unoClient.users.search(query);
          setUsers(searchedUsers);
        } catch (error) {
          console.error("Error searching users:", error);
          setUsers([]);
        }
      });
    }, 300);
  };

  const handleSelectUser = (user: User) => {
    form.setValue("userId", user.id);
    setSearchQuery(user.name);
    setUsers([]);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    const { success, message } = await addUserToGroup(data.userId, group.id);

    if (!success) {
      toast.warning(message);
      return;
    }

    toast.success(message);
    form.reset();
    setSearchQuery("");
    setUsers([]);
    router.refresh();
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Legg til bruker i {group.name}
              </DialogTitle>
            </DialogHeader>
            <DialogBodyOverflow>
              <FormField
                name="userId"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel htmlFor="user">Bruker</FormLabel>
                    <FormControl>
                      <UserSearch
                        value={searchQuery}
                        onInputChange={handleSearchChange}
                        onSelect={handleSelectUser}
                        users={users}
                        isLoading={isSearching}
                      />
                    </FormControl>
                    <FormDescription>
                      Søk etter navn på brukeren du vil legge til i gruppen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBodyOverflow>
            <DialogFooter>
              <Button
                size="sm"
                type="submit"
                disabled={!form.watch("userId") || form.formState.isSubmitting}
              >
                Legg til
              </Button>
              <DialogClose asChild>
                <Button size="sm">Lukk</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

type UserSearchProps = {
  users: Array<User>;
  onSelect: (user: User) => void;
  value: string;
  onInputChange: (query: string) => void;
  isLoading: boolean;
};

const UserSearch = ({ users, value, onInputChange, onSelect, isLoading }: UserSearchProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const showDropdown = isFocused && value.length > 0;

  const statusMessage = (() => {
    if (isLoading) return "Laster...";
    if (value.length < 3) return "Skriv minst 3 tegn";
    if (users.length === 0) return "Ingen brukere funnet";
    return null;
  })();

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Søk etter bruker..."
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setTimeout(() => setIsFocused(false), 150);
        }}
        className="border-border bg-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border-2 px-3 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
      />
      {showDropdown && (
        <ul className="border-border bg-input text-foreground absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border-2 py-1">
          {statusMessage ? (
            <li className="text-muted-foreground px-3 py-2 text-sm">{statusMessage}</li>
          ) : (
            users.map((user) => (
              <li
                key={user.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(user);
                }}
                className="hover:bg-muted cursor-pointer rounded px-3 py-2 text-sm font-semibold"
              >
                {user.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
