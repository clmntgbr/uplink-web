import { Header } from "@/components/header";
import { Logout } from "@/components/logout";
import { Toaster } from "@/components/ui/sonner";
import { EndpointProvider } from "@/lib/endpoint/provider";
import { ProjectProvider } from "@/lib/project/provider";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { UserProvider } from "@/lib/user/provider";
import { WorkflowProvider } from "@/lib/workflow/provider";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <UserProvider>
        <ProjectProvider>
          <EndpointProvider>
            <WorkflowProvider>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16">
                <Header />
                <Logout />
                {children}
              </div>
              <Toaster richColors expand={false} position="top-right" closeButton />
            </WorkflowProvider>
          </EndpointProvider>
        </ProjectProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
