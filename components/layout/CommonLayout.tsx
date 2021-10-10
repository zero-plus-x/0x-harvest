import React from "react";
import { Col, Layout, Row } from "antd";
import Header from "./Header";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout.Content>
        <Row>
          <Col md={2} sm={1} xs={0}></Col>
          <Col md={20} sm={22} xs={24} style={{ paddingTop: 20 }}>
            {children}
          </Col>
          <Col md={2} sm={1} xs={0}></Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}
