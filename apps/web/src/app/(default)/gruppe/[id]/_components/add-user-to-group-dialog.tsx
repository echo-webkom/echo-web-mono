"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import {
  Button as AriaButton,
  Input as AriaInput,
  ComboBox,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { useForm } from "react-hook-form";
import { RxPlus as Plus } from "react-icons/rx";
import { type z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
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
import { useToast } from "@/hooks/use-toast";
import { addUserToGroupSchema } from "@/lib/schemas/add-user-to-group";
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
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<Array<User>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof addUserToGroupSchema>>({
    defaultValues: {
      userId: "",
    },
    resolver: zodResolver(addUserToGroupSchema),
  });

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          setUsers([]);
          return;
        }
        const data = (await response.json()) as Array<User>;
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error searching users:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const onSubmit = form.handleSubmit(async (data) => {
    const { success, message } = await addUserToGroup(data.userId, group.id);

    toast({
      title: message,
      variant: success ? "success" : "warning",
    });

    if (!success) {
      return;
    }

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
            <DialogBody>
              <FormField
                name="userId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="user">Bruker</FormLabel>
                    <FormControl>
                      <UserSearch
                        value={searchQuery}
                        onInputChange={setSearchQuery}
                        onChange={(userId) => {
                          field.onChange(userId);
                        }}
                        users={users}
                        isLoading={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Søk etter navn på brukeren du vil legge til i gruppen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
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
  onChange?: (userId: string) => void;
  value?: string;
  onInputChange?: (query: string) => void;
  isLoading?: boolean;
};

const UserSearch = ({ users, value, onInputChange, onChange, isLoading }: UserSearchProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inputWidth, setInputWidth] = useState(300);
  const displayItems = (() => {
    if (isLoading) {
      return [{ id: "loading", name: "Laster...", isSpecial: true }];
    }
    const typedLength = value?.length ?? 0;
    if (typedLength < 2) {
      return [{ id: "type_more", name: "Skriv minst 2 tegn", isSpecial: true }];
    }
    if (users.length === 0) {
      return [{ id: "empty", name: "Ingen brukere funnet", isSpecial: true }];
    }
    return users.map((user) => ({ ...user, isSpecial: false }));
  })();

  useLayoutEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setInputWidth(ref.current.offsetWidth);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ComboBox
      aria-label="user"
      name="user"
      menuTrigger="input"
      allowsCustomValue
      allowsEmptyCollection
      inputValue={value}
      onInputChange={(val) => {
        onInputChange?.(val);
      }}
      onSelectionChange={(data) => {
        const selectedId = data?.toString() ?? "";
        // Keep menu open and ignore non-selectable helper rows
        if (selectedId === "loading" || selectedId === "empty" || selectedId === "type_more") {
          return;
        }
        if (!selectedId) return;

        onChange?.(selectedId);
        const selectedUser = users.find((u) => u.id === selectedId);
        if (selectedUser && onInputChange) {
          onInputChange(selectedUser.name);
        }
      }}
    >
      <div
        ref={ref}
        className="group border-border bg-input ring-offset-background focus-visible:ring-ring relative flex h-10 w-full rounded-md border-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
      >
        <AriaInput
          placeholder="Søk etter bruker..."
          className="placeholder:text-muted-foreground h-full w-full border-0 bg-transparent px-3 py-2 ring-0 outline-0 placeholder:text-sm focus:ring-0 focus:outline-hidden"
        />
        <AriaButton className="text-muted-foreground absolute inset-y-0 right-0 flex items-center px-2">
          <ChevronDown className="h-4 w-4" />
        </AriaButton>
      </div>
      <Popover
        style={{
          minWidth: "280px",
          width: inputWidth,
          maxWidth: "640px",
        }}
        className="z-100"
      >
        <ListBox
          items={displayItems}
          className="border-border bg-input text-foreground flex max-h-96 w-full flex-col overflow-y-scroll rounded-md border-2 px-3 py-2"
        >
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.name}
              className="group focus:border-border focus:bg-muted selected:border-border selected:bg-muted flex cursor-default items-center gap-2 rounded border-2 border-transparent py-2 pr-4 pl-2 text-gray-900 outline-hidden select-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                className={
                  item.isSpecial ? "text-muted-foreground" : "text-foreground font-semibold"
                }
              >
                {item.name}
              </span>
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
};
