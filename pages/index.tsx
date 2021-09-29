import { useMemo, useState } from "react";
import type { NextPage } from "next";
import moment from "moment";
import {
  DeleteOutlined,
  LeftOutlined,
  LikeOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import CommonLayout from "../components/layout/CommonLayout";
import {
  Button,
  Dropdown,
  Input,
  Menu,
  PageHeader,
  Skeleton,
  Space,
  Statistic,
  message,
  Tooltip,
} from "antd";
import { useSWRConfig } from "swr";
import {
  Day,
  getDaysInMonthRange,
  usePrimaryTask,
  weekdaysInMonth,
} from "../utils";
import { TimeEntry } from "../types";
import {
  createTimeEntry,
  deleteTimeEntry,
  FALLBACK_HOURS,
  HARVEST_DATE_FORMAT,
  projects,
  specialTasks,
  updateTimeEntry,
  useProjectAssignments,
  useTimeEntries,
} from "../lib/api";
import { requireAuth } from "../lib/routeGuards";

export const getServerSideProps = requireAuth;

const Home: NextPage = () => {
  return (
    <CommonLayout>
      <TimeEntries />
    </CommonLayout>
  );
};

export default Home;

const TimeEntries = () => {
  const { mutate } = useSWRConfig();

  const [currentYear, setCurrentYear] = useState(moment().year());
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  const primaryTask = usePrimaryTask();
  const currentDate = useMemo(
    () => moment(new Date(currentYear, currentMonth, 1)),
    [currentYear, currentMonth]
  );

  const formattedDate = currentDate.format("MMMM YYYY");

  const { data: entries, cacheKey } = useTimeEntries(
    currentDate.clone().startOf("month"),
    currentDate.clone().endOf("month")
  );

  const setEntries = (
    fn: (newEntries: TimeEntry[] | undefined) => TimeEntry[] | undefined
  ) => {
    mutate(cacheKey, fn, false);
  };

  const loadMonth = () => mutate(cacheKey);

  const entriesMissingNote = entries?.filter(
    (entry) =>
      !entry.notes &&
      (specialTasks[entry.task.id]?.noteRequired ||
        !specialTasks[entry.task.id])
  ).length;
  const hoursInMonth =
    weekdaysInMonth(currentDate.year(), currentDate.month()) * 8;
  const trackedHoursInMonth = entries?.reduce(
    (acc, entry) => acc + entry.hours,
    0
  );
  const clientHours = entries
    ?.filter(
      (e) =>
        // note that primaryTask is derived based on the most commonly-used task in the last 30 days
        // it would be safer to let the user select their primary task in the UI
        e.task.id === primaryTask?.taskId &&
        // client task is not part of the default absence/0+x internal projects
        !projects[e.project.id]
    )
    .reduce((acc, entry) => acc + entry.hours, 0);

  return (
    <div>
      <PageHeader
        title={formattedDate}
        breadcrumbRender={() => {
          return (
            <>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentYear(currentYear - 1);
                    setCurrentMonth(11);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
              >
                <LeftOutlined />
                previous
              </Button>
              <Button
                type="link"
                style={{ padding: 0, marginLeft: 30 }}
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentYear(currentYear + 1);
                    setCurrentMonth(0);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
              >
                next
                <RightOutlined />
              </Button>
            </>
          );
        }}
        subTitle={
          moment().year() !== currentYear ||
          (moment().month() !== currentMonth && (
            <Button
              type="link"
              onClick={() => {
                setCurrentYear(moment().year());
                setCurrentMonth(moment().month());
              }}
            >
              jump to current month
            </Button>
          ))
        }
      >
        <Space size="large">
          <Statistic
            loading={!entries}
            title="Entries missing a note"
            value={entriesMissingNote}
            prefix={
              !entriesMissingNote &&
              trackedHoursInMonth === hoursInMonth && <LikeOutlined />
            }
          />
          <Statistic
            loading={!entries}
            title="Total tracked hours"
            value={trackedHoursInMonth}
            suffix={` / ${hoursInMonth}`}
            prefix={trackedHoursInMonth === hoursInMonth && <LikeOutlined />}
          />
          <Statistic
            loading={!entries}
            title="Tracked hours for client"
            value={clientHours}
          />
        </Space>
      </PageHeader>
      <div style={{ marginLeft: 20 }}>
        {entries ? (
          <>
            <br />
            <div className="antd-table">
              <div className="antd-table-container">
                <div className="antd-table-content">
                  <table>
                    <tbody className="ant-table-tbody">
                      {getDaysInMonthRange(
                        currentDate.year(),
                        currentDate.month()
                      )
                        .reverse()
                        .map((day) => {
                          const harvestDate =
                            day.date.format(HARVEST_DATE_FORMAT);
                          const dayEntries = entries.filter(
                            (e) => e.spent_date === harvestDate
                          );
                          if (!dayEntries.length) {
                            return (
                              <TimeEntryRow
                                day={day}
                                key={harvestDate}
                                showDate
                                loadMonth={loadMonth}
                                setEntries={setEntries}
                              />
                            );
                          }
                          return dayEntries.map((entry, entryIdx) => (
                            <TimeEntryRow
                              day={day}
                              key={entry.id}
                              entry={entry}
                              showDate={!entryIdx}
                              loadMonth={loadMonth}
                              setEntries={setEntries}
                            />
                          ));
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
    </div>
  );
};

const TimeEntryRow = ({
  day,
  entry,
  showDate,
  loadMonth,
  setEntries,
}: {
  day: Day;
  entry?: TimeEntry;
  showDate?: boolean;
  loadMonth: () => Promise<void>;
  setEntries: (
    fn: (e: TimeEntry[] | undefined) => TimeEntry[] | undefined
  ) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const tdStyle = { padding: 3 };
  const primaryTask = usePrimaryTask();
  const specialTask = entry ? specialTasks[entry?.task.id] : undefined;

  return (
    <tr className="ant-table-row" style={{ height: 35 }}>
      <td
        style={{
          ...tdStyle,
          width: 150,
          fontWeight: day.date.isSame(new Date(), "date") ? "bold" : undefined,
        }}
        className="ant-table-cell"
      >
        {showDate && day.date.format(HARVEST_DATE_FORMAT)}
      </td>
      <td style={{ ...tdStyle, textAlign: "center" }}>
        {(!specialTask || specialTask?.noteRequired) && (
          <Tooltip
            title={
              <>
                <p>Project ID: {entry?.project.id}</p>
                <p>Task ID: {entry?.task.id}</p>
                <p>Task Name: {entry?.task.name}</p>
              </>
            }
          >
            {specialTask?.displayName ?? entry?.task.name}
          </Tooltip>
        )}
      </td>
      <td
        style={{ ...tdStyle, width: 500, textAlign: "center" }}
        className="ant-table-cell"
      >
        {day.isBusinessDay && (specialTask?.noteRequired || !specialTask) ? (
          <TimeEntryInput
            day={day}
            entry={entry}
            loadMonth={loadMonth}
            setEntries={setEntries}
          />
        ) : specialTask && !specialTask?.noteRequired ? (
          <i>
            {specialTask.emoji} {specialTask?.displayName ?? entry?.task.name}{" "}
            {specialTask.emoji}
          </i>
        ) : (
          <i>weekend</i>
        )}
      </td>
      <td
        style={{ ...tdStyle, width: 70, textAlign: "center" }}
        className="ant-table-cell"
      >
        {entry?.hours && `${entry.hours} hours`}
        {!entry && day.date.isoWeekday() === 1 && primaryTask && (
          <Button
            disabled={loading}
            loading={loading}
            onClick={async () => {
              setLoading(true);
              const currentDate = day.date.clone();
              const promises = Array(5)
                .fill(1)
                .map(() => {
                  const promise = createTimeEntry(
                    currentDate.format(HARVEST_DATE_FORMAT),
                    primaryTask.projectId,
                    primaryTask.taskId
                  );
                  currentDate.add(1, "day");
                  return promise;
                });

              const responses = await Promise.all(promises);
              setLoading(false);
              if (responses.every((r) => r.status === 201)) {
                message.success("New entries created!");

                setEntries((prevEntries) => {
                  if (!prevEntries) {
                    return prevEntries;
                  }
                  return [...prevEntries, responses.map((r) => r.data)]
                    .flat()
                    .sort((a, b) => b.spent_date.localeCompare(a.spent_date));
                });
              } else {
                message.error("Something went wrong while creating entries.");
                await loadMonth();
              }
            }}
          >
            <PlusOutlined /> Work entries for this week
          </Button>
        )}
      </td>
      <td className="ant-table-cell" style={tdStyle}>
        {entry && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={async () => {
              setEntries((entries) =>
                entries?.filter((e) => e.id !== entry.id)
              );
              const response = await deleteTimeEntry(entry.id);
              if (response.status === 200) {
                message.success("Entry deleted!");
              } else {
                message.error("Something went wrong while deleting entry.");
                await loadMonth();
              }
            }}
          />
        )}
      </td>
    </tr>
  );
};

const TimeEntryInput = ({
  day,
  entry,
  loadMonth,
  setEntries,
}: {
  day: Day;
  entry?: TimeEntry;
  loadMonth: () => Promise<void>;
  setEntries: (
    fn: (e: TimeEntry[] | undefined) => TimeEntry[] | undefined
  ) => void;
}) => {
  const [notes, setNotes] = useState(entry?.notes || "");
  const [loading, setLoading] = useState(false);

  const { data: projectAssignments } = useProjectAssignments();
  const primaryTask = usePrimaryTask();

  const createEntry = async (
    projectId: number,
    taskId: number,
    hours?: number
  ) => {
    setLoading(true);
    const response = await createTimeEntry(
      day.date.format(HARVEST_DATE_FORMAT),
      projectId,
      taskId,
      hours
    );
    setLoading(false);
    if (response.status === 201) {
      message.success("New entry created!");

      setEntries((prevEntries) => {
        if (!prevEntries) {
          return prevEntries;
        }
        return [...prevEntries, response.data].sort((a, b) =>
          b.spent_date.localeCompare(a.spent_date)
        );
      });
    } else {
      message.error("Something went wrong while creating entry.");
      await loadMonth();
    }
  };

  if (!entry) {
    const menu = (
      <Menu>
        {projectAssignments?.map((p) => (
          <Menu.ItemGroup key={p.project.id} title={p.project.name}>
            {p.task_assignments.map((t) => {
              const override = specialTasks[t.task.id];
              return (
                <Menu.Item
                  key={t.task.id}
                  icon={<PlusOutlined />}
                  onClick={async () =>
                    await createEntry(p.project.id, t.task.id, FALLBACK_HOURS)
                  }
                >
                  {t.task.name} {override?.emoji}
                </Menu.Item>
              );
            })}
          </Menu.ItemGroup>
        ))}
      </Menu>
    );

    return (
      <>
        <Dropdown.Button
          overlay={menu}
          disabled={loading}
          onClick={async () => {
            if (primaryTask) {
              await createEntry(
                primaryTask.projectId,
                primaryTask.taskId,
                FALLBACK_HOURS
              );
            }
          }}
        >
          <PlusOutlined /> {FALLBACK_HOURS} hour{" "}
          {primaryTask?.taskName === "Software Development"
            ? "work"
            : primaryTask?.taskName}{" "}
        </Dropdown.Button>
      </>
    );
  }

  return (
    <>
      <Input
        disabled={loading}
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
        onBlur={async () => {
          if (notes === entry.notes) {
            return;
          }
          setLoading(true);
          const response = await updateTimeEntry(entry.id, notes);
          setLoading(false);
          if (response.status === 200) {
            message.success("Note saved!");
            setEntries((prevEntries) => {
              if (!prevEntries) {
                return prevEntries;
              }
              const entriesCopy = [...prevEntries];
              const updatedEntryIdx = entriesCopy.findIndex(
                (e) => e.id === response.data.id
              );
              entriesCopy[updatedEntryIdx] = response.data;
              return entriesCopy;
            });
          } else {
            message.error("Something went wrong while saving note.");
            await loadMonth();
          }
        }}
      />
    </>
  );
};
