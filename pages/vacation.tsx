import type { NextPage } from "next";
import moment from "moment";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import CommonLayout from "../components/layout/CommonLayout";
import { Button, PageHeader, Skeleton, Statistic } from "antd";
import { TimeEntry } from "../types";
import { specialTasks, useTimeEntries } from "../lib/api";
import { useRouter } from "next/dist/client/router";
import { vacationAllowancePerYear } from "./settings";
import { requireAuth } from "../lib/routeGuards";

export const getServerSideProps = requireAuth;

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
    specialTasks.paidVacation.harvestTaskId
  );

  return (
    <CommonLayout>
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
        <div
          style={{
            display: "flex",
            width: "max-content",
            justifyContent: "flex-end",
          }}
        >
          <VacationsDaysLeft vacationEntries={vacationEntries} year={year} />
        </div>
      </PageHeader>

      <VacationsDays vacationEntries={vacationEntries} />
    </CommonLayout>
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
  const vacationYearAllowance = vacationAllowancePerYear[year];

  if (vacationYearAllowance === undefined) {
    return (
      <>
        Spent vacation days in {year}: {vacationEntries?.length} (vacation
        allowance not set in settings)
      </>
    );
  }
  return (
    <Statistic
      loading={!vacationEntries}
      title="Vacation days left this year"
      value={vacationYearAllowance - (vacationEntries?.length || 0)}
      suffix={` / ${vacationYearAllowance}`}
    />
  );
};

const VacationsDays = ({
  vacationEntries,
}: {
  vacationEntries?: TimeEntry[];
}) => {
  return (
    <div style={{ marginLeft: 20 }}>
      {vacationEntries ? (
        <>
          {vacationEntries.map((entry) => (
            <div key={entry.id}>
              {entry.spent_date} {entry.notes ? ` - ${entry.notes}` : ""}
            </div>
          ))}
        </>
      ) : (
        <>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </>
      )}
    </div>
  );
};
