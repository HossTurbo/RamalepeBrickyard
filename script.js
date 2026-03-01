let mode = "invoice";

function setMode(selectedMode) {
    mode = selectedMode;
    document.getElementById("documentType").innerText =
        mode === "invoice" ? "Invoice" : "Quotation";
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let client = document.getElementById("clientName").value;
    let qtyA = parseInt(document.getElementById("productA").value) || 0;
    let qtyB = parseInt(document.getElementById("productB").value) || 0;

    let priceA = 500;
    let priceB = 750;

    let totalA = qtyA * priceA;
    let totalB = qtyB * priceB;

    let subtotal = totalA + totalB;
    let vat = subtotal * 0.15;
    let grandTotal = subtotal + vat;

    let today = new Date().toLocaleDateString("en-ZA");
    let docNumber = Math.floor(Math.random() * 100000);

    let title = mode === "invoice" ? "INVOICE" : "QUOTATION";

    doc.setFontSize(18);
    doc.text(title, 85, 20);

    doc.setFontSize(12);
    doc.text("Document No: " + docNumber, 20, 35);
    doc.text("Date: " + today, 150, 35);

    doc.text("Client: " + client, 20, 45);

    doc.line(20, 50, 190, 50);

    doc.text("Item", 20, 60);
    doc.text("Qty", 100, 60);
    doc.text("Total", 150, 60);

    doc.line(20, 65, 190, 65);

    doc.text("Product A", 20, 75);
    doc.text(qtyA.toString(), 100, 75);
    doc.text("R" + totalA.toFixed(2), 150, 75);

    doc.text("Product B", 20, 85);
    doc.text(qtyB.toString(), 100, 85);
    doc.text("R" + totalB.toFixed(2), 150, 85);

    doc.line(20, 95, 190, 95);

    doc.text("Subtotal: R" + subtotal.toFixed(2), 130, 110);
    doc.text("VAT (15%): R" + vat.toFixed(2), 130, 120);
    doc.text("Total: R" + grandTotal.toFixed(2), 130, 130);

    doc.save(title + "_" + docNumber + ".pdf");
}
