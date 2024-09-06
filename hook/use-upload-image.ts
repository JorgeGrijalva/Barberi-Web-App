import { useMutation } from "@tanstack/react-query";
import fetcher from "@/lib/fetcher";
import { DefaultResponse, ImageTypes } from "@/types/global";

export const useUploadImage = () =>
  useMutation({
    mutationFn: (body: FormData) =>
      fetcher<DefaultResponse<{ title: string; type: ImageTypes }>>("v1/dashboard/galleries", {
        body,
        method: "POST",
      }),
  });
