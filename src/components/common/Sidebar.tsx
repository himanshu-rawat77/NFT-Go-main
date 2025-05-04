import { Map, Gift, ShoppingBag, User, Compass } from "lucide-react";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const menuItems = [
  { title: "Explore", icon: Compass, path: "/explore" },
  { title: "Map", icon: Map, path: "/map" },
  { title: "Rewards", icon: Gift, path: "/rewards" },
  { title: "Shop", icon: ShoppingBag, path: "/shop" },
  { title: "Profile", icon: User, path: "/profile" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <SidebarContainer variant="floating" className="z-50">
      <SidebarHeader className="flex items-center justify-center py-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            GeoNFT
          </span>
        </motion.div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500">
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="transition-all duration-300 hover:translate-x-1"
                    >
                      <Link to={item.path} className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ rotate: isActive ? 0 : 10 }}
                          animate={{
                            scale: isActive ? 1.1 : 1,
                            color: isActive
                              ? "var(--sidebar-accent-foreground)"
                              : "inherit",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <item.icon className="h-5 w-5" />
                        </motion.div>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-3 text-xs text-amber-800">
          <p className="font-medium">Explore the world</p>
          <p className="mt-1 opacity-80">
            Collect unique NFTs at real locations
          </p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </SidebarContainer>
  );
}
