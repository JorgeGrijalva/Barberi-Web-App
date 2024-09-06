"use client";

import clsx from "clsx";

import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import AnchorDownIcon from "@/assets/icons/anchor-down";
import { Button } from "@/components/button";
import { TextArea } from "@/components/text-area";
import { bookingService } from "@/services/booking";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Booking } from "@/types/booking";
import { useSettings } from "@/hook/use-settings";

interface AppointmentNotesProps {
  id?: number;
  data?: Booking[];
}

const AppointmentNotes = ({ id, data }: AppointmentNotesProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { language } = useSettings();
  const [currentNote, setCurrentNote] = useState("");
  const notes = data?.length ? data.flatMap((item) => item?.notes ?? []) : [];

  const { mutate: addNote, isLoading } = useMutation({
    mutationFn: (body: { note: string }) => bookingService.addNote(id, body),
    onSuccess: () => {
      setCurrentNote("");
      queryClient.invalidateQueries(["appointment", id, language?.locale]);
    },
  });

  const handleAddNote = () => {
    addNote({ note: currentNote });
  };

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between w-full">
            <span>{t("notes")}</span>
            <div className={clsx(open ? "rotate-180" : "rotate-0", "transition-all")}>
              <AnchorDownIcon aria-hidden="true" />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className="pt-4">
            {!!notes?.length && (
              <div className="mb-4">
                {notes.map((note) => (
                  <span className="block text-base font-medium break-words my-2">{note}</span>
                ))}
              </div>
            )}
            <span className="block mb-3 text-base font-medium">
              <TextArea
                rows={3}
                placeholder={t("type.here")}
                value={currentNote || ""}
                onChange={(e) => setCurrentNote(e.target.value)}
              />
            </span>
            <Button
              fullWidth
              size="small"
              onClick={handleAddNote}
              loading={isLoading}
              disabled={!currentNote?.length}
            >
              {t("add.note")}
            </Button>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default AppointmentNotes;
