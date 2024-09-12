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
  Cloud,
  CreditCard,
  LifeBuoy,
  LogOut,
  Settings,
  TicketCheck,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

export const UserDropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { logOut } = useAuth();

  const handleLogout = async () => {
    await logOut();
    router.replace("/");
  };

  const menuItems = [
    { icon: User, label: "profile", route: "/profile", shortcut: "⇧⌘P" },
    { icon: Wallet, label: "wallet", route: "/wallet", shortcut: "⌘B" },
    { icon: Settings, label: "settings", route: "/settings", shortcut: "⌘S" },
    { icon: TicketCheck, label: "my.appointments", route: "/appointments", shortcut: "⌘K" },
    { icon: CreditCard, label: "contact.us", route: "/faq" },
    { icon: LifeBuoy, label: "support", route: "/hotline" },
  ];

  const MenuItem = ({ icon: Icon, label, route, shortcut }: any) => (
    <DropdownMenuItem onClick={() => router.push(route)}>
      <Icon className="mr-2 h-4 w-4" />
      <Translate value={label} />
      {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
    </DropdownMenuItem>
  );

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
          {menuItems.slice(0, 4).map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems.slice(4).map((item, index) => (
            <MenuItem key={index} {...item} />
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