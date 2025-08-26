import { useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import favPng from "../assets/fav.png";
import useApi from "../customHooks/useApi";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const rowsPerPage = 8;

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

export default function Payslips() {
  const { token } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.isDarkMode;

  const { id } = useAuth();
  const staffId = id;
  const backendUrl = "https://salarygenbackend-3.onrender.com";
  const { get } = useApi(backendUrl);

  const [mode, setMode] = useState("latest");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = "";

      if (mode === "latest") {
        endpoint = `/api/staff/salary-transactions/${staffId}/latest`;
      } else if (mode === "month") {
        if (!month) {
          alert("Please select a month first");
          setLoading(false);
          return;
        }

        const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
        if (!monthRegex.test(month)) {
          alert("Invalid month format. Please select a valid month.");
          setLoading(false);
          return;
        }

        endpoint = `/api/staff/salary-transactions/${staffId}/month?month=${month}`;
      } else if (mode === "all") {
        endpoint = `/api/staff/salary-transactions/${staffId}/all`;
      }

      const response = await get(endpoint);
      const data = Array.isArray(response)
        ? response
        : response
        ? [response]
        : [];

      if (data.length === 0) {
        if (mode === "month") {
          alert(`No salary found for ${month}`);
        } else {
          alert("No salary records found.");
        }
      }

      setReports(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching salary data:", err);
      alert("Failed to fetch salary data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  function formatAmount(val) {
    if (val == null) return "";
    return "₹ " + new Intl.NumberFormat("en-IN").format(val);
  }

  const downloadPayslip = async (report) => {
    if (!report) {
      alert("Invalid report data.");
      return;
    }

    try {
      const url = `https://salarygenbackend-3.onrender.com/api/staff/${report.staffId}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch employee details");
      const userDetails = await res.json();

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 40;
      let y = 40;

      const logoBase64 = await toBase64(favPng);

      const formatAmount = (num) =>
        num != null
          ? num.toLocaleString("en-IN", { maximumFractionDigits: 2 })
          : "-";

      autoTable(doc, {
        startY: y,
        body: [
          [
            {
              content: report.companyName ?? "SalaryGen",
              styles: { halign: "center", fontStyle: "bold", fontSize: 14 },
            },
            {
              content: `Name: ${report.staffName ?? "-"}`,
              styles: { halign: "left", fontSize: 11 },
            },
          ],
          [
            {
              content: `Salary Slip for ${report.salaryMonth ?? "-"}`,
              styles: { halign: "center", fontSize: 12 },
            },
            {
              content: `Emp. No: ${report.staffId ?? "-"}`,
              styles: { halign: "left", fontSize: 11 },
            },
          ],
        ],
        theme: "grid",
        styles: {
          fontSize: 11,
          cellPadding: 6,
          valign: "middle",
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        columnStyles: {
          0: { cellWidth: pageWidth * 0.4 },
          1: { cellWidth: pageWidth * 0.45 },
        },
        didDrawCell: function (data) {
          if (data.row.index === 0 && data.column.index === 0 && logoBase64) {
            const textWidth = doc.getTextWidth(
              report.companyName ?? "SalaryGen"
            );
            const logoSize = 12;
            doc.addImage(
              logoBase64,
              "PNG",
              data.cell.x + data.cell.width / 2 + textWidth / 2 + 5,
              data.cell.y + 5,
              logoSize,
              logoSize
            );
          }
        },
      });

      y = doc.lastAutoTable.finalY + 20;

      autoTable(doc, {
        startY: y,
        head: [
          [
            "Dept",
            "Join-Date",
            "Relieved Date",
            "Bank Name",
            "IFSC Code",
            "AC_NUM",
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
        styles: {
          fontSize: 10,
          cellPadding: 6,
          halign: "center",
          valign: "middle",
          lineColor: [0, 0, 0],
          lineWidth: 0.4,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 0,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: pageWidth * 0.13 },
          1: { cellWidth: pageWidth * 0.14 },
          2: { cellWidth: pageWidth * 0.14 },
          3: { cellWidth: pageWidth * 0.14 },
          4: { cellWidth: pageWidth * 0.15 },
          5: { cellWidth: pageWidth * 0.15 },
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
          if (
            [
              "PF",
              "PT",
              "ESI",
              "TDS",
              "INSURANCE",
              "OTHER_DEDUCTIONS",
            ].includes(upperKey)
          ) {
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
        styles: {
          fontSize: 11,
          cellPadding: 6,
          valign: "middle",
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: 0,
          fontStyle: "bold",
        },
        columnStyles: { 1: { halign: "right" }, 3: { halign: "right" } },
        didParseCell: (data) => {
          if (data.row.index % 2 === 0 && data.row.section === "body") {
            data.cell.styles.fillColor = [245, 245, 245];
          }
        },
      });

      y = doc.lastAutoTable.finalY + 10;

      autoTable(doc, {
        startY: y,
        body: [
          ["Gross Salary", formatAmount(report.grossSalary)],
          ["Total Deductions", formatAmount(report.totalDeductions)],
          ["Net Pay", formatAmount(report.netSalary)],
        ],
        theme: "grid",
        styles: {
          fontSize: 11,
          cellPadding: 6,
          valign: "middle",
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        columnStyles: {
          0: { fontStyle: "bold", halign: "left" },
          1: { halign: "right", fontStyle: "bold" },
        },
      });

      y = doc.lastAutoTable.finalY + 10;

      const toWords = (num) => {
        if (!num) return "Zero";
        const a = [
          "",
          "One",
          "Two",
          "Three",
          "Four",
          "Five",
          "Six",
          "Seven",
          "Eight",
          "Nine",
          "Ten",
          "Eleven",
          "Twelve",
          "Thirteen",
          "Fourteen",
          "Fifteen",
          "Sixteen",
          "Seventeen",
          "Eighteen",
          "Nineteen",
        ];
        const b = [
          "",
          "",
          "Twenty",
          "Thirty",
          "Forty",
          "Fifty",
          "Sixty",
          "Seventy",
          "Eighty",
          "Ninety",
        ];
        function inWords(n) {
          if (n < 20) return a[n];
          if (n < 100)
            return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
          if (n < 1000)
            return (
              a[Math.floor(n / 100)] +
              " Hundred" +
              (n % 100 ? " " + inWords(n % 100) : "")
            );
          if (n < 100000)
            return (
              inWords(Math.floor(n / 1000)) +
              " Thousand" +
              (n % 1000 ? " " + inWords(n % 1000) : "")
            );
          if (n < 10000000)
            return (
              inWords(Math.floor(n / 100000)) +
              " Lakh" +
              (n % 100000 ? " " + inWords(n % 100000) : "")
            );
          return (
            inWords(Math.floor(n / 10000000)) +
            " Crore" +
            (n % 10000000 ? " " + inWords(n % 10000000) : "")
          );
        }
        return (inWords(num) + " Rupees Only /-").trim();
      };

      autoTable(doc, {
        startY: y,
        body: [[`Amount in Words: ${toWords(report.netSalary) ?? "-"}`]],
        theme: "grid",
        styles: {
          fontSize: 11,
          cellPadding: 6,
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        columnStyles: { 0: { cellWidth: pageWidth - 2 * marginX } },
      });

      const footerY = doc.lastAutoTable.finalY + 20;
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

  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return reports;
    return reports.filter((r) => {
      return (
        String(r.staffName || "")
          .toLowerCase()
          .includes(q) ||
        String(r.salaryMonth || "")
          .toLowerCase()
          .includes(q) ||
        String(r.netSalary || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [reports, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="p-6 grid gap-6">
      <div
        className={`p-6 rounded-xl shadow-xl ${
          isDarkMode ? "bg-slate-900 border border-slate-700" : "bg-slate-100"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode
              ? "bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-slate-300"
              : "text-blue-400"
          }`}
        >
          My Salary Reports
        </h2>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setMode("latest")}
            className={`px-3 py-2 rounded ${
              mode === "latest"
                ? isDarkMode
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-blue-400 text-white hover:bg-blue-500"
                : isDarkMode
                ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                : "bg-blue-100 text-blue-400 hover:bg-blue-200"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setMode("month")}
            className={`px-3 py-2 rounded ${
              mode === "month"
                ? isDarkMode
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-blue-400 text-white hover:bg-blue-500"
                : isDarkMode
                ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                : "bg-blue-100 text-blue-400 hover:bg-blue-200"
            }`}
          >
            Specific Month
          </button>
          <button
            onClick={() => setMode("all")}
            className={`px-3 py-2 rounded ${
              mode === "all"
                ? isDarkMode
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-blue-400 text-white hover:bg-blue-500"
                : isDarkMode
                ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                : "bg-blue-100 text-blue-400 hover:bg-blue-200"
            }`}
          >
            All
          </button>

          {mode === "month" && (
            <input
              type="text"
              placeholder="YYYY-MM"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={`px-3 py-2 rounded focus:outline-none focus:border-teal-500 border ${
                isDarkMode
                  ? "border-slate-600 bg-slate-900 text-slate-200 placeholder-slate-400"
                  : "border-blue-400 bg-white text-blue-400 placeholder-blue-200"
              }`}
            />
          )}

          <button
            className={`px-4 py-2 rounded shadow-md ${
              isDarkMode
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-blue-400 text-white hover:bg-blue-500"
            }`}
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>
      </div>

      <div
        className={`p-6 rounded-xl shadow-xl ${
          isDarkMode ? "bg-slate-900 border border-slate-700" : "bg-slate-100"
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name, month, or salary..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full md:w-4/5 px-3 py-2 rounded-lg focus:outline-none focus:border-teal-500 border ${
              isDarkMode
                ? " border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400"
                : "border-gray-300 bg-white text-blue-400 placeholder-blue-200"
            }`}
          />
          <div
            className={`${
              isDarkMode ? "text-slate-400" : "text-blue-400"
            } text-sm`}
          >
            Showing {Math.min(filtered.length, currentPage * rowsPerPage) || 0}{" "}
            of {filtered.length} results
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            className={`w-full table-auto text-center transition ${
              isDarkMode ? "text-slate-200" : "text-gray-800"
            }`}
          >
            <thead>
              <tr className={isDarkMode ? "bg-slate-900" : "bg-white"}>
                {["Month", "Gross", "Deductions", "Net", "Action"].map((h) => (
                  <th
                    key={h}
                    className={`p-3 uppercase tracking-wider transition ${
                      isDarkMode
                        ? "text-teal-400 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {h}
                  </th>
                ))}
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
                    <td className="p-3">{r.salaryMonth}</td>
                    <td className="p-3">{formatAmount(r.grossSalary)}</td>
                    <td className="p-3">{formatAmount(r.totalDeductions)}</td>
                    <td
                      className={`p-3 font-semibold ${
                        isDarkMode ? "" : "text-blue-600"
                      }`}
                    >
                      {formatAmount(r.netSalary)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => downloadPayslip(r)}
                        className={`px-3 py-1 rounded ${
                          isDarkMode
                            ? "bg-teal-600 text-white hover:bg-teal-700"
                            : "bg-blue-400 text-white hover:bg-blue-500"
                        }`}
                        title="Download Payslip PDF"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className={`p-3 italic ${
                      isDarkMode ? "text-slate-400" : "text-gray-500"
                    }`}
                    colSpan={5}
                  >
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div
            className={`${
              isDarkMode ? "text-slate-400" : "text-blue-400"
            } text-sm`}
          >
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className={`px-3 py-1 rounded ${
                isDarkMode
                  ? "bg-slate-700 text-slate-200"
                  : "bg-blue-100 text-blue-400"
              } disabled:opacity-50`}
            >
              Prev
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={`px-3 py-1 rounded ${
                isDarkMode
                  ? "bg-slate-700 text-slate-200"
                  : "bg-blue-100 text-blue-400"
              } disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
