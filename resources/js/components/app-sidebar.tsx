import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    FolderGit2,
    GanttChartSquare,
    LayoutGrid,
    ShoppingCart,
    Users,
    Box,
    Repeat,
    DollarSign,
    FileText,
    Settings,
    HardHat,
    Package,
    Truck,
    RotateCcw,
    Mail,
    Rss,
    ClipboardList,
    ChevronRight,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { dashboard } from '@/routes';
import { useTranslation } from '@/hooks/use-translation';

type NavItem = { label: string; href: string; icon: React.ElementType };
type NavGroup = { label: string; icon: React.ElementType; items: NavItem[] };

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const currentUrl = usePage().url;
    const { t } = useTranslation();

    const NAV_GROUPS: NavGroup[] = [
        {
            label: t('dash_catalogue'),
            icon: Package,
            items: [
                { label: t('dash_products'),   href: '/dashboard/produits',    icon: Package   },
                { label: t('dash_categories'), href: '/dashboard/categories',  icon: FolderGit2 },
            ],
        },
        {
            label: t('dash_sales'),
            icon: ShoppingCart,
            items: [
                { label: t('dash_sales'),   href: '/dashboard/ventes',    icon: ShoppingCart },
                { label: t('dash_orders'),  href: '/dashboard/commandes', icon: BookOpen     },
            ],
        },
        {
            label: t('dash_clients'),
            icon: Users,
            items: [
                { label: t('dash_clients'), href: '/dashboard/clients', icon: Users },
            ],
        },
        {
            label: t('dash_stock'),
            icon: Box,
            items: [
                { label: t('dash_movements'),   href: '/dashboard/mouvements',        icon: Repeat },
                { label: t('dash_adjustments'), href: '/dashboard/stock/ajustements', icon: Box    },
            ],
        },
        {
            label: t('dash_logistics'),
            icon: Truck,
            items: [
                { label: t('dash_logistics'), href: '/dashboard/logistique',   icon: Truck            },
                { label: t('dash_planning'),  href: '/dashboard/planification', icon: GanttChartSquare },
            ],
        },
        {
            label: t('dash_agenda'),
            icon: CalendarDays,
            items: [
                { label: t('dash_agenda'), href: '/dashboard/agenda', icon: CalendarDays },
            ],
        },
        {
            label: t('dash_finances'),
            icon: DollarSign,
            items: [
                { label: t('dash_payments'), href: '/dashboard/paiements', icon: DollarSign },
                { label: t('dash_invoices'), href: '/dashboard/factures',  icon: FileText   },
            ],
        },
        {
            label: t('dash_communication'),
            icon: Mail,
            items: [
                { label: t('dash_quotes'),     href: '/dashboard/devis',      icon: ClipboardList },
                { label: t('dash_messages'),   href: '/dashboard/contact',    icon: Mail          },
                { label: t('dash_newsletter'), href: '/dashboard/newsletter', icon: Rss           },
            ],
        },
    ];

    const parametresItems: NavItem[] = [
        { label: t('dash_general'),     href: '/dashboard/settings',    icon: Settings  },
        ...(auth?.is_super_admin
            ? [
                  { label: t('dash_permissions'), href: '/dashboard/permissions', icon: HardHat  },
                  { label: t('dash_restore'),     href: '/dashboard/restore',     icon: RotateCcw },
                  { label: t('dash_logs'),        href: '/dashboard/audit',       icon: FileText  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Dashboard — direct link */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={currentUrl === '/dashboard'}>
                                    <Link href={dashboard()}>
                                        <LayoutGrid />
                                        <span>{t('dash_title')}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Collapsible nav groups */}
                {NAV_GROUPS.map((group) => {
                    const isOpen = group.items.some((item) => currentUrl.startsWith(item.href));
                    const GroupIcon = group.icon;

                    return (
                        <SidebarGroup key={group.label}>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <Collapsible defaultOpen={isOpen} className="group/collapsible">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    <GroupIcon />
                                                    <span>{group.label}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {group.items.map((item) => {
                                                        const ItemIcon = item.icon;
                                                        return (
                                                            <SidebarMenuSubItem key={item.href}>
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                    isActive={currentUrl.startsWith(item.href)}
                                                                >
                                                                    <Link href={item.href}>
                                                                        <ItemIcon />
                                                                        <span>{item.label}</span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        );
                                                    })}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    );
                })}

                {/* Paramètres */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Collapsible
                                    defaultOpen={parametresItems.some((i) => currentUrl.startsWith(i.href))}
                                    className="group/collapsible"
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <Settings />
                                            <span>{t('dash_settings')}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {parametresItems.map((item) => {
                                                const ItemIcon = item.icon;
                                                return (
                                                    <SidebarMenuSubItem key={item.href}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={currentUrl.startsWith(item.href)}
                                                        >
                                                            <Link href={item.href}>
                                                                <ItemIcon />
                                                                <span>{item.label}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[] as any} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
