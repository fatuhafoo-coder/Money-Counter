// Denominations (Notes + Coins)
const denominations = [500, 200, 100, 50, 20, 10, 5, 2, 1];

// Show today's date
document.getElementById("todayDate").innerText =
  new Date().toLocaleDateString();

// Auto calculate amounts
function calculate() {
  const inputs = document.querySelectorAll("input");
  const amounts = document.querySelectorAll(".amount");

  let total = 0;

  inputs.forEach((input, index) => {
    const count = Number(input.value) || 0;
    const amount = count * denominations[index];
    amounts[index].innerText = amount;
    total += amount;
  });

  document.getElementById("total").innerText = total;
}

// Reset all fields
function resetAll() {
  document.querySelectorAll("input").forEach(i => i.value = 0);
  document.querySelectorAll(".amount").forEach(a => a.innerText = 0);
  document.getElementById("total").innerText = 0;
}

// Export PDF (Balance-sheet style, Rs. used)
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const inputs = document.querySelectorAll("input");
  const amounts = document.querySelectorAll(".amount");
  const date = document.getElementById("todayDate").innerText;
  const total = document.getElementById("total").innerText;

  pdf.setFontSize(16);
  pdf.text("Cash Denomination Report", 14, 15);

  pdf.setFontSize(11);
  pdf.text("Date: " + date, 14, 23);

  const tableData = [];

  denominations.forEach((den, i) => {
    const qty = Number(inputs[i].value);
    if (qty > 0) {
      tableData.push([
        "Rs. " + den,
        qty,
        "Rs. " + amounts[i].innerText
      ]);
    }
  });

  pdf.autoTable({
    startY: 30,
    head: [["Denomination", "Quantity", "Amount"]],
    body: tableData,
    theme: "grid",
    styles: { halign: "center" },
    headStyles: { fillColor: [220, 220, 220] }
  });

  const finalY = pdf.lastAutoTable.finalY;
  pdf.setFontSize(12);
  pdf.text("Total Amount: Rs. " + total, 14, finalY + 10);

  pdf.save("Denomination_" + date + ".pdf");
}

// Export as JPEG (easy sharing)
function exportJPEG() {
  const area = document.getElementById("printArea");

  html2canvas(area).then(canvas => {
    const link = document.createElement("a");
    link.download = "Denomination_" + new Date().toLocaleDateString() + ".jpg";
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();
  });
}
