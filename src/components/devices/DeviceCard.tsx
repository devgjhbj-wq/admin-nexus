import { DeviceLog } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

interface DeviceCardProps {
  device: DeviceLog;
  onClick: () => void;
}

export function DeviceCard({ device, onClick }: DeviceCardProps) {
  const truncate = (str: string, length: number = 12) => {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-accent/5 active:scale-[0.98]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-mono text-sm font-medium text-primary">
              {device.userId}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {device.ip}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-muted-foreground">
              {truncate(device.deviceId)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
