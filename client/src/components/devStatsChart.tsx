import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MetricData } from "./types";
import { useTranslation } from "@/i18n";

interface Props {
  metrics: MetricData[];
}

const DeviceStatsChart: React.FC<Props> = ({ metrics }) => {
  const { t } = useTranslation();
  const chartConfig = {
    Desktop: { label: "Desktop", color: "#29B6F6"  },
    Mobile: { label: "Mobile", color:  "#FF7043" },
    Tablet: { label: "Tablet", color: "#66BB6A" },
  } satisfies ChartConfig ;

  const formattedMetrics = metrics.map((metric) => ({
    timestamp: new Date(metric.timestamp).toLocaleTimeString(),
    Desktop: metric.deviceStats.desktop,
    Mobile: metric.deviceStats.mobile,
    Tablet: metric.deviceStats.tablet,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('devdistribution')}</CardTitle>
        <CardDescription>{t('devdismes')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={formattedMetrics} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickMargin={8}
              tickFormatter={(time) => time} // Display formatted timestamp
              tickLine={false}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} label={{ value: "visits", angle: -90, position: "insideLeft" }} />
            <ChartTooltip cursor={{ stroke: "hsl(var(--muted))" }} content={<ChartTooltipContent />} />
            
            {/* Desktop Line */}
            <Line type="monotone" dataKey="Desktop" stroke="#29B6F6" strokeWidth={2} dot={false} />
            {/* Mobile Line */}
            <Line type="monotone" dataKey="Mobile" stroke="#FF7043" strokeWidth={2} dot={false} />
            {/* Tablet Line */}
            <Line type="monotone" dataKey="Tablet" stroke="#66BB6A" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DeviceStatsChart;
