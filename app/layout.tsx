import CommonLayout from "../components/layout/CommonLayout";
import { UserSettingsStoreContextProvider } from "../stores/UserSettingsStore";
import "antd/dist/reset.css";

export const metadata = {
  title: "0+x Harvest",
  description: "Time track app for use at 0+x",
  viewport: "initial-scale=1, maximum-scale=1, shrink-to-fit=no",
  themeColor: "#001529",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserSettingsStoreContextProvider>
          <CommonLayout>{children}</CommonLayout>
        </UserSettingsStoreContextProvider>
      </body>
    </html>
  );
}
