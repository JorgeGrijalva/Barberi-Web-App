"use client";

import { Translate } from "@/components/translate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hook/use-auth";
import {
  ChevronDown,
  CreditCard,
  LifeBuoy,
  LogOut,
  Settings,
  TicketCheck,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  route: string;
  shortcut?: string;
  router: ReturnType<typeof useRouter>;
}

const MenuItem = ({ icon: Icon, label, route, shortcut, router }: MenuItemProps) => (
  <DropdownMenuItem onClick={() => router.push(route)}>
    <Icon className="mr-2 h-4 w-4" />
    <Translate value={label} />
    {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
  </DropdownMenuItem>
);

export const UserDropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { logOut } = useAuth();

  const handleLogout = async () => {
    await logOut();
    router.replace("/");
  };

  const menuItems = [
    { icon: User, label: "profile", route: "/profile", shortcut: "⌘P" },
    { icon: Wallet, label: "wallet", route: "/wallet", shortcut: "⌘w" },
    { icon: Settings, label: "settings", route: "/settings", shortcut: "⌘S" },
    { icon: TicketCheck, label: "my.appointments", route: "/appointments", shortcut: "⌘K" },
    { icon: CreditCard, label: "contact.us", route: "/faq" },
    { icon: LifeBuoy, label: "support", route: "/hotline", shortcut: "⌘H" },
  ];

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "h" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/hotline");
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/appointments");
      }
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/profile");
      }
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/settings");
      }
      if (e.key === "w" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/wallet");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="w-16 bg-zinc-200/80 backdrop-blur-2xl rounded-full items-center flex cursor-pointer pr-2">
          {children}
          <ChevronDown className="h-4 w-4 pl-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-zinc-100/20 backdrop-blur-xl mx-4">
        <DropdownMenuLabel>
          <Translate value="my.account" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems.slice(0, 4).map((item) => (
            <MenuItem key={item.route} {...item} router={router} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems.slice(4).map((item) => (
            <MenuItem key={item.route} {...item} router={router} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <Translate value="logout" />
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
