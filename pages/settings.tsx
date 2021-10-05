import React from "react";
import moment from "moment";
import { Col, InputNumber, Row } from "antd";
import type { NextPage } from "next";
import CommonLayout from "../components/layout/CommonLayout";
import { requireAuth } from "../lib/routeGuards";
import {
  DEFAULT_VACATION_ALLOWANCE,
  getVacationAllowance,
  VACATION_ALLOWANCE_KEY,
} from "../utils";

export const getServerSideProps = requireAuth;

const Settings: NextPage = () => {
  const thisYear = moment().year();
  const years = [thisYear - 2, thisYear - 1, thisYear, thisYear + 1];

  const [vacationAllowance, setVacationAllowance] = React.useState(() => {
    let values = getVacationAllowance();
    return cleanupValues(values, years);
  });

  return (
    <Row>
      <Col>
        Vacation allowance in years:
        {years.map((year) => (
          <div key={year}>
            {year}:{" "}
            <InputNumber
              value={vacationAllowance[year]}
              placeholder={DEFAULT_VACATION_ALLOWANCE.toString()}
              min={0}
              max={50}
              onChange={(val) => {
                let newValue = { ...vacationAllowance };
                if (typeof val === "number") {
                  newValue[year] = val;
                } else {
                  delete newValue[year];
                }
                newValue = cleanupValues(newValue, years);
                localStorage.setItem(
                  VACATION_ALLOWANCE_KEY,
                  JSON.stringify(newValue)
                );
                setVacationAllowance(newValue);
              }}
            />
          </div>
        ))}
      </Col>
    </Row>
  );
};

const cleanupValues = (
  allowance: Record<number, number>,
  validYears: number[]
) => {
  const copy = { ...allowance };
  for (const y of Object.keys(copy)) {
    const yearInt = parseInt(y);
    if (!validYears.includes(yearInt)) {
      // cleaning up old/invalid values
      delete copy[yearInt];
    }
  }

  return copy;
};

export default Settings;
