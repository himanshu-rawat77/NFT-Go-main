import { Outlet } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-hidden relative">
        {/* Animated background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 -left-40 h-[30rem] w-[30rem] rounded-full bg-gradient-to-r from-amber-200/20 to-orange-300/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[35rem] w-[35rem] rounded-full bg-gradient-to-r from-blue-200/20 to-teal-300/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-gradient-to-r from-purple-200/10 to-pink-300/10 blur-3xl" />

          {/* Floating particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-amber-400/30"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: Math.random() * 0.5 + 0.3,
                }}
                animate={{
                  y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                  x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: Math.random() * 60 + 60,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>

        <Sidebar />
        <SidebarInset className="bg-white/80 backdrop-blur-md">
          <main className="flex-1 p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
