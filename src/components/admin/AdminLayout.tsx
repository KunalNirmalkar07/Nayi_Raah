import { useState } from "react";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-background">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-4 h-14">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <h2 className="text-base font-bold text-foreground truncate">Admin Panel</h2>
        </div>
        <main className="p-4 overflow-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
    </div>
  );
}
