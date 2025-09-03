import "./globals.css";

export const metadata = { title: "AI Display MVP (Frontend-Only)" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
