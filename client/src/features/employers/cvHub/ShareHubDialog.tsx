import { useRef, useState } from "react";
import { ReactQRCode } from "@lglab/react-qr-code";
import type { ReactQRCodeRef } from "@lglab/react-qr-code";
import { Check, Copy, Download, Link2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buildShareUrl } from "./cvHubApi";
import type { CvHub } from "./types";

/**
 * ShareHubDialog — share a hub's public form via copyable link + QR code.
 */
export default function ShareHubDialog({ hub }: { hub: CvHub }) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<ReactQRCodeRef>(null);
  const shareUrl = buildShareUrl(hub.slug);

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build a filesystem-safe filename from the hub name.
  const fileName = `${(hub.name || "cv-hub")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}-qr`;

  // Render the QR code as a high-resolution PNG and trigger a download via the
  // library's built-in helper (exposed through the component ref).
  const handleDownload = () => {
    qrRef.current?.download({ name: fileName, format: "png", size: 1024 });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 px-3 cursor-pointer text-gray-700 hover:border-[#008CBA]/40 hover:text-[#008CBA]"
        >
          <QrCode className="w-4 h-4 ltr:mr-1.5 rtl:ml-1.5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F7FB]">
            <QrCode className="h-7 w-7 text-[#008CBA]" />
          </div>
          <DialogTitle className="text-center text-xl">
            Share “{hub.name}”
          </DialogTitle>
          <DialogDescription className="text-center">
            Candidates scan the QR code or open the link to submit their CV to
            this hub.
          </DialogDescription>
        </DialogHeader>

        {/* QR code */}
        <div className="mt-2 flex flex-col items-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <ReactQRCode
              ref={qrRef}
              value={shareUrl}
              size={192}
              marginSize={2}
              level="M"
              dataModulesSettings={{
                style: "rounded",
              }}
              background="#ffffff"
              minVersion={1}
              svgProps={{
                className: "h-48 w-48 rounded-lg",
                role: "img",
                "aria-label": `QR code for ${hub.name}`,
              }}
            />
          </div>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-400">
            <QrCode className="w-3.5 h-3.5" />
            Scan to open the submission form
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={handleDownload}
            className="mt-3 h-9 cursor-pointer text-gray-700 hover:border-[#008CBA]/40 hover:text-[#008CBA]"
          >
            <Download className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5" />
            Download QR code
          </Button>
        </div>

        {/* Copyable link */}
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 border border-gray-200">
            <Link2 className="h-4 w-4" />
          </span>
          <Input
            readOnly
            value={shareUrl}
            onFocus={(e) => e.target.select()}
            className="flex-1 border-0 bg-transparent text-sm text-gray-600 shadow-none focus-visible:ring-0"
          />
          <Button
            type="button"
            onClick={handleCopy}
            className={`shrink-0 rounded-lg text-white transition-colors ${
              copied
                ? "bg-green-500 hover:bg-green-500"
                : "bg-[#008CBA] hover:bg-[#0077A3]"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
