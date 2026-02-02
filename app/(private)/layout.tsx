import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme/theme-provider";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16">{children}</div>
      <Toaster richColors expand={false} position="top-right" closeButton />
    </ThemeProvider>
  );
}
