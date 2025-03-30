"use client"

import React, { useState } from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'
import { Code, ShieldAlert, GitFork, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Analyze',
    url: '/analyze',
    icon: Search,
  },
  {
    title: 'Security Dashboard',
    url: '/dashboard',
    icon: ShieldAlert,
  },
  {
    title: 'Vulnerabilities',
    url: '/vulnerabilities',
    icon: Code,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

const repositories = [
  { id: "1", name: "react-core", provider: "github" },
  { id: "2", name: "auth-service", provider: "gitlab" },
  { id: "3", name: "payment-gateway", provider: "github" },
  { id: "4", name: "mobile-app", provider: "bitbucket" },
];

const AppSideBar = () => {
  const pathname = usePathname();
  const { open } = useSidebar();
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>("1");

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="px-4 h-16 flex items-center border-b">
        {open ? (
          <h1 className="text-xl font-semibold">Git<span className="text-primary">Guardian</span></h1>
        ) : (
          <h1 className="text-xl font-semibold">G<span className="text-primary">G</span></h1>
        )}
      </SidebarHeader>

      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent className="list-none p-0 mt-2 px-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.url;
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.title} className="list-none">
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-md',
                        'text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Repositories Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Repositories
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-2 px-2 space-y-1">
            <SidebarMenu>
              {repositories.length ? (
                repositories.map((repo) => (
                  <SidebarMenuItem key={repo.id} className="list-none">
                    <SidebarMenuButton asChild>
                      <div
                        className="flex items-center gap-2 cursor-pointer w-full px-3 py-2 rounded-md hover:bg-accent"
                        onClick={() => setSelectedRepoId(repo.id)}
                      >
                        <GitFork className={cn(
                          "h-5 w-5",
                          selectedRepoId === repo.id ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div className="flex flex-col">
                          <span className="truncate text-sm font-medium">{repo.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">{repo.provider}</span>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem className="text-muted-foreground px-3 py-2 text-sm">
                  No repositories connected
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>

          <div className="h-2"></div>

          {open && (
            <SidebarMenuItem>
              <Link href="/connect-repo">
                <Button variant="outline" className="w-full gap-2">
                  <GitFork className="h-4 w-4" />
                  Add Repository
                </Button>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSideBar;