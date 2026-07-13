// components/common/SellOpportunityModal.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import SelectDropdown from "@/components/common/SelectDropdown";
import { ClipboardList, ListTodo, MoveUpRightIcon, } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { ROUTES } from "@/lib/route";
import { getAccountByAccountNumber } from "@/api/account.api";
import { createLead } from "@/api/leads.api";
import { CreateLeadRequest } from "@/types/api.types";
import { LEAD_TYPE_MAP, omitEmptyStrings, RATING_ENUM, replaceNAWithEmpty } from "@/lib/utils";

interface SellOpportunityRow {
  projectNumber: string;
  relatedToId: string;
}

interface SellOpportunityModalProps<T extends SellOpportunityRow> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: T | null;
  onSubmit?: (row: T, data: { sellType: string; description: string }) => Promise<void> | void;
}

export function SellOpportunityModal<T extends SellOpportunityRow>({
  open,
  onOpenChange,
  row,
  onSubmit,
}: SellOpportunityModalProps<T>) {
  const [sellType, setSellType] = useState("upSell");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSellTypeSelected = !!sellType;

  useEffect(() => {
    if (open) {
      setSellType("upSell");
      setDescription("");
      setSaving(false);
      setError(null);
    }
  }, [open]);

  const handleSave = async () => {
    if (!row || !isSellTypeSelected) return;
    setSaving(true);
    setError(null);

    try {
      // 1. Fetch account details using the account number from the row
      const accountRes = await getAccountByAccountNumber(row.relatedToId);
      const account = accountRes?.data;

      if (!account) {
        throw new Error("Account not found for this project.");
      }

      const contact = account.contacts?.[0] || {};
      const address = account.addresses?.[0] || {};

      // 2. Build raw lead payload
      const rawLeadData: CreateLeadRequest = {
        leadOwner: account.accountOwner,
        leadNumber: "",
        company: account.accountName,
        firstName: contact.firstName,
        lastName: contact.lastName,
        title: contact.title,
        email: contact.email,
        phone: contact.phone,
        fax: contact.fax,
        mobile: contact.mobile,
        website: account.website,
        leadSource: "Other",
        leadStatus: "New Lead",
        projectNo: row.projectNumber,
        accountNo: account.accountNumber,
        leadType: LEAD_TYPE_MAP[sellType] ?? sellType,
        leadDescription: description,
        industry: "",
        noOfEmployees: account.employees,
        annualRevenue: account.annualRevenue,
        rating: (RATING_ENUM as readonly string[]).includes(account.rating)
          ? account.rating
          : undefined,
        skypeId: contact.skypeId,
        secondaryEmail: contact.secondaryEmail,
        leadAddressRequestDto: {
          addressType: address.addressType,
          country: address.country,
          flatNo: address.flatNo,
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          latitude: address.latitude,
          longitude: address.longitude,
          organizationId: localStorage.getItem("orgnizationId") || ""
        },
      };

      const cleaned = replaceNAWithEmpty(rawLeadData);
      const leadData: CreateLeadRequest = {
        ...omitEmptyStrings(cleaned),
        leadAddressRequestDto: omitEmptyStrings(cleaned.leadAddressRequestDto),
      } as CreateLeadRequest;

      // 4. Create the lead
      await createLead(leadData);

      // 5. Optional external callback
      if (onSubmit) {
        await onSubmit(row, { sellType, description });
      }

      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
      console.error("Failed to create lead:", err);
      setError(err?.message || "Something went wrong while creating the lead.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async ()=> {
    navigation.navigate(ROUTES.PROJECT || history.back())
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-full p-10 border border-[#ECECEC] shadow-xl rounded-[12px] w-full">
        <div className="flex flex-row gap-3 w-full">
          <span className="flex items-center justify-center h-8 w-8 rounded-md bg-[#FBBC05]/10">
            <ClipboardList size={22} className="text-[#FBBC05]" />
          </span>
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
            className={`flex-1 transition-opacity duration-200
              }`}
          >
            <label
              className={`text-sm font-medium text-gray-700
                }`}
            >
              Description
            </label>
            <Textarea
              placeholder="Enter description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full rounded-lg px-4 py-3 text-sm resize-none border border-gray-300 !bg-transparent placeholder:text-gray-400`}/>
          </div>
        </div>

        <div
          className={`flex justify-end gap-3 mt-8 transition-opacity duration-200
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