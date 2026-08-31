import { Languages } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LangToggle({ className }: { className?: string }) {
  const { lang, toggle } = useLang();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggle}
      className={className}
      aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      <Languages className="size-4" aria-hidden />
      <span className="font-medium">{lang === "ar" ? "English" : "العربية"}</span>
    </Button>
  );
}
