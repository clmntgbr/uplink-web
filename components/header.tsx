"use client";

import { Menu } from "./menu";
import { ProjectSwitcher } from "./project/project-switcher";
import { UserMenu } from "./user-menu";

export function Header() {
  return (
    <div className="mx-auto border-b sticky top-0 bg-background z-10">
      <header className="max-w-7xl  mx-auto flex h-16 shrink-0 items-center gap-2 px-4 justify-between">
        <ProjectSwitcher />
        <Menu />
        <UserMenu />
      </header>
    </div>
  );
}
