import { WorkingDay } from "@/types/shop";
import { Translate } from "@/components/translate";

interface WorkingScheduleProps {
  data?: WorkingDay[];
}

export const WorkingSchedule = ({ data }: WorkingScheduleProps) => (
  <div>
    <div className="rounded-button py-5 px-5 border border-gray-link">
      <h2 className="text-xl font-semibold">
        <Translate value="business.hours" />
      </h2>
      <ul>
        {data?.map((schedule) => (
          <li key={schedule.day} className="text-lg flex items-center justify-between mt-5">
            <span>
              <Translate value={schedule.day} />
            </span>
            <span>
              {schedule.from} - {schedule.to}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
