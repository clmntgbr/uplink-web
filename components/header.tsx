"use client";

import dynamic from "next/dynamic";
import { ProjectSwitcher } from "./project/project-switcher";
import { UserMenu } from "./user-menu";

const Menu = dynamic(() => import("./menu").then((mod) => mod.Menu), {
  ssr: false,
});

export function Header() {
  return (
    <div className="mx-auto border-b sticky top-0 bg-background z-10">
      <header className="max-w-7xl mx-auto grid grid-cols-3 h-16 shrink-0 items-center px-4">
        <div className="justify-self-start">
          <ProjectSwitcher />
        </div>
        <div className="justify-self-center">
          <Menu />
        </div>
        <div className="justify-self-end">
          <UserMenu />
        </div>
      </header>
    </div>
  );
}
