"use client";

import React from "react";
import Link from "next/link";
import { Bell, Castle, CircleUser, Menu, Package, ShoppingCart, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useUserStore } from "@/providers/UserStoreProvider";
import { usePathname, useRouter } from "next/navigation";

const AuthorizedTemplate = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const router = useRouter();
	const { userId, isUserReady } = useUserStore(state => ({
		userId: state._id,
		isUserReady: state.isUserReady,
	}));

	if (isUserReady && !userId) {
		router.replace("/sign-in");
	}

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<div className="hidden border-r bg-muted/40 md:block">
				<div className="flex h-full max-h-screen flex-col gap-2">
					<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
						<Link href="/" className="flex items-center gap-2 font-semibold">
							<Image
								className="w-16 h-16 mix-blend-exclusion"
								src={"/images/WH.jpg"}
								alt="brand-logo"
								height={64}
								width={64}
							/>
							<span className="">Where2Go</span>
						</Link>
						<Button variant="outline" size="icon" className="ml-auto h-8 w-8">
							<Bell className="h-4 w-4" />
							<span className="sr-only">Toggle notifications</span>
						</Button>
					</div>
					<div className="flex-1">
						<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
							<Link
								href="/states"
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === "/states" ? "bg-muted" : "text-muted-foreground"}`}
							>
								<Castle className="h-4 w-4" />
								States
							</Link>
							<Link
								href="/cities"
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === "/cities" ? "bg-muted" : "text-muted-foreground"}`}
							>
								<Package className="h-4 w-4" />
								Cities{" "}
							</Link>
							<Link
								href="/destination-sites"
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === "/destination-sites" ? "bg-muted" : "text-muted-foreground"}`}
							>
								<Package className="h-4 w-4" />
								Destination Sites{" "}
							</Link>
							<Link
								href="/users"
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === "/users" ? "bg-muted" : "text-muted-foreground"}`}
							>
								<Users className="h-4 w-4" />
								Users
							</Link>
							<Link
								href="/admin-users"
								className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === "/admin-users" ? "bg-muted" : "text-muted-foreground"}`}
							>
								<Users className="h-4 w-4" />
								Admin Users
							</Link>
						</nav>
					</div>
				</div>
			</div>
			<div className="flex flex-col">
				<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-end">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon" className="shrink-0 md:hidden">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="flex flex-col">
							<nav className="grid gap-2 text-lg font-medium">
								<Link href="#" className="flex items-center gap-2 text-lg font-semibold">
									<Image
										className="w-16 h-16 mix-blend-exclusion"
										src={"/images/WH.jpg"}
										alt="brand-logo"
										height={64}
										width={64}
									/>
									<span className="sr-only">Where2Go</span>
								</Link>
								<Link
									href="/states"
									className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${pathname === "/states" ? "bg-muted" : "text-muted-foreground"}`}
								>
									<Castle className="h-5 w-5" />
									States
								</Link>
								<Link
									href="/cities"
									className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${pathname === "/cities" ? "bg-muted" : "text-muted-foreground"}`}
								>
									<ShoppingCart className="h-5 w-5" />
									Cities
								</Link>
								<Link
									href="/destination-sites"
									className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${pathname === "/destination-sites" ? "bg-muted" : "text-muted-foreground"}`}
								>
									<Package className="h-5 w-5" />
									Destination Sites
								</Link>
								<Link
									href="/users"
									className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${pathname === "/users" ? "bg-muted" : "text-muted-foreground"}`}
								>
									<Users className="h-5 w-5" />
									Users
								</Link>
								<Link
									href="/admin-users"
									className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${pathname === "/admin-users" ? "bg-muted" : "text-muted-foreground"}`}
								>
									<Users className="h-5 w-5" />
									Admin Users
								</Link>
							</nav>
						</SheetContent>
					</Sheet>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="secondary" size="icon" className="rounded-full">
								<CircleUser className="h-5 w-5" />
								<span className="sr-only">Toggle user menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Support</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</header>
				<main className="flex flex-1 flex-col gap-4 lg:gap-6 relative">{children}</main>
			</div>
		</div>
	);
};

export default AuthorizedTemplate;
