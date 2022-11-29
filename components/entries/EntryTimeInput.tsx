import { InputNumber, message } from "antd";
import { useState } from "react";
import { updateTimeEntryHours } from "../../lib/api";
import { TimeEntry } from "../../types";

const EntryTimeInput = ({
  entry,
  loadMonth,
  setEntries,
}: {
  entry: TimeEntry;
  loadMonth: () => Promise<void>;
  setEntries: (
    fn: (e: TimeEntry[] | undefined) => TimeEntry[] | undefined
  ) => void;
}) => {
  const [value, setValue] = useState(entry.hours);

  return (
    <InputNumber
      disabled={entry.is_locked}
      min={0.25}
      max={24}
      inputMode="decimal"
      addonAfter={
        <>
          <span>h</span>
          <span className="hide-below-md">ours</span>
        </>
      }
      defaultValue={entry?.hours}
      style={{ marginTop: 2, maxWidth: 130 }}
      value={value}
      onChange={(newValue) => {
        if (newValue !== null) {
          setValue(newValue);
        }
      }}
      onBlur={async () => {
        if (value === entry.hours) {
          return;
        }

        const response = await updateTimeEntryHours(entry.id, value);
        if (response.status === 200) {
          message.success("Time updated!");

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
          message.error("Something went wrong while updating time.");
          await loadMonth();
        }
      }}
    />
  );
};

export default EntryTimeInput;
