import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MetricData } from "./types";
import { useTranslation } from "@/i18n";

interface Props {
  metrics: MetricData[];
}

const VisitsChart: React.FC<Props> = ({ metrics }) => {
  const { t } = useTranslation();
  const formattedData = metrics.map((metric) => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    totalVisits: metric.totalVisits,
    uniqueVisitors: metric.uniqueVisitors,
  }));

  const chartConfig: ChartConfig = {
    totalVisits:    { label: "Total Visits",     color: "#8884d8" },
    uniqueVisitors: { label: "Unique Visitors",  color: "#82ca9d" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('visitchart')}</CardTitle>
        <CardDescription>{t('visitchartmes')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
            <LineChart data={formattedData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} label={{ value: "visits", angle: -90, position: "insideLeft" }} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Line
                type="monotone"
                dataKey="totalVisits"
                stroke={chartConfig.totalVisits.color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="uniqueVisitors"
                stroke={chartConfig.uniqueVisitors.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default VisitsChart;
