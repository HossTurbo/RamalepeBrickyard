let mode = "invoice";

function setMode(selectedMode) {
    mode = selectedMode;
    document.getElementById("documentType").innerText =
        mode === "invoice" ? "Invoice" : "Quotation";
}

function getNextDocumentNumber() {
    let lastNumber = localStorage.getItem("lastDocNumber");
    if (!lastNumber) {
        lastNumber = 1000;
    } else {
        lastNumber = parseInt(lastNumber) + 1;
    }
    localStorage.setItem("lastDocNumber", lastNumber);
    return lastNumber;
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
    let docNumber = getNextDocumentNumber();
    let title = mode === "invoice" ? "INVOICE" : "QUOTATION";

    let y = 20;

    // ===== LOGO =====
    const img = new Image();
    img.src = "assets/logo.png";

    img.onload = function () {

        doc.addImage(img, "PNG", 20, 15, 40, 30);

        // ===== COMPANY INFO =====
        doc.setFontSize(18);
        doc.text("RAMALEPE BRICKYARD", 70, 25);

        doc.setFontSize(10);
        doc.text("Quality Clay Brick Suppliers", 70, 32);
        doc.text("123 Industrial Road, Limpopo, South Africa", 70, 37);
        doc.text("Phone: 012 345 6789", 70, 42);
        doc.text("Email: info@ramalepebrickyard.co.za", 70, 47);

        // ===== DOCUMENT INFO =====
        doc.setFontSize(16);
        doc.text(title, 150, 25);

        doc.setFontSize(11);
        doc.text("No: " + docNumber, 150, 33);
        doc.text("Date: " + today, 150, 40);

        y = 60;
        doc.line(20, y, 190, y);
        y += 10;

        // ===== CLIENT =====
        doc.setFontSize(12);
        doc.text("Bill To:", 20, y);
        y += 6;
        doc.text(client, 20, y);

        y += 10;
        doc.line(20, y, 190, y);
        y += 10;

        // ===== TABLE HEADER =====
        doc.text("Item", 20, y);
        doc.text("Qty", 120, y);
        doc.text("Unit", 140, y);
        doc.text("Total", 170, y);

        y += 5;
        doc.line(20, y, 190, y);
        y += 10;

        let grandTotal = 0;

        if (qtyA > 0) {
            let totalA = qtyA * priceA;
            grandTotal += totalA;

            doc.text("Product A", 20, y);
            doc.text(qtyA.toString(), 120, y);
            doc.text("R" + priceA.toFixed(2), 140, y);
            doc.text("R" + totalA.toFixed(2), 170, y);
            y += 10;
        }

        if (qtyB > 0) {
            let totalB = qtyB * priceB;
            grandTotal += totalB;

            doc.text("Product B", 20, y);
            doc.text(qtyB.toString(), 120, y);
            doc.text("R" + priceB.toFixed(2), 140, y);
            doc.text("R" + totalB.toFixed(2), 170, y);
            y += 10;
        }

        doc.line(100, y, 190, y);
        y += 10;

        doc.setFontSize(14);
        doc.text("TOTAL: R" + grandTotal.toFixed(2), 130, y);

        y += 20;

        // ===== PAYMENT / TERMS =====
        doc.setFontSize(10);

        if (mode === "invoice") {
            doc.text("Payment Terms: 30 Days from Invoice Date", 20, y);
            y += 6;
            doc.text("Bank: Standard Bank", 20, y);
            y += 6;
            doc.text("Account Name: Ramalepe Brickyard", 20, y);
            y += 6;
            doc.text("Account No: 123456789", 20, y);
        } else {
            doc.text("Quotation Valid For: 14 Days", 20, y);
        }

        y += 20;

        doc.line(20, y, 80, y);
        doc.text("Authorized Signature", 20, y + 5);

        doc.save(title + "_" + docNumber + ".pdf");
    };
}
