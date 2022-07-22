import { useMemo, useState } from "react";
import type { NextPage } from "next";
import moment from "moment";
import classnames from "classnames";
import {
  DeleteOutlined,
  LeftOutlined,
  LikeOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  Menu,
  PageHeader,
  Skeleton,
  Statistic,
  message,
  Tooltip,
  Row,
  Col,
} from "antd";
import { useSWRConfig } from "swr";
import {
  Day,
  getDaysInMonthRange,
  isSoftwareDevTask,
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
import { TableLoader } from "./components/TableLoader";
import { TaskHoursStatistic } from "./components/TaskHoursStatistic";
import { TaskName } from "./components/TaskName";
import { FillEntriesWeekButton } from "./components/FillEntriesWeekButton";

const Home: NextPage = () => {
  return <TimeEntries />;
};

export default Home;

const TimeEntries = () => {
  const { mutate } = useSWRConfig();

  const [currentYear, setCurrentYear] = useState(moment().year());
  const [currentMonth, setCurrentMonth] = useState(moment().month());

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
          (moment().year() !== currentYear ||
            moment().month() !== currentMonth) && (
            <Button
              type="link"
              onClick={() => {
                setCurrentYear(moment().year());
                setCurrentMonth(moment().month());
              }}
            >
              jump to current month
            </Button>
          )
        }
      >
        <Row>
          <Col xl={4} lg={5} sm={8} xs={12}>
            <LoggedHoursStatistic date={currentDate} entries={entries} />
          </Col>
          <Col xl={6} lg={6} sm={12} xs={12}>
            <TaskHoursStatistic entries={entries} />
          </Col>
        </Row>
      </PageHeader>
      <div style={{ marginLeft: 20 }}>
        {entries ? (
          <>
            <br />
            <div>
              {getDaysInMonthRange(currentDate.year(), currentDate.month())
                .reverse()
                .map((day) => {
                  const harvestDate = day.date.format(HARVEST_DATE_FORMAT);
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
            </div>
          </>
        ) : (
          <TableLoader />
        )}
      </div>
    </div>
  );
};

const LoggedHoursStatistic = ({
  date,
  entries,
}: {
  date: moment.Moment;
  entries?: TimeEntry[];
}) => {
  const hoursInMonth = weekdaysInMonth(date.year(), date.month()) * 8;
  const trackedHoursInMonth = entries?.reduce(
    (acc, entry) => acc + entry.hours,
    0
  );

  return (
    <Statistic
      loading={!entries}
      title="Total logged hours"
      value={trackedHoursInMonth}
      suffix={` / ${hoursInMonth}`}
      prefix={(trackedHoursInMonth || 0) >= hoursInMonth && <LikeOutlined />}
    />
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
  const primaryTask = usePrimaryTask();

  const rowHeight = 36;

  return (
    <Row
      style={{ height: rowHeight }}
      className={classnames(
        "time-entry-row",
        !day.isBusinessDay && "time-entry-row-weekend"
      )}
    >
      <Col
        xl={2}
        lg={4}
        sm={5}
        xs={6}
        style={{
          fontWeight: day.date.isSame(new Date(), "date") ? "bold" : undefined,
        }}
      >
        {showDate && day.date.format(HARVEST_DATE_FORMAT)}
      </Col>
      <Col xxl={3} xl={4} lg={5} sm={5} xs={4}>
        <Tooltip
          title={
            <>
              Project ID: {entry?.project.id}
              <br />
              Project Name: {entry?.project.name}
              <br />
              Task ID: {entry?.task.id}
              <br />
              Task Name: {entry?.task.name}
            </>
          }
        >
          <div
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {entry && <TaskName entry={entry} />}
          </div>
        </Tooltip>
      </Col>
      <Col
        xxl={13}
        xl={12}
        lg={9}
        sm={9}
        xs={14}
        style={{ textAlign: "center" }}
      >
        {day.isBusinessDay ? (
          <EntryNoteInput
            day={day}
            entry={entry}
            loadMonth={loadMonth}
            setEntries={setEntries}
          />
        ) : (
          <i>weekend</i>
        )}
      </Col>
      <Col lg={5} sm={4} xs={0} style={{ textAlign: "center" }}>
        {entry?.hours && `${entry.hours} hours`}
        {!entry && day.date.isoWeekday() === 1 && primaryTask && (
          <FillEntriesWeekButton
            day={day}
            loading={loading}
            setLoading={setLoading}
            task={primaryTask}
            loadMonth={loadMonth}
            onCreatedEntries={(newEntries) => {
              setEntries((prevEntries) => {
                if (!prevEntries) {
                  return prevEntries;
                }
                return [...prevEntries, newEntries]
                  .flat()
                  .sort((a, b) => b.spent_date.localeCompare(a.spent_date));
              });
            }}
          />
        )}
      </Col>
      <Col sm={1} xs={0}>
        {entry && (
          <span className="buttons">
            <Button
              danger
              className="delete-button"
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
          </span>
        )}
      </Col>
    </Row>
  );
};

const EntryNoteInput = ({
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
    return <CreateEntryButton createEntry={createEntry} loading={loading} />;
  }

  return (
    <>
      <Input
        disabled={loading}
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
        placeholder="Notes"
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

const CreateEntryButton = ({
  loading,
  createEntry,
}: {
  loading: boolean;
  createEntry: (
    projectId: number,
    taskId: number,
    hours: number
  ) => Promise<void>;
}) => {
  const primaryTask = usePrimaryTask();
  const { data: projectAssignments } = useProjectAssignments();

  const menu = (
    <Menu
      items={projectAssignments?.map((p) => ({
        key: p.project.id,
        label: p.project.name,
        type: "group",
        children: p.task_assignments.map((t) => {
          const override = specialTasks[t.task.id];
          return {
            key: t.task.id,
            onClick: () => createEntry(p.project.id, t.task.id, FALLBACK_HOURS),
            label: (
              <>
                {t.task.name} {override?.emoji}{" "}
                {primaryTask?.taskId === t.task.id ? (
                  <>
                    (current <i>work</i>)
                  </>
                ) : null}
              </>
            ),
          };
        }),
      }))}
    />
  );

  return (
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
      {isSoftwareDevTask(primaryTask?.taskName)
        ? "work"
        : primaryTask?.taskName}
    </Dropdown.Button>
  );
};
