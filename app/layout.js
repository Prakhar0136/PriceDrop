import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Price Lens",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
