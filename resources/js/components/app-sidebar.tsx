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

type NavItem = { label: string; href: string; icon: React.ElementType };
type NavGroup = { label: string; icon: React.ElementType; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Catalogue',
        icon: Package,
        items: [
            { label: 'Produits', href: '/dashboard/produits', icon: Package },
            { label: 'Catégories', href: '/dashboard/categories', icon: FolderGit2 },
        ],
    },
    {
        label: 'Ventes',
        icon: ShoppingCart,
        items: [
            { label: 'Ventes', href: '/dashboard/ventes', icon: ShoppingCart },
            { label: 'Commandes', href: '/dashboard/commandes', icon: BookOpen },
        ],
    },
    {
        label: 'Clients',
        icon: Users,
        items: [
            { label: 'Clients', href: '/dashboard/clients', icon: Users },
        ],
    },
    {
        label: 'Stock',
        icon: Box,
        items: [
            { label: 'Mouvements', href: '/dashboard/mouvements', icon: Repeat },
            { label: 'Ajustements', href: '/dashboard/stock/ajustements', icon: Box },
        ],
    },
    {
        label: 'Logistique',
        icon: Truck,
        items: [
            { label: 'Logistique', href: '/dashboard/logistique', icon: Truck },
            { label: 'Planification', href: '/dashboard/planification', icon: GanttChartSquare },
        ],
    },
    {
        label: 'Agenda',
        icon: CalendarDays,
        items: [
            { label: 'Agenda', href: '/dashboard/agenda', icon: CalendarDays },
        ],
    },
    {
        label: 'Finances',
        icon: DollarSign,
        items: [
            { label: 'Paiements', href: '/dashboard/paiements', icon: DollarSign },
            { label: 'Factures', href: '/dashboard/factures', icon: FileText },
        ],
    },
    {
        label: 'Communication',
        icon: Mail,
        items: [
            { label: 'Demandes de devis', href: '/dashboard/devis', icon: ClipboardList },
            { label: 'Messages contact', href: '/dashboard/contact', icon: Mail },
            { label: 'Newsletter', href: '/dashboard/newsletter', icon: Rss },
        ],
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const currentUrl = usePage().url;

    const parametresItems: NavItem[] = [
        { label: 'Général', href: '/dashboard/settings', icon: Settings },
        ...(auth?.is_super_admin
            ? [
                  { label: 'Permissions', href: '/dashboard/permissions', icon: HardHat },
                  { label: 'Restauration', href: '/dashboard/restore', icon: RotateCcw },
                  { label: 'Logs', href: '/dashboard/audit', icon: FileText },
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
                                        <span>Tableau de bord</span>
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
                                            <span>Paramètres</span>
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
