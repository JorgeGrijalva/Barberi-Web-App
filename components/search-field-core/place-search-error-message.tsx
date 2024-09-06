import { useTranslation } from "react-i18next";

export const SearchErrorMessage = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  let text = null;
  if (status === "ZERO_RESULTS" || status === "INVALID_REQUEST" || status === "NOT_FOUND") {
    text = <p>{t("no.places.found")}</p>;
  } else if (status === "OVER_QUERY_LIMIT" || status === "REQUEST_DENIED") {
    text = <p>{t("map.loading.error")}</p>;
  } else {
    text = <p>{t("map.service.is.down")}</p>;
  }
  return status === "" || status === "OK" ? null : <div role="alert">{text}</div>;
};
