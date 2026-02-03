"use client";

import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useProject } from "@/lib/project/context";
import { Project } from "@/lib/project/types";
import { ChevronsUpDownIcon, CircleCheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { CreateProject } from "./create-project";

export const ProjectSwitcher = () => {
  const { projects, project, updateProject } = useProject();

  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [selectProject, setSelectProject] = useState<Project | null>(null);

  useEffect(() => {
    setSelectProject(project);
  }, [project]);

  const handleUpdateProject = (project: Project) => {
    updateProject({ id: project.id, name: project.name, active: !project.isActive });
  };

  if (!selectProject) {
    return (
      <div className="w-auto max-w-xs">
        <Skeleton className="w-48 h-8 rounded-md" />
      </div>
    );
  }

  return (
    <div className="w-auto max-w-xs">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button id={id} variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-8">
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
            <CommandInput placeholder="Find project" />
            <CommandList>
              <CommandGroup>
                {projects.member.map((p: Project) => (
                  <CommandItem
                    key={p.id}
                    value={p.name}
                    onSelect={() => {
                      setSelectProject(p);
                      handleUpdateProject(p);
                      setOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Avatar className="size-6">
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
            </CommandList>
            <CommandSeparator />
            <CreateProject />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
