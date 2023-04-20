import React, { useState } from "react";
import { Button, Card, Col, Row, Skeleton, Spin } from "antd";
import type { GetServerSideProps, NextPage } from "next";
import {
  createTimeEntry,
  FALLBACK_HOURS,
  isUserInRole,
  Project,
  PUBLIC_HOLIDAY_TASK_ID,
  useAllUsers,
  useUser,
} from "../lib/api";
import { cachePage } from "../lib/caching";
import { useRouter } from "next/router";
import { AccessRole } from "../types";
import { delay, partitionArray } from "../lib/utils";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  cachePage(res);
  return {
    props: {},
  };
};

const Admin: NextPage = () => {
  const router = useRouter();
  const { data: user } = useUser();

  React.useEffect(() => {
    if (user && !isUserInRole(user, [AccessRole.ADMIN, AccessRole.MANAGER])) {
      router.push({
        pathname: "/",
      });
    }
  }, [user, router]);

  if (!user) {
    return <Skeleton />;
  }

  return (
    <Row gutter={20}>
      <Col md={12} xs={24}>
        <AllUsersTaskEntry />
      </Col>
    </Row>
  );
};

const redDays: { date: string; note: string }[] = [
  { date: "2023-05-01", note: "Första maj" },
  { date: "2023-05-18", note: "Kristi himmelsfärds dag" },
  { date: "2023-06-06", note: "Sveriges nationaldag" },
  { date: "2023-06-23", note: "Midsommarafton" },
  { date: "2023-12-25", note: "Juldagen" },
  { date: "2023-12-26", note: "Annandag jul" },
];

const SLEEP_BATCH_SECONDS = 10;

const AllUsersTaskEntry = () => {
  const { data: users, isLoading } = useAllUsers();
  const [loading, setLoading] = useState(false);
  const [totalProcessed, setTotalProcessed] = useState(0);

  if (isLoading) {
    return <Skeleton />;
  }

  const userList = users?.users || [];
  const activeUsers = userList.filter((user) => user.is_active);
  return (
    <Card>
      <Card.Meta title="Add red days to users" />
      {activeUsers.length === 0 ? (
        <>
          <p>
            Clicking the button below will create new time entries for{" "}
            {activeUsers.length} active users on the following dates:
          </p>
          <ul>
            {redDays.map((day) => (
              <li key={day.date}>
                {day.date} - {day.note}
              </li>
            ))}
          </ul>
          <p>
            Note that we currently do not check for existing time entries, so
            running this multiple times will create duplicate entries in
            people&apos;s time sheets.
          </p>
          <Button
            disabled={loading}
            loading={loading}
            type="primary"
            onClick={async () => {
              setLoading(true);
              // send requests in batches due to harvest api rate limiting
              const batches = partitionArray(activeUsers, 10);

              for (const [batchIndex, batch] of batches.entries()) {
                const promises = batch.flatMap((user) =>
                  redDays.map((day) =>
                    createTimeEntry(
                      day.date,
                      Project.ABSENCE,
                      PUBLIC_HOLIDAY_TASK_ID,
                      FALLBACK_HOURS,
                      day.note,
                      user.id
                    )
                  )
                );
                await Promise.all(promises);
                setTotalProcessed((p) => p + batch.length);
                if (batchIndex < batches.length - 1) {
                  await delay(SLEEP_BATCH_SECONDS);
                }
              }
              setLoading(false);
            }}
          >
            Create time entries
          </Button>
          {loading && (
            <span>
              {" "}
              Processed {totalProcessed}/{activeUsers.length} users... <Spin />
              <br />
              Keep the browser tab open, we sleep for {SLEEP_BATCH_SECONDS}{" "}
              seconds after processing a batch of users to avoid triggering rate
              limiting in Harvest API.
            </span>
          )}
        </>
      ) : (
        <>No users have been fetched, you probably lack permissions.</>
      )}
    </Card>
  );
};

export default Admin;
