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
    let deliveryType = document.getElementById("deliveryType").value;
    let deliveryExtra = deliveryType === "distant" ? 100 : 0;

    let today = new Date().toLocaleDateString("en-ZA");
    let docNumber = getNextDocumentNumber();
    let title = mode === "invoice" ? "INVOICE" : "QUOTATION";

    // ===== BRICK UNIT PRICES =====
    let brickPrices = {
        rdp: 3.5,
        paving: 1.9,
        forehalves: 1.8,
        blocks: 5.5
    };

    // ===== SAND PRICES =====
    let sandPrices = {
        riverFull: 900,
        riverHalf: 500,
        concreteFull: 900,
        concreteHalf: 500,
        bouFull: 700,
        bouHalf: 500,
        stonesFull: 900,
        stonesHalf: 500
    };

    const logoImg = new Image();
    const signatureImg = new Image();

    logoImg.src = "assets/logo.jpeg";
    signatureImg.src = "assets/signature.png";

    logoImg.onload = function () {
        signatureImg.onload = function () {

            let y = 20;

            // ===== LOGO =====
            doc.addImage(logoImg, "JPEG", 20, 15, 40, 30);

            // ===== COMPANY INFO =====
            doc.setFontSize(18);
            doc.text("RAMALEPE BRICKYARD", 70, 25);

            doc.setFontSize(10);
            doc.text("Quality Brick Suppliers", 70, 32);
            doc.text("1594 Lephepane, Tzaneen, 0850", 70, 37);
            doc.text("Phone: 072 550 0640", 70, 42);

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
            doc.text("Qty", 110, y);
            doc.text("Unit Price", 140, y);
            doc.text("Total", 170, y);

            y += 5;
            doc.line(20, y, 190, y);
            y += 10;

            let grandTotal = 0;

            // ===== BRICKS =====
            for (let key in brickPrices) {

                let qty = parseInt(document.getElementById(key).value) || 0;

                if (qty > 0) {

                    let unit = brickPrices[key];
                    let total = qty * unit;
                    grandTotal += total;

                    doc.text(key.toUpperCase() + " Bricks", 20, y);
                    doc.text(qty.toString(), 110, y);
                    doc.text("R" + unit.toFixed(2), 140, y);
                    doc.text("R" + total.toFixed(2), 170, y);

                    y += 10;
                }
            }

            // ===== SAND / STONES =====
            for (let key in sandPrices) {

                let qty = parseInt(document.getElementById(key).value) || 0;

                if (qty > 0) {

                    let basePrice = sandPrices[key];
                    let finalPrice = basePrice + deliveryExtra;
                    let total = qty * finalPrice;
                    grandTotal += total;

                    doc.text(key, 20, y);
                    doc.text(qty.toString(), 110, y);
                    doc.text("R" + finalPrice.toFixed(2), 140, y);
                    doc.text("R" + total.toFixed(2), 170, y);

                    y += 10;
                }
            }

            doc.line(100, y, 190, y);
            y += 10;

            doc.setFontSize(14);
            doc.text("TOTAL: R" + grandTotal.toFixed(2), 130, y);

            // ===== PAYMENT DETAILS =====
            y += 20;

            if (mode === "invoice") {

                doc.setFontSize(10);
                doc.text("Payment Terms: 5 Days from Invoice Date", 20, y);
                y += 6;
                doc.text("Bank: Capitec Bank", 20, y);
                y += 6;
                doc.text("Account Name: Mr MC Ramalepe", 20, y);
                y += 6;
                doc.text("Account No: 1242187837", 20, y);
                y += 6;
                doc.text("Phone: 072 550 0640", 20, y);
            } else {
                doc.setFontSize(10);
                doc.text("Quotation Valid For: 5 Days", 20, y);
            }

            // ===== FOOTER SIGNATURE =====
            let pageHeight = doc.internal.pageSize.height;

            doc.line(20, pageHeight - 45, 190, pageHeight - 45);

            doc.addImage(signatureImg, "PNG", 20, pageHeight - 40, 40, 25);

            doc.setFontSize(9);
            doc.text("Authorized Digital Signature", 20, pageHeight - 12);
            doc.text("Phone: 072 550 0640", 140, pageHeight - 12);

            // ===== SAVE & SHARE =====
            const pdfBlob = doc.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const a = document.createElement("a");
            a.href = pdfUrl;
            a.download = title + "_" + docNumber + ".pdf";
            a.click();

            if (navigator.share) {
                const file = new File([pdfBlob], title + "_" + docNumber + ".pdf", {
                    type: "application/pdf",
                });

                navigator.share({
                    title: title,
                    text: "Document from Ramalepe Brickyard",
                    files: [file]
                });
            }
        };
    };
}
