import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import CustomDropdown from "../designingComponents/CustomDropdown";
import { FileText } from "lucide-react";
import favPng from "../assets/fav.png";
import * as XLSX2 from "xlsx-js-style";
import { useTheme } from "../contexts/ThemeContext"; 
import { useAuth } from "../contexts/AuthContext";

const API_BASE = "https://salarygenbackend-3.onrender.com/api";
const rowsPerPage = 10;

const toBase64 = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
  });


const resolveStaffName = (r, staffList) => {

  if (r.staffName && String(r.staffName).trim())
    return String(r.staffName).trim();
  if (r.employeeName && String(r.employeeName).trim())
    return String(r.employeeName).trim();
  if (r.staff && r.staff.name && String(r.staff.name).trim())
    return String(r.staff.name).trim();

  
  const id = r.staffId ?? (r.staff && r.staff.id) ?? null;
  if (id != null) {
    const s = staffList.find((x) => String(x.id) === String(id));
    if (s) {
      if (s.name && String(s.name).trim()) return String(s.name).trim();
      const combined = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim();
      if (combined) return combined;
    }
  }

  
  return id != null ? `(${id})` : "(unknown)";
};


const computeStatus = (r) => {
  
  if (r.status && String(r.status).trim()) {
    const s = String(r.status).trim().toLowerCase();
    if (
      s.includes("reliev") ||
      s.includes("resign") ||
      s.includes("left") ||
      s === "inactive"
    )
      return "Relieved";
    if (s === "active" || s === "working" || s === "employed") return "Active";
    
    return String(r.status).charAt(0).toUpperCase() + String(r.status).slice(1);
  }

  
  const relivedKeys = [
    "relived",
    "relieved",
    "relivedAt",
    "relievedAt",
    "relivedDate",
  ];
  for (const k of relivedKeys) {
    if (Object.prototype.hasOwnProperty.call(r, k)) {

      const v = r[k];
      if (v == null || v === "") return "Active";
      return "Relieved";
    }
  }

  return "Unknown";
};

export default function Reports() {
    const {token} = useAuth();
    const theme  = useTheme();
    const isDarkMode = theme.isDarkMode;

  const [staffList, setStaffList] = useState([]);
  const [reportType, setReportType] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [reports, setReports] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");

 useEffect(() => {
    axios
      .get(`${API_BASE}/hr/staff`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => setStaffList(res.data || []))
      .catch((err) => {
        console.error("Failed to load staff:", err);
        setStaffList([]);
      });
  }, [token]);

  const fetchReports = async () => {
    let url = "";

    switch (reportType) {
      case "All Staff - All Months":
        url = `${API_BASE}/hr/salary-transactions`;
        break;
      case "All Staff - Specific Month":
        if (!selectedMonth) {
          alert("Please choose a month.");
          return;
        }
        url = `${API_BASE}/hr/salary-transactions/month?month=${selectedMonth}`;
        break;
      case "All Staff - Latest Month":
        url = `${API_BASE}/hr/salary-transactions/latest`;
        break;
      case "Specific Staff - All Months":
        if (!selectedStaff) {
          alert("Please choose a staff.");
          return;
        }
        url = `${API_BASE}/hr/salary-transactions/staff/${selectedStaff}/all`;
        break;
      case "Specific Staff - Specific Month":
        if (!selectedStaff || !selectedMonth) {
          alert("Please choose staff and month.");
          return;
        }
         url = `${API_BASE}/hr/salary-transactions/staff/${selectedStaff}/month?month=${selectedMonth}`;
        break;

  case "All Staff - Month Range":
  if (!startMonth || !endMonth) {
    alert("Please choose start and end month.");
    return;
  }
  url = `${API_BASE}/hr/salary-transactions/range?start=${startMonth}&end=${endMonth}`;
  break;



      case "Specific Staff - Latest Month":
        if (!selectedStaff) {
          alert("Please choose a staff.");
          return;
        }
        url = `${API_BASE}/hr/salary-transactions/staff/${selectedStaff}/latest`;
        break;
      default:
        alert("Please select a valid report type.");
        return;
    }

   try {
      const res = await axios.get(url,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      });
      const data = res.data;
      console.log(data);
      setReports(Array.isArray(data) ? data : data ? [data] : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching reports:", err);
      alert("Error fetching reports. See console.");
    }
  };

  

    function formatAmount(val) {
      if (val == null) return "";
      return "Rs. " + new Intl.NumberFormat("en-IN").format(val);
    }

 
  const downloadPayslip = async (report) => {
  let url = `https://salarygenbackend-3.onrender.com/api/hr/staff/${report.staffId}`;

  const res = await fetch(url,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      });
  if (!res.ok) throw new Error("Failed to fetch employee details");

  const userDetails = await res.json();

  try {
    if (!report) {
      alert("Invalid report data.");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 40;
    let y = 40;

  
const logoBase64 = await toBase64(favPng); 

autoTable(doc, {
  startY: y,
  body: [
    [
      { 
        content: report.companyName ?? "SalaryGen",
        styles: { halign: "center", fontStyle: "bold", fontSize: 14 }
      },
      { 
        content: `Name: ${report.staffName ?? "-"}`,
        styles: { halign: "left", fontSize: 11 }
      }
    ],
    [
      { 
        content: `Salary Slip for ${report.salaryMonth ?? "-"}`,
        styles: { halign: "center", fontSize: 12 }
      },
      { 
        content: `Emp. No: ${report.staffId ?? "-"}`,
        styles: { halign: "left", fontSize: 11 }
      }
    ]
  ],
  theme: "grid", 
  styles: { fontSize: 11, cellPadding: 4, valign: "middle" },
  columnStyles: {
    0: { cellWidth: pageWidth * 0.5 }, 
    1: { cellWidth: pageWidth * 0.37 }, 
  },
  didDrawCell: function (data) {
   
    if (data.row.index === 0 && data.column.index === 0 && logoBase64) {
      const textWidth = doc.getTextWidth(report.companyName ?? "SalaryGen");
      const logoSize = 12;
      doc.addImage(
        logoBase64,
        "PNG",
        data.cell.x + (data.cell.width / 2) + (textWidth / 2) + 5, 
        data.cell.y + 5,
        logoSize,
        logoSize
      );
    }
  }
});

y = doc.lastAutoTable.finalY + 20; 

    autoTable(doc, {
      startY: y,
      head: [
        [
          "Department",
          "Joining Date",
          "Relieved Date",
          "Bank Name",
          "IFSC Code",
          "Account Number"
        ],
      ],
      body: [
        [
          userDetails.department ?? "-",
          userDetails.joiningDate ?? "-",
          userDetails.relievedDate ?? "Working",
          userDetails.salaryDetails?.bankName ?? "-",
          userDetails.salaryDetails?.ifscCode ?? "-",
          userDetails.salaryDetails?.bankAccountNumber ?? "-",
        ],
      ],
      theme: "grid",
      styles: { fontSize: 11, halign: "center", cellPadding: 5 },
      headStyles: { fillColor: [220, 220, 220], textColor: 0 },
      columnStyles: {
        6: { halign: "center" }, 
      },
    });

    y = doc.lastAutoTable.finalY + 20;

    const earnings = [];
    const deductions = [];

    if (report.basicPay != null)
      earnings.push(["Basic Salary", formatAmount(report.basicPay)]);

    if (report.componentBreakdown) {
      Object.entries(report.componentBreakdown).forEach(([key, val]) => {
        if (val == null) return;
        const upperKey = key.toUpperCase();
        if (["PF", "PT", "ESI", "TDS", "INSURANCE","OTHER_DEDUCTIONS"].includes(upperKey)) {
          deductions.push([key, formatAmount(val)]);
        } else {
          earnings.push([key, formatAmount(val)]);
        }
      });
    }

    const maxRows = Math.max(earnings.length, deductions.length);
    const bodyRows = [];
    for (let i = 0; i < maxRows; i++) {
      bodyRows.push([
        earnings[i]?.[0] ?? "",
        earnings[i]?.[1] ?? "",
        deductions[i]?.[0] ?? "",
        deductions[i]?.[1] ?? "",
      ]);
    }

    autoTable(doc, {
      startY: y,
      head: [["Earnings", "Amount", "Deductions", "Amount"]],
      body: bodyRows,
      theme: "grid",
      styles: { fontSize: 11, halign: "center", cellPadding: 5 },
      columnStyles: {
        1: { halign: "right" },
        3: { halign: "right" },
      },
      headStyles: { fillColor: [200, 200, 200], textColor: 0 },
    });

    const summaryY = doc.lastAutoTable.finalY + 10;
    autoTable(doc, {
      startY: summaryY,
      body: [
        ["Gross Salary", formatAmount(report.grossSalary)],
        ["Total Deductions", formatAmount(report.totalDeductions)],
        ["Net Pay", formatAmount(report.netSalary)],
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold" },
        1: { halign: "right" },
      },
    });

function toWords(num) {
  if (!num && num !== 0) return "-"; // handle undefined/null
  if (num === 0) return "Zero Rupees Only /-";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
    "Nineteen",
  ];

  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty",
    "Seventy", "Eighty", "Ninety",
  ];

  function inWords(n) {
    n = Math.floor(n); // ensure integer
    if (n === 0) return "";
    if (n < 20) return a[n];
    if (n < 100) return (b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "")).trim();
    if (n < 1000) return (a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "")).trim();
    if (n < 100000) return (inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "")).trim();
    if (n < 10000000) return (inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "")).trim();
    return (inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + inWords(n % 10000000) : "")).trim();
  }


  const [integerPart, fractionPart] = num.toFixed(2).split(".");
  let words = inWords(parseInt(integerPart)) + " Rupees";

  if (parseInt(fractionPart) > 0) {
    words += " and " + inWords(parseInt(fractionPart)) + " Paise";
  }

  return words + " Only /-";
}


const wordsY = (doc.lastAutoTable?.finalY ?? 50) + 20;
doc.setFontSize(11);
doc.text(
  `Amount in Words: ${toWords(report.netSalary)}`,
  marginX,
  wordsY
);

    
    const footerY = wordsY + 40;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      "This is a system-generated payslip and does not require a signature.",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );
    doc.text("Generated by SalaryGen", pageWidth / 2, footerY + 14, {
      align: "center",
    });


    const fileName = `Payslip_${report.staffId ?? "Staff"}_${
      report.salaryMonth ?? "Month"
    }.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error("Failed to generate payslip:", err);
    alert("Failed to generate payslip. See console.");
  }
};


const exportAllToExcel = () => {
  if (!reports || reports.length === 0) {
    alert("No reports to export!");
    return;
  }

  const headers = [
    "Employee Name",
    "Employee ID",
    "Salary Month",
    "Basic Salary",
    "Allowances",
    "Deductions",
    "Net Salary",
  ];

  const data = reports.map(r => ({
    "Employee Name": r.staffName ?? "-",
    "Employee ID": r.staffId ?? "-",
    "Salary Month": r.salaryMonth ?? "-",
    "Basic Salary": r.basicPay ?? 0,
    "Allowances": (r.grossSalary ?? 0) - (r.basicPay ?? 0),
    "Deductions": r.totalDeductions ?? 0,
    "Net Salary": r.netSalary ?? ((r.grossSalary ?? 0) - (r.totalDeductions ?? 0)),
  }));

  const worksheet = XLSX2.utils.json_to_sheet(data, { header: headers });

  
  worksheet["!cols"] = [
    { wch: 20 }, 
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 15 }, 
  ];


  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };


  Object.keys(worksheet).forEach(cell => {
    if (cell[0] === "!") return;

    const colIndex = XLSX2.utils.decode_cell(cell).c;


    worksheet[cell].s = {
      alignment: { horizontal: "center", vertical: "center" },
    };

  
    if (colIndex >= 3) {
      worksheet[cell].s = {
        alignment: { horizontal: "center", vertical: "center" },
        numFmt: '"₹"#,##0.00',
      };
    }
  });

  headers.forEach((header, i) => {
    const cellRef = XLSX2.utils.encode_cell({ r: 0, c: i });
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = {
        font: { bold: true, sz: 12 },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  });

  const workbook = XLSX2.utils.book_new();
  XLSX2.utils.book_append_sheet(workbook, worksheet, "Reports");
  XLSX2.writeFile(workbook, "SalaryReports.xlsx");
};


  const enriched = useMemo(
    () =>
      (reports || []).map((r) => ({
        ...r,
        staffName: resolveStaffName(r, staffList),
        normalizedStatus: computeStatus(r),
        netSalary: r.netSalary ?? r.amount ?? null,
      })),
    [reports, staffList]
  );

  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return enriched;
    return enriched.filter((r) => {
      return (
        String(r.staffName || "")
          .toLowerCase()
          .includes(q) ||
        String(r.staffId || "")
          .toLowerCase()
          .includes(q) ||
        String(r.salaryMonth || "")
          .toLowerCase()
          .includes(q) ||
        String(r.normalizedStatus || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [enriched, searchQuery]);


  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case "staffName":
          aVal = String(a.staffName || "").toLowerCase();
          bVal = String(b.staffName || "").toLowerCase();
          break;
        case "netSalary":
          aVal = Number(a.netSalary ?? 0);
          bVal = Number(b.netSalary ?? 0);
          break;
        case "salaryMonth":
          aVal = String(a.salaryMonth || "");
          bVal = String(b.salaryMonth || "");
          break;
        case "id":
        default:
          aVal = a.id ?? 0;
          bVal = b.id ?? 0;
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortField, sortOrder]);


  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, currentPage]);

  const handleSort = (field) => {
    if (sortField === field)
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const staffOptionLabel = (s) => {
    const nm = s.name ?? `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim();
    return `${nm || "(No Name)"} (${s.id})`;
  };
  const parseStaffIdFromOption = (opt) => {
    if (!opt) return "";
    const m = opt.match(/\(([^)]+)\)\s*$/);
    return m ? m[1] : opt;
  };

  return (
  <div className="p-4 sm:p-6 grid gap-6">

    <div
      className={`p-4 sm:p-6 rounded-xl shadow-xl ${
        isDarkMode ? "bg-slate-900 border border-slate-700" : "bg-slate-100"
      }`}
    >
      <h2
        className={`text-lg sm:text-xl font-semibold mb-4 ${
          isDarkMode
            ? "bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-slate-300"
            : "text-blue-400"
        }`}
      >
        Generate Salary Reports
      </h2>
    
    <CustomDropdown
  label="Report Type"
  value={reportType}
  onChange={(v) => {
    setReportType(v);
    setSelectedStaff("");
    setSelectedMonth("");
    setStartMonth("");
    setEndMonth("");
  }}
  options={[
    "All Staff - All Months",
    "All Staff - Specific Month",
    "All Staff - Latest Month",
    "All Staff - Month Range",
    "Specific Staff - All Months",
    "Specific Staff - Specific Month",
    "Specific Staff - Latest Month",
  ]}
  placeholder="Select Report Type"
  isDarkMode={isDarkMode}
/>

{reportType.includes("Specific Month") && (
          <div>
            <label
              className={`block text-xs sm:text-sm mb-1 ${
                isDarkMode ? "text-slate-300" : "text-blue-400"
              }`}
            >
              Month
            </label>
            <input
              type="text"
              placeholder="YYYY-MM"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`w-full rounded-lg border p-2 focus:outline-none focus:border-teal-500 ${
                isDarkMode
                  ? "border-slate-600 bg-slate-900 text-slate-200"
                  : "border-blue-400 bg-white text-blue-400"
              }`}
            />
          </div>
        )}

        {reportType.includes("Specific Staff") && (
          <div>
            <CustomDropdown
              label="Select Staff"
              value={
                staffList.find((s) => String(s.id) === String(selectedStaff))
                  ? staffOptionLabel(
                      staffList.find((s) => String(s.id) === String(selectedStaff))
                    )
                  : ""
              }
              onChange={(val) => {
                const id = parseStaffIdFromOption(val);
                setSelectedStaff(id);
              }}
              options={staffList.map((s) => staffOptionLabel(s))}
              placeholder="Choose Staff"
              isDarkMode={isDarkMode}
            />
          </div>
        )}

{reportType === "All Staff - Month Range" && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
    <div>
      <label
        className={`block text-xs sm:text-sm mb-1 ${
          isDarkMode ? "text-slate-300" : "text-blue-400"
        }`}
      >
        Start Month
      </label>
      <input
        type="month"
        value={startMonth}
        onChange={(e) => setStartMonth(e.target.value)}
        className={`w-full rounded-lg border p-2 focus:outline-none focus:border-teal-500 ${
          isDarkMode
            ? "border-slate-600 bg-slate-900 text-slate-200"
            : "border-blue-400 bg-white text-blue-400"
        }`}
      />
    </div>

    <div>
      <label
        className={`block text-xs sm:text-sm mb-1 ${
          isDarkMode ? "text-slate-300" : "text-blue-400"
        }`}
      >
        End Month
      </label>
      <input
        type="month"
        value={endMonth}
        onChange={(e) => setEndMonth(e.target.value)}
        className={`w-full rounded-lg border p-2 focus:outline-none focus:border-teal-500 ${
          isDarkMode
            ? "border-slate-600 bg-slate-900 text-slate-200"
            : "border-blue-400 bg-white text-blue-400"
        }`}
      />
    </div>
  </div>
)}

    
      <div className="flex flex-wrap gap-3 mt-5 items-center">
        <button
          onClick={fetchReports}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg shadow-md ${
            isDarkMode
              ? "bg-teal-600 text-white hover:bg-teal-700"
              : "bg-blue-400 text-white hover:bg-blue-500"
          }`}
        >
          Fetch Report
        </button>

        <button
          onClick={exportAllToExcel}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg shadow-md ${
            isDarkMode
              ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
              : "bg-blue-100 text-blue-400 hover:bg-blue-200"
          }`}
        >
          Export All to Excel
        </button>

        <div
          className={`w-full sm:w-auto text-center sm:text-right text-xs sm:text-sm sm:ml-auto ${
            isDarkMode ? "text-slate-400" : "text-blue-400"
          }`}
        >
          {reports.length} results available
        </div>
      </div>
    </div>

  
    <div
      className={`p-4 sm:p-6 rounded-xl shadow-xl ${
        isDarkMode ? "bg-slate-900 border border-slate-700" : "bg-slate-100"
      }`}
    >
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by staff name, id, month or status..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 border ${
            isDarkMode
              ? "border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400"
              : "border-gray-300 bg-white text-blue-400 placeholder-blue-200"
          }`}
        />
        <div
          className={`${isDarkMode ? "text-slate-400" : "text-blue-400"} text-xs sm:text-sm`}
        >
          Showing {Math.min(sorted.length, currentPage * rowsPerPage) || 0} of{" "}
          {sorted.length} filtered
        </div>
      </div>

      
      <div className="hidden sm:block overflow-x-auto">
        <table
          className={`w-full table-auto text-center transition ${
            isDarkMode ? "text-slate-200" : "text-gray-800"
          }`}
        >
          <thead>
            <tr className={isDarkMode ? "bg-slate-900" : "bg-white"}>
              {["ID", "Staff", "Month", "Net Salary", "Status", "Action"].map(
                (header, index) => (
                  <th
                    key={index}
                    className={`p-3 text-sm cursor-pointer uppercase tracking-wider transition ${
                      isDarkMode
                        ? "text-teal-400 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((r) => (
                <tr
                  key={r.id}
                  className={`border-b transition ${
                    isDarkMode
                      ? "border-slate-700 hover:bg-slate-800"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.staffName} ({r.staffId})</td>
                  <td className="p-3">{r.salaryMonth}</td>
                  <td className="p-3">{r.netSalary ? `₹${r.netSalary}` : "N/A"}</td>
                  <td className="p-3">
                    {r.active === true
                      ? "Active"
                      : r.active === false
                      ? "Relieved"
                      : "Unknown"}
                  </td>
                  <td className="p-3">
                    {r.staffId && r.salaryMonth ? (
                      <button onClick={() => downloadPayslip(r)}>
                        <FileText className="w-5 h-5 text-blue-500" />
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 italic text-gray-500">
                  No reports fetched yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
<div className="block sm:hidden space-y-4">
  {paginated.length > 0 ? (
    paginated.map((r) => (
      <div
        key={r.id}
        className={`p-4 rounded-2xl shadow-md border ${
          isDarkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
       
        <div className="flex justify-between items-center mb-2">
          <h3
            className={`font-semibold text-base ${
              isDarkMode ? "text-cyan-300" : "text-blue-500"
            }`}
          >
            {r.staffName}
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              r.active === true
                ? isDarkMode
                  ? "bg-yellow-600/20 text-yellow-400"
                  : "bg-green-100 text-green-600"
                : r.active === false
                ? isDarkMode
                  ? "bg-slate-700 text-slate-300"
                  : "bg-red-100 text-red-500"
                : "text-gray-400"
            }`}
          >
            {r.active === true
              ? "Active"
              : r.active === false
              ? "Relieved"
              : "Unknown"}
          </span>
        </div>

        
        <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-500">
          <span>ID</span>
          <span className={isDarkMode ? "text-slate-200" : "text-gray-800"}>
            {r.id}
          </span>

          <span>Staff ID</span>
          <span className={isDarkMode ? "text-slate-200" : "text-gray-800"}>
            {r.staffId}
          </span>

          <span>Month</span>
          <span
            className={`font-mono ${
              isDarkMode ? "text-blue-400" : "text-gray-600"
            }`}
          >
            {r.salaryMonth}
          </span>

          <span>Net Salary</span>
          <span
            className={`font-bold ${
              isDarkMode ? "text-teal-400" : "text-blue-600"
            }`}
          >
            {r.netSalary ? `₹${r.netSalary}` : "N/A"}
          </span>
        </div>

       
        <div className="flex justify-end mt-3">
          {r.staffId && r.salaryMonth ? (
            <button
              onClick={() => downloadPayslip(r)}
              className="flex items-center gap-1 px-3 py-1 text-xs rounded-full shadow-sm transition
                bg-blue-500 text-white hover:bg-blue-600"
            >
              <FileText className="w-4 h-4" />
              Payslip
            </button>
          ) : (
            <span
              className={`text-xs ${
                isDarkMode ? "text-slate-500" : "text-gray-400"
              }`}
            >
              No Action
            </span>
          )}
        </div>
      </div>
    ))
  ) : (
    <div className="text-center text-xs italic text-gray-500">
      No reports fetched yet.
    </div>
  )}
</div>


    
<div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
  <div
    className={`text-xs sm:text-sm ${
      isDarkMode ? "text-teal-400" : "text-blue-600"
    }`}
  >
    Page {currentPage} of {totalPages}
  </div>

  <div className="flex flex-wrap gap-2 justify-center">
   
    <button
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage <= 1}
      className={`px-2 py-1 text-xs sm:text-sm rounded disabled:opacity-50 transition-colors
        ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}
      `}
    >
      Prev
    </button>

    
    {[...Array(totalPages)].slice(0, 5).map((_, i) => {
      const page = i + 1;
      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-2 py-1 text-xs sm:text-sm rounded transition-colors
            ${
              page === currentPage
                ? isDarkMode
                  ? "bg-teal-500 text-white"
                  : "bg-blue-400 text-black"
                : isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200 text-gray-700"
            }
          `}
        >
          {page}
        </button>
      );
    })}


    <button
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      disabled={currentPage >= totalPages}
      className={`px-2 py-1 text-xs sm:text-sm rounded disabled:opacity-50 transition-colors
        ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}
      `}
    >
      Next
    </button>
  </div>
</div>

    </div>
  </div>
);

}







