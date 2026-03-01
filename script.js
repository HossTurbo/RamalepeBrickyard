let mode = "invoice";

function setMode(selectedMode) {
    mode = selectedMode;
    document.getElementById("documentType").innerText =
        mode === "invoice" ? "Invoice" : "Quotation";
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let client = document.getElementById("clientName").value || "N/A";
    let qtyA = parseInt(document.getElementById("productA").value) || 0;
    let qtyB = parseInt(document.getElementById("productB").value) || 0;

    let priceA = 500;
    let priceB = 750;

    let today = new Date().toLocaleDateString("en-ZA");
    let docNumber = Math.floor(100000 + Math.random() * 900000);
    let title = mode === "invoice" ? "INVOICE" : "QUOTATION";

    let y = 20;

    // ===== LOGO (Brick Sketch Style) =====
    doc.setFontSize(10);
    doc.text("████ ████ ████", 20, y);
    doc.text(" ████ ████ ████", 20, y + 5);
    doc.text("████ ████ ████", 20, y + 10);

    doc.setFontSize(18);
    doc.text("RAMALEPE BRICKYARD", 60, y + 8);

    doc.setFontSize(11);
    doc.text("Quality Clay Bricks Supplier", 60, y + 14);
    doc.text("Phone: 012 345 6789", 60, y + 19);
    doc.text("Email: info@ramalepebrickyard.co.za", 60, y + 24);

    y += 35;

    // ===== Document Info =====
    doc.setFontSize(16);
    doc.text(title, 150, 20);

    doc.setFontSize(11);
    doc.text("Document No: " + docNumber, 140, 30);
    doc.text("Date: " + today, 140, 36);

    // ===== Client Section =====
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Bill To:", 20, y);
    y += 6;
    doc.text(client, 20, y);

    y += 10;
    doc.line(20, y, 190, y);
    y += 10;

    // ===== Table Header =====
    doc.text("Item", 20, y);
    doc.text("Qty", 120, y);
    doc.text("Unit Price", 140, y);
    doc.text("Total", 170, y);

    y += 5;
    doc.line(20, y, 190, y);
    y += 10;

    let grandTotal = 0;

    // ===== Product A =====
    if (qtyA > 0) {
        let totalA = qtyA * priceA;
        grandTotal += totalA;

        doc.text("Product A", 20, y);
        doc.text(qtyA.toString(), 120, y);
        doc.text("R" + priceA.toFixed(2), 140, y);
        doc.text("R" + totalA.toFixed(2), 170, y);

        y += 10;
    }

    // ===== Product B =====
    if (qtyB > 0) {
        let totalB = qtyB * priceB;
        grandTotal += totalB;

        doc.text("Product B", 20, y);
        doc.text(qtyB.toString(), 120, y);
        doc.text("R" + priceB.toFixed(2), 140, y);
        doc.text("R" + totalB.toFixed(2), 170, y);

        y += 10;
    }

    // ===== Total Section =====
    doc.line(100, y, 190, y);
    y += 10;

    doc.setFontSize(14);
    doc.text("TOTAL: R" + grandTotal.toFixed(2), 130, y);

    y += 20;

    // ===== Footer =====
    doc.setFontSize(10);
    doc.line(20, y, 80, y);
    doc.text("Authorized Signature", 20, y + 5);

    doc.save(title + "_" + docNumber + ".pdf");
}
