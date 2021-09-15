import React from "react";
import { Layout } from "antd";
import Header from "./Header";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout.Content style={{ padding: "10px 50px" }}>
        <div>{children}</div>
      </Layout.Content>
    </Layout>
  );
}
