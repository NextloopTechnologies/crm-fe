// ─────────────────────────────────────────────────────────────
// Bank Details — static lookup, prefilled & locked on selection
// ─────────────────────────────────────────────────────────────
export interface BankDetail {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankAddress: string;
  bankRoutingNo: string;
  accountHolderAddress: string;
}

export const BANK_DETAILS: BankDetail[] = [
  {
    bankName: "HDFC Bank",
    accountHolderName: "Acme Technologies Pvt Ltd",
    accountNumber: "50100123456789",
    ifscCode: "HDFC0007995",
    bankAddress: "MG Road, Bangalore",
    bankRoutingNo: "5634",
    accountHolderAddress: "MG Road, Bangalore",
  },
  {
    bankName: "ICICI Bank",
    accountHolderName: "Acme Technologies Pvt Ltd",
    accountNumber: "001234567890",
    ifscCode: "ICIC0000012",
    bankAddress: "Connaught Place, Delhi",
    bankRoutingNo: "5634",
    accountHolderAddress: "MG Road, Bangalore",
  },
  {
    bankName: "State Bank of India",
    accountHolderName: "Acme Technologies Pvt Ltd",
    accountNumber: "30456789123",
    ifscCode: "SBIN0001234",
    bankAddress: "Andheri East, Mumbai",
    bankRoutingNo: "5634",
    accountHolderAddress: "MG Road, Bangalore",
  },
  {
    bankName: "Axis Bank",
    accountHolderName: "Acme Technologies Pvt Ltd",
    accountNumber: "91020012345678",
    ifscCode: "UTIB0001234",
    bankAddress: "Banjara Hills, Hyderabad",
    bankRoutingNo: "5634",
    accountHolderAddress: "MG Road, Bangalore",
  },
  {
    bankName: "Bank of India",
    accountHolderName: "Acme Technologies Pvt Ltd",
    accountNumber: "601234567890",
    ifscCode: "BKID0006012",
    bankAddress: "Salt Lake, Kolkata",
    bankRoutingNo: "5634",
    accountHolderAddress: "MG Road, Bangalore",
  },
  {
    bankName: "Bank of Baroda",
    accountHolderName: "Acme Technologies Pvt Ltd",
    accountNumber: "12345678901234",
    ifscCode: "BARB0VJBARO",
    bankAddress: "Vastrapur, Ahmedabad",
    bankRoutingNo: "5634",
    accountHolderAddress: "MG Road, Bangalore",
  },
  {
    bankName: "Kotak Mahindra Bank",
    accountHolderName: "Acme Technologies Pvt Ltd",
    accountNumber: "8912345678",
    ifscCode: "KKBK0000958",
    bankAddress: "Koramangala, Bangalore",
    bankRoutingNo: "5634",
    accountHolderAddress: "MG Road, Bangalore",
  },
  {
    bankName: "Punjab National Bank",
    accountHolderName: "Acme Technologies Pvt Ltd",
    accountNumber: "3456789012345",
    ifscCode: "PUNB0345600",
    bankAddress: "Civil Lines, Jaipur",
    bankRoutingNo: "5634",
    accountHolderAddress: "MG Road, Bangalore",
  },
];

export const BANK_OPTIONS = BANK_DETAILS.map((b) => ({ label: b.bankName, value: b.bankName }));