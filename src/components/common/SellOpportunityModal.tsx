// components/common/SellOpportunityModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import SelectDropdown from "@/components/common/SelectDropdown";
import { ClipboardList, ListTodo, MoveUpRightIcon, } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { ROUTES } from "@/lib/route";

interface SellOpportunityModalProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: T | null;
  onSubmit: (row: T, data: { sellType: string; description: string }) => Promise<void> | void;
}

export function SellOpportunityModal<T>({
  open,
  onOpenChange,
  row,
  onSubmit,
}: SellOpportunityModalProps<T>) {
  const [sellType, setSellType] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const isSellTypeSelected = !!sellType;

  useEffect(() => {
    if (open) {
      setSellType("");
      setDescription("");
      setSaving(false);
    }
  }, [open]);

  const handleSave = async () => {
    if (!row || !isSellTypeSelected) return;
    setSaving(true);
    try {
      await onSubmit(row, { sellType, description });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async ()=> {
    navigation.navigate(ROUTES.PROJECT)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-full p-10 border border-[#ECECEC] shadow-xl rounded-[12px] w-full">
        <div className="flex flex-row gap-3 w-full">
          <ClipboardList className="text-[#FBBC05] bg-[#FBBC051A]/10 rounded-md" />
          <h1 className="text-xl font-semibold text-[#111127]">Sell Opportunity</h1>
        </div>

        <div className="flex gap-8 mt-5">
          <div className="flex-1 w-full">
            <SelectDropdown
              className="w-full"
              label="Sell Type"
              placeholder="Select Sell Type"
              options={[
                {
                  label: "Upsell", value: "upSell", leftIcon: (
                    <span className="flex items-center justify-center h-6 w-6 rounded-md bg-[#0BD901]/10">
                      <MoveUpRightIcon size={15} className="text-[#0BD901]" />
                    </span>
                  ),
                },
                { label: "Cross-sell", value: "crossSell", leftIcon: (
                    <span className="flex items-center justify-center h-6 w-6 rounded-md bg-[#5752FE]/10">
                      <ListTodo size={15} className="text-[#5752FE]" />
                    </span>
                  ),
                },
              ]}
              value={sellType}
              onChange={(val: string) => setSellType(val)}
            />
          </div>

          <div
            className={`flex-1 transition-opacity duration-200 ${isSellTypeSelected ? "opacity-100" : "opacity-40 pointer-events-none"
              }`}
          >
            <label
              className={`text-sm font-medium transition-colors duration-200 ${isSellTypeSelected ? "text-[#252525]" : "text-[#252525]/30"
                }`}
            >
              Description
            </label>
            <Textarea
              placeholder="Enter description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isSellTypeSelected}
              className={`w-full rounded-lg px-4 py-3 text-sm resize-none ${isSellTypeSelected ? "border border-[#252525]/30" : "border-none"}`}
            />
          </div>
        </div>

        <div
          className={`flex justify-end gap-3 mt-8 transition-opacity duration-200 ${isSellTypeSelected ? "opacity-100" : "opacity-40 pointer-events-none"
            }`}
        >
          <Button action="cancel" loading={saving} onClick={handleCancel} />
          <Button action="save" loading={saving} onClick={handleSave}>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}