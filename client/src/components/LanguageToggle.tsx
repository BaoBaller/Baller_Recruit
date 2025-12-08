import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("vi")}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
          language === "vi"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground"
        }`}
        data-testid="button-lang-vi"
      >
        <span className="mr-1.5">🇻🇳</span>
        VI
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
          language === "en"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground"
        }`}
        data-testid="button-lang-en"
      >
        <span className="mr-1.5">🇬🇧</span>
        EN
      </Button>
    </div>
  );
}

export function LanguageToggleCompact() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLanguage}
      className="rounded-full"
      data-testid="button-lang-toggle"
    >
      <Globe className="h-4 w-4" />
    </Button>
  );
}
