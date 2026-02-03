"use client";

import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useProject } from "@/lib/project/context";
import { Project } from "@/lib/project/types";
import { ChevronsUpDownIcon, CircleCheckIcon, PlusIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const ProjectSwitcher = () => {
  const { projects, project } = useProject();

  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [selectProject, setSelectProject] = useState<Project | null>(null);

  useEffect(() => {
    setSelectProject(project);
  }, [project]);

  if (!project) {
    return null;
  }

  return (
    <div className="w-auto max-w-xs">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button id={id} variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-10">
            {selectProject ? (
              <span className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage src={selectProject.name} alt={selectProject.name} />
                  <AvatarFallback>{selectProject.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{selectProject.name}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select user</span>
            )}
            <ChevronsUpDownIcon className="text-muted-foreground/80 shrink-0 right-0" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="data-[state=open]:zoom-in-0! origin-center p-0 duration-500">
          <Command>
            <CommandInput placeholder="Find university" />
            <CommandList>
              <CommandEmpty>No university found.</CommandEmpty>
              <CommandGroup>
                {projects.member.map((p: Project) => (
                  <CommandItem
                    key={p.id}
                    value={p.id}
                    onSelect={() => {
                      setSelectProject(p);
                      setOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src={p.name} alt={p.name} />
                        <AvatarFallback>{p.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="flex flex-col">
                        <span className="font-medium">{p.name}</span>
                      </span>
                    </span>
                    {selectProject?.id === p.id && <CircleCheckIcon className="ml-auto fill-blue-500 stroke-white" />}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  <PlusIcon className="-ms-2 opacity-60" aria-hidden="true" />
                  New university
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
