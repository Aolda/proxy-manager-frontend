import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ProjectSwitcher } from '@/components/project-switcher';

const data = {
  projects: ['aolda_edu', 'proxy_manager', 'blog'],
  menus: [
    {
      title: '웹 프록시 설정',
      items: [
        {
          title: '라우팅 설정',
          url: '#',
          isActive: true,
        },
        {
          title: 'SSL 인증서',
          url: '#',
          isActive: false,
        },
      ],
    },
    {
      title: 'SSH 포트 포워딩',
      items: [
        {
          title: 'SSH 설정',
          url: '#',
          isActive: false,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <ProjectSwitcher projects={data.projects} defaultProject={data.projects[0]} />
      </SidebarHeader>
      <SidebarContent>
        {data.menus.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
