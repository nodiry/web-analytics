import { Code, Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useTranslation } from '@/i18n';

interface Props { unique_key: string }

export default function CodeGuide({ unique_key }: Props) {
  const { t } = useTranslation();

  const scriptCode = `<script>
  (function () {
    const analyticsServer = "https://track.glasscube.io/${unique_key}";
    const getSessionId = () => {
      const existing = localStorage.getItem("session_id");
      if (existing) return existing;
      const newId = "sess-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("session_id", newId);
      return newId;
    };
    const getDeviceType = () =>
      /Mobi|Android/i.test(navigator.userAgent) ? "mobile" :
      /Tablet|iPad/i.test(navigator.userAgent) ? "tablet" : "desktop";
    const sendAnalyticsData = () => {
      const data = {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        loadTime: performance.now(),
        session_id: getSessionId(),
        deviceType: getDeviceType()
      };
      navigator.sendBeacon(analyticsServer, JSON.stringify(data));
    };
    if (document.readyState === "complete") sendAnalyticsData();
    else window.addEventListener("load", sendAnalyticsData);
  })();
</script>`;

  const highlightedCode = `<span style="color:#e06c75;">&lt;script&gt;</span><br>
<span style="color:#c678dd;">(function ()</span> <span style="color:#c678dd;">{</span><br>
<span style="color:#56b6c2;">  const</span> <span style="color:#e5c07b;">analyticsServer</span> = "https://track.glasscube.io/${unique_key}";<br>
<span style="color:#56b6c2;">  const</span> <span style="color:#e5c07b;">getSessionId</span> = <span style="color:#c678dd;">() =&gt; {</span><br>
<span style="color:#56b6c2;">    const</span> <span style="color:#e5c07b;">existing</span> = localStorage.getItem("session_id");<br>
<span style="color:#56b6c2;">    if</span> <span style="color:#c678dd;">(</span>existing<span style="color:#c678dd;">)</span> <span style="color:#56b6c2;">return</span> existing;<br>
<span style="color:#56b6c2;">    const</span> <span style="color:#e5c07b;">newId</span> = "sess-" + Math.random().toString(36).substr(2, 9);<br>
<span style="color:#e5c07b;">    localStorage.setItem</span>("session_id", newId);<br>
<span style="color:#56b6c2;">    return</span> newId;<br>
  <span style="color:#c678dd;">};</span><br>
<span style="color:#56b6c2;">  const</span> <span style="color:#e5c07b;">getDeviceType</span> = <span style="color:#c678dd;">() =&gt;</span><br>
    /Mobi|Android/i.test(navigator.userAgent) ? "mobile" :<br>
    /Tablet|iPad/i.test(navigator.userAgent) ? "tablet" : "desktop";<br>
<span style="color:#56b6c2;">  const</span> <span style="color:#e5c07b;">sendAnalyticsData</span> = <span style="color:#c678dd;">() =&gt; {</span><br>
<span style="color:#56b6c2;">    const</span> <span style="color:#e5c07b;">data</span> = <span style="color:#c678dd;">{</span><br>
      url: window.location.href,<br>
      referrer: document.referrer,<br>
      timestamp: Date.now(),<br>
      loadTime: performance.now(),<br>
      session_id: getSessionId(),<br>
      deviceType: getDeviceType()<br>
    <span style="color:#c678dd;">};</span><br>
<span style="color:#e5c07b;">    navigator.sendBeacon</span>(analyticsServer, JSON.stringify(data));<br>
  <span style="color:#c678dd;">};</span><br>
<span style="color:#56b6c2;">  if</span> (document.readyState === "complete") sendAnalyticsData();<br>
<span style="color:#56b6c2;">  else</span> window.addEventListener("load", sendAnalyticsData);<br>
<span style="color:#c678dd;">})();</span><br>
<span style="color:#e06c75;">&lt;/script&gt;</span>`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Code className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{t('integration')}</DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { navigator.clipboard.writeText(scriptCode); toast.success('Copied!'); }}
                    className="gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Clipboard className="h-4 w-4" /> Copy
                  </Button>
                </div>
              </DialogHeader>
              <div className="rounded-lg bg-[#1e1e2e] overflow-auto max-h-[60vh]">
                <pre
                  className="font-mono text-xs leading-5 p-4"
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>{t('integrationmes')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
