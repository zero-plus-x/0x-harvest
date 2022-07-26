import type { NextPage } from "next";
import moment from "moment";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Alert, Button, Col, List, PageHeader, Row, Statistic } from "antd";
import { TimeEntry } from "../types";
import { PAID_VACATION_TASK_ID, useTimeEntries } from "../lib/api";
import { useRouter } from "next/dist/client/router";
import { DEFAULT_VACATION_ALLOWANCE, getVacationAllowance } from "../utils";
import { useState } from "react";
import Link from "next/link";

const Vacation: NextPage = () => {
  const router = useRouter();
  let year = moment().year();

  if (typeof router.query.year === "string") {
    const parsed = parseInt(router.query.year);
    if (parsed > 2000 && parsed < 2100) {
      year = parsed;
    }
  }
  const { data: vacationEntries } = useTimeEntries(
    moment().set("year", year).startOf("year"),
    moment().set("year", year).endOf("year"),
    PAID_VACATION_TASK_ID
  );

  return (
    <>
      <PageHeader
        title={`Year ${year}`}
        breadcrumbRender={() => {
          return (
            <>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  router.push(`/vacation?year=${year - 1}`, undefined, {
                    shallow: true,
                  });
                }}
              >
                <LeftOutlined />
                previous
              </Button>
              <Button
                type="link"
                onClick={() => {
                  router.push(`/vacation?year=${year + 1}`, undefined, {
                    shallow: true,
                  });
                }}
              >
                next
                <RightOutlined />
              </Button>
            </>
          );
        }}
        subTitle={
          moment().year() !== year && (
            <Button
              type="link"
              onClick={() => {
                router.push(`/vacation?year=${moment().year()}`, undefined, {
                  shallow: true,
                });
              }}
            >
              jump to current year
            </Button>
          )
        }
      >
        <VacationsDaysLeft vacationEntries={vacationEntries} year={year} />
      </PageHeader>

      <VacationsDays vacationEntries={vacationEntries} />
    </>
  );
};

export default Vacation;

const VacationsDaysLeft = ({
  vacationEntries,
  year,
}: {
  vacationEntries?: TimeEntry[];
  year: number;
}) => {
  const [vacationAllowance] = useState(() => getVacationAllowance());
  const vacationYearAllowance =
    vacationAllowance[year] || DEFAULT_VACATION_ALLOWANCE;

  return (
    <>
      {!Object.keys(vacationAllowance).length && typeof window !== "undefined" && (
        <Row>
          <Col>
            <Alert
              type="info"
              message={
                <>
                  You can set your vacation allowance per year in{" "}
                  <Link href="/settings">Settings</Link>
                </>
              }
            />
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <Statistic
            loading={!vacationEntries}
            title="Vacation days left this year"
            value={vacationYearAllowance - (vacationEntries?.length || 0)}
            suffix={` / ${vacationYearAllowance}`}
          />
        </Col>
      </Row>
    </>
  );
};

const VacationsDays = ({
  vacationEntries,
}: {
  vacationEntries?: TimeEntry[];
}) => {
  return (
    <List
      loading={!vacationEntries}
      size="small"
      dataSource={vacationEntries?.map((entry) => ({
        date: entry.spent_date,
        notes: entry.notes,
      }))}
      renderItem={(item) => (
        <List.Item style={{ padding: "2px 25px" }}>
          {item.date} {item.notes ? ` - ${item.notes}` : ""}
        </List.Item>
      )}
    />
  );
};
