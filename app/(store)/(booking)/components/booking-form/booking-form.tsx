import { BookingForm } from "@/types/booking-form";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formService } from "@/services/form";
import { useSettings } from "@/hook/use-settings";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import { FormItem } from "./form-item";

interface BookingFormProps {
  data?: BookingForm;
  allForms?: BookingForm[];
  bookingId: number;
  parentId?: number;
}

type ValueStore = Record<string, { value?: string[] | string; required: boolean }>;

export const BookingFormPanel = ({ data, allForms, bookingId, parentId }: BookingFormProps) => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const queryClient = useQueryClient();
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const { mutate: updateForm, isLoading } = useMutation({
    mutationFn: (body: BookingForm[]) => formService.updateForm(bookingId, body),
    onSuccess: () => {
      success(t("successfully.submitted"));
      queryClient.invalidateQueries(["appointment", parentId, language?.locale]);
    },
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });
  const valueStore: ValueStore = {};
  data?.data?.forEach((questionItem) => {
    valueStore[questionItem.question] = {
      value:
        questionItem.answer_type === "multiple_choice" &&
        questionItem.user_answer?.every((item) => typeof item !== "undefined") &&
        questionItem.user_answer?.length !== 0
          ? questionItem.user_answer
          : questionItem.user_answer?.[0],
      required: Boolean(questionItem.required),
    };
    if (!valueStore[questionItem.question].value && questionItem.answer_type === "yes_or_no") {
      valueStore[questionItem.question].value = "false";
    }
  });
  const [currentValues, setCurrentValues] = useState(valueStore);
  console.log(currentValues);
  const handleValueChange = (question: string, value: string | string[]) => {
    setIsButtonPressed(false);
    setCurrentValues((oldValues) => ({
      ...oldValues,
      [question]: { required: oldValues[question].required, value },
    }));
  };
  const handleSubmit = () => {
    setIsButtonPressed(true);
    const isError = Object.values(currentValues).some((item) => item.required && !item.value);
    if (isError) return;
    const body = allForms?.map((form) => {
      if (form.id === data?.id) {
        return {
          ...form,
          data: form.data?.map((item) => {
            const userAnswer = currentValues[item.question].value;
            return {
              ...item,
              // eslint-disable-next-line no-nested-ternary
              user_answer: userAnswer
                ? typeof userAnswer === "object"
                  ? userAnswer
                  : [userAnswer]
                : undefined,
            };
          }),
        };
      }
      return form;
    });
    if (!body) return;
    updateForm(body);
  };
  return (
    <div className="sm:py-4 py-2 px-4">
      <div className="flex items-center justify-between mb-4">
        <strong className="text-head font-semibold">{data?.translation?.title}</strong>
      </div>
      <div className="flex flex-col gap-4 mb-5">
        {data?.data?.map((formItem) => (
          <div key={formItem.question} className="flex flex-col gap-1">
            {formItem.answer_type !== "description_text" && (
              <strong className="text-base font-medium">
                {formItem.question}
                {formItem.required ? "*" : ""}
              </strong>
            )}
            <FormItem
              option={formItem}
              value={currentValues?.[formItem.question]?.value}
              onChange={(value) => handleValueChange(formItem.question, value)}
              error={
                currentValues?.[formItem.question]?.required &&
                !currentValues?.[formItem.question].value &&
                isButtonPressed
                  ? t("required")
                  : undefined
              }
            />
          </div>
        ))}
      </div>
      <Button onClick={() => handleSubmit()} fullWidth loading={isLoading}>
        {t("submit")}
      </Button>
    </div>
  );
};
