import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const BRAND = "Wijha";

export function useDocumentTitle(titleKey?: string) {
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    if (!titleKey) {
      document.title = BRAND;
      return;
    }
    const translated = t(titleKey);
    document.title = translated && translated !== titleKey
      ? `${translated} | ${BRAND}`
      : BRAND;
  }, [titleKey, t, i18n.language]);
}
