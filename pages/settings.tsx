import React from "react";
import { Col, Row } from "antd";
import type { NextPage } from "next";
import CommonLayout from "../components/layout/CommonLayout";
import { requireAuth } from "../lib/routeGuards";

export const getServerSideProps = requireAuth;

export const vacationAllowancePerYear: Record<number, number | undefined> = {
  2020: 10,
  2021: 30,
  2022: 35,
};

const Settings: NextPage = () => {
  return (
    <CommonLayout>
      <Row>
        <Col>
          Vacation allowance in years:
          {Object.entries(vacationAllowancePerYear).map((year) => (
            <div key={year[0]}>
              {year[0]}: {year[1]}
            </div>
          ))}
        </Col>
      </Row>
    </CommonLayout>
  );
};

export default Settings;
