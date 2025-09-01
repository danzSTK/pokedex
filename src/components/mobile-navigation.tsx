"use client";

import Link from "next/link";
import Header from "./header";
import { Button } from "./ui/button";
import { Filter, Heart, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

const MobileNavigationbar = () => {
  const path = usePathname();

  const isActive = useCallback(
    (href: string) => {
      return path === href;
    },
    [path]
  );

  return (
    <Header className="fixed bottom-0 top-auto backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <nav className="flex w-full">
        <ul className="grid grid-cols-3 w-full place-items-center">
          <li>
            <Link href="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size={"lg"}
                className="grid grid-col-1 place-items-center gap-0 py-2"
              >
                <Home />
                <span className="text-xs">Home</span>
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/favorites">
              <Button
                variant={isActive("/favorites") ? "default" : "ghost"}
                size={"lg"}
                className="grid grid-col-1 place-items-center gap-0 py-2"
              >
                <Heart />
                <span className="text-xs">Favorites</span>
              </Button>
            </Link>
          </li>
          <li>
            <Button
              variant={"ghost"}
              size={"lg"}
              className="grid grid-col-1 place-items-center gap-0"
            >
              <Filter />
              <span className="text-xs">Filters</span>
            </Button>
          </li>
        </ul>
      </nav>
    </Header>
  );
};

export default MobileNavigationbar;
