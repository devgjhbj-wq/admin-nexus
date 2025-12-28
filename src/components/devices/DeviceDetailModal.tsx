import { DeviceLog } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeviceDetailModalProps {
  device: DeviceLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeviceDetailModal({
  device,
  isOpen,
  onClose,
}: DeviceDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!device) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyableField = ({ label, value, field }: { label: string; value: string; field: string }) => (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <p className="font-mono text-sm flex-1 break-all">{value}</p>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 shrink-0"
          onClick={() => copyToClipboard(value, field)}
        >
          {copiedField === field ? (
            <Check className="h-3 w-3 text-primary" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg">Device Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">User ID</p>
            <p className="font-mono text-sm font-medium text-primary">
              {device.userId}
            </p>
          </div>

          <CopyableField label="Device ID" value={device.deviceId} field="deviceId" />
          <CopyableField label="IP Address" value={device.ip} field="ip" />
          <CopyableField label="Ad ID" value={device.adId} field="adId" />
          
          <div>
            <p className="text-xs text-muted-foreground mb-1">User Agent</p>
            <p className="font-mono text-xs text-muted-foreground bg-muted/50 p-2 rounded break-all">
              {device.ua}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Date</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(device.createdAt)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
