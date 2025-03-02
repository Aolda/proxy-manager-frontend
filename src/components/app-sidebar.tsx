import * as React from 'react';
import { Link, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { ArrowLeftRight, ShieldCheck, Server, TextSearch, CircleHelp } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
      title: '웹 프록시 서버',
      items: [
        {
          icon: ArrowLeftRight,
          title: '라우팅 설정',
          url: 'routing',
        },
        {
          icon: ShieldCheck,
          title: 'SSL 인증서',
          url: 'certificate',
        },
      ],
    },
    {
      title: 'SSH 포트포워딩',
      items: [
        {
          icon: Server,
          title: 'SSH 설정',
          url: 'forwarding',
        },
      ],
    },
    {
      title: '로그',
      items: [
        {
          icon: TextSearch,
          title: '설정 변경 내역',
          url: 'log',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { token } = useAuthStore();
  const location = useLocation();
  const selected = location.pathname.split('/')[1] || '';

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      {token ? (
        <SidebarHeader>
          <ProjectSwitcher projects={data.projects} defaultProject={data.projects[0]} />
        </SidebarHeader>
      ) : null}
      <SidebarContent>
        {data.menus.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={selected === item.url}
                      className={token ? '' : 'cursor-not-allowed opacity-50'}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to={import.meta.env.VITE_SUPPORT_URL}>
                <CircleHelp className="mr-2" />
                문의하기
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
