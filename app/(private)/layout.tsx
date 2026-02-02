import { Logout } from "@/components/logout";
import { Toaster } from "@/components/ui/sonner";
import { ProjectProvider } from "@/lib/project/provider";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { UserProvider } from "@/lib/user/provider";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <UserProvider>
        <ProjectProvider>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16">
            <Logout />
            {children}
          </div>
          <Toaster richColors expand={false} position="top-right" closeButton />
        </ProjectProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
