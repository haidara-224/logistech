import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
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
            { label: 'Produits', href: '/produits', icon: Package },
            { label: 'Catégories', href: '/categories', icon: FolderGit2 },
        ],
    },
    {
        label: 'Ventes',
        icon: ShoppingCart,
        items: [
            { label: 'Ventes', href: '/ventes', icon: ShoppingCart },
            { label: 'Commandes', href: '/commandes', icon: BookOpen },
        ],
    },
    {
        label: 'Clients',
        icon: Users,
        items: [
            { label: 'Clients', href: '/clients', icon: Users },
        ],
    },
    {
        label: 'Stock',
        icon: Box,
        items: [
            { label: 'Mouvements', href: '/mouvements', icon: Repeat },
            { label: 'Ajustements', href: '/stock/ajustements', icon: Box },
        ],
    },
    {
        label: 'Logistique',
        icon: Truck,
        items: [
            { label: 'Logistique', href: '/logistique', icon: Truck },
        ],
    },
    {
        label: 'Finances',
        icon: DollarSign,
        items: [
            { label: 'Paiements', href: '/paiements', icon: DollarSign },
            { label: 'Factures', href: '/factures', icon: FileText },
        ],
    },
    {
        label: 'Communication',
        icon: Mail,
        items: [
            { label: 'Demandes de devis', href: '/devis', icon: ClipboardList },
            { label: 'Messages contact', href: '/contact', icon: Mail },
            { label: 'Newsletter', href: '/newsletter', icon: Rss },
        ],
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const currentUrl = usePage().url;

    const parametresItems: NavItem[] = [
        { label: 'Général', href: '/settings', icon: Settings },
        ...(auth?.is_super_admin
            ? [
                  { label: 'Permissions', href: '/permissions', icon: HardHat },
                  { label: 'Restauration', href: '/restore', icon: RotateCcw },
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
