import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function AdvisorChat() {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());

      setMessages([...next, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
      if (!acc.trim()) setError(t("assistantError"));
    } catch {
      setError(t("assistantError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div
        ref={boxRef}
        className="max-h-[360px] min-h-[220px] flex-1 space-y-3 overflow-y-auto rounded-2xl border border-border bg-secondary/30 p-3 sm:p-4"
      >
        <div className="flex items-start gap-2 rounded-xl border border-border bg-card p-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-strong">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">{t("assistantIntro")}</p>
        </div>

        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <p
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-primary-soft text-primary-strong"
                  : "border border-border bg-card text-card-foreground",
              )}
            >
              {m.content || (loading ? t("thinking") : "")}
            </p>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === "user" ? (
          <p className="text-xs text-muted-foreground">{t("thinking")}</p>
        ) : null}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>

      <form onSubmit={send} className="mt-3 flex min-w-0 items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("assistantPh")}
          dir={lang === "ar" ? "rtl" : "ltr"}
          aria-label={t("assistant")}
          className="min-w-0 flex-1 rounded-full"
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          size="icon"
          className="shrink-0 rounded-full"
          aria-label={t("send")}
        >
          <Send className="size-4 rtl:-scale-x-100" aria-hidden />
        </Button>
      </form>
    </div>
  );
}
