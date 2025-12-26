import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Smartphone, Copy, Check } from "lucide-react";
import { fetchDevices, DeviceLog } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DevicesPage() {
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["devices", page],
    queryFn: () => fetchDevices(page),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncate = (str: string, length: number = 20) => {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CopyButton = ({ value, id }: { value: string; id: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={(e) => {
        e.stopPropagation();
        copyToClipboard(value, id);
      }}
    >
      {copiedId === id ? (
        <Check className="h-3 w-3 text-primary" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  const columns = [
    {
      key: "userId",
      header: "User ID",
      render: (device: DeviceLog) => (
        <span className="font-mono text-primary">{device.userId}</span>
      ),
    },
    {
      key: "deviceId",
      header: "Device ID",
      render: (device: DeviceLog) => (
        <div className="group flex items-center gap-2">
          <span className="font-mono">{truncate(device.deviceId, 12)}</span>
          <CopyButton value={device.deviceId} id={`device-${device.id}`} />
        </div>
      ),
    },
    {
      key: "ip",
      header: "IP Address",
      render: (device: DeviceLog) => (
        <div className="group flex items-center gap-2">
          <span className="font-mono">{device.ip}</span>
          <CopyButton value={device.ip} id={`ip-${device.id}`} />
        </div>
      ),
    },
    {
      key: "adId",
      header: "Ad ID",
      render: (device: DeviceLog) => (
        <div className="group flex items-center gap-2">
          <span className="font-mono">{truncate(device.adId, 16)}</span>
          <CopyButton value={device.adId} id={`ad-${device.id}`} />
        </div>
      ),
    },
    {
      key: "ua",
      header: "User Agent",
      render: (device: DeviceLog) => (
        <div className="group flex items-center gap-2 max-w-[200px]">
          <span className="font-mono text-muted-foreground truncate">
            {truncate(device.ua, 30)}
          </span>
          <CopyButton value={device.ua} id={`ua-${device.id}`} />
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (device: DeviceLog) => (
        <span className="text-muted-foreground">{formatDate(device.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Smartphone className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Device Logs</h1>
          <p className="text-muted-foreground">
            {data?.totalRecords ?? 0} device entries
          </p>
        </div>
      </div>

      <DataTable<DeviceLog>
        columns={columns}
        data={data?.devices ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        emptyMessage="No device logs found"
      />
    </div>
  );
}
