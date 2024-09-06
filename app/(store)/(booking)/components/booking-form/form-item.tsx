import { FormOption } from "@/types/booking-form";
import { Input } from "@/components/input";
import { TextArea } from "@/components/text-area";
import { Switch } from "@/components/switch";
import { Select } from "@/components/select";
import { Checkbox } from "@/components/checkbox";
import { Radio } from "@/components/radio";

interface FormItemProps {
  option: FormOption;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
}

export const FormItem = ({ option, value, onChange, error }: FormItemProps) => {
  switch (option.answer_type) {
    case "short_answer":
      return (
        <Input
          fullWidth
          value={typeof value !== "object" ? value : undefined}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      );
    case "long_answer":
      return (
        <TextArea
          rows={5}
          value={typeof value !== "object" ? value : undefined}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      );
    case "yes_or_no":
      return (
        <Switch value={value === "true"} onChange={(currentValue) => onChange(`${currentValue}`)} />
      );
    case "drop_down":
      return (
        <Select
          onSelect={(currentValue) => onChange(currentValue)}
          extractTitle={(currentValue) => currentValue}
          extractKey={(currentValue) => currentValue}
          options={option.answer}
          value={typeof value !== "object" ? value : undefined}
          checkById={false}
          showTempValue
          error={error}
        />
      );
    case "multiple_choice":
      return (
        <div>
          {option.answer?.map((answerItem) => (
            <Checkbox
              key={answerItem}
              value={answerItem}
              label={answerItem}
              name={option.question}
              checked={value?.includes(answerItem)}
              onChange={(e) =>
                typeof value !== "string" && value?.includes(e.target.value)
                  ? onChange(value.filter((valueItem) => valueItem !== e.target.value))
                  : onChange([...(value || []), e.target.value])
              }
            />
          ))}
          {!!error && (
            <p className="text-red text-sm" role="alert">
              {error}
            </p>
          )}
        </div>
      );
    case "single_answer":
      return (
        <div>
          {option.answer?.map((answerItem) => (
            <Radio
              key={answerItem}
              label={answerItem}
              value={answerItem}
              id={answerItem}
              name={option.question}
              checked={answerItem === value}
              onChange={(e) => onChange(e.target.value)}
            />
          ))}
          {!!error && (
            <p className="text-red text-sm" role="alert">
              {error}
            </p>
          )}
        </div>
      );
    case "description_text":
      return <div className="px-3 py-6 rounded-button bg-gray-link text-sm">{option.question}</div>;
    default:
      return null;
  }
};
