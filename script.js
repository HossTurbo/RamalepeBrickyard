let mode = "invoice";
// script.js – Ramalepe Brickyard PDF generator (fixed alignment + images)

function setMode(selectedMode) {
    mode = selectedMode;
// ----- Set active document type (Invoice / Quotation) -----
window.setMode = function(type) {
    document.getElementById("documentType").innerText =
        mode === "invoice" ? "Invoice" : "Quotation";
}
        type === "invoice" ? "Invoice" : "Quotation";
};

// ----- Get next document number from localStorage (starts at 70) -----
function getNextNumber(type) {
    let key = type === "invoice" ? "invoiceNumber" : "quotationNumber";
    let current = localStorage.getItem(key);

function getNextDocumentNumber() {
    let lastNumber = localStorage.getItem("lastDocNumber");
    if (!lastNumber) {
        lastNumber = 1000;
    if (!current) {
        current = 70;
    } else {
        lastNumber = parseInt(lastNumber) + 1;
        current = parseInt(current) + 1;
    }
    localStorage.setItem("lastDocNumber", lastNumber);
    return lastNumber;
}

function generatePDF() {
    localStorage.setItem(key, current);
    return current;
}

// ===== REPLACE THESE WITH YOUR ACTUAL BASE64 IMAGE DATA =====
// 1. Go to https://www.base64-image.de/
// 2. Upload your JPEG logo – copy the full string (starts with "data:image/jpeg;base64,")
// 3. Upload your PNG signature – copy the full string (starts with "data:image/png;base64,")
// 4. Paste them below between the quotes.
const LOGO_BASE64 = '';      // <-- your JPEG logo base64 here
const SIGNATURE_BASE64 = ''; // <-- your PNG signature base64 here
// ============================================================

// ----- Main PDF generation -----
window.generatePDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let client = document.getElementById("clientName").value || "N/A";
    let deliveryType = document.getElementById("deliveryType").value;
    let deliveryExtra = deliveryType === "distant" ? 100 : 0;

    let today = new Date().toLocaleDateString("en-ZA");
    let docNumber = getNextDocumentNumber();
    let title = mode === "invoice" ? "INVOICE" : "QUOTATION";
    // ---- Determine document type and number ----
    let type = document.getElementById("documentType").innerText.toLowerCase();
    let docNumber = getNextNumber(type);
    let prefix = type === "invoice" ? "RB-INV-" : "RB-QUO-";
    let formattedDocNumber = prefix + String(docNumber).padStart(3, '0');

    // ===== BRICK UNIT PRICES =====
    let brickPrices = {
    // ---- Client and delivery ----
    let clientName = document.getElementById("clientName").value.trim();
    if (clientName === "") clientName = "Walk-in Customer";
    let deliveryType = document.getElementById("deliveryType").value;
    let extra = deliveryType === "distant" ? 100 : 0;

    // ---- Get quantities ----
    let rdp = Number(document.getElementById("rdp").value) || 0;
    let paving = Number(document.getElementById("paving").value) || 0;
    let forehalves = Number(document.getElementById("forehalves").value) || 0;
    let blocks = Number(document.getElementById("blocks").value) || 0;

    let riverFull = Number(document.getElementById("riverFull").value) || 0;
    let riverHalf = Number(document.getElementById("riverHalf").value) || 0;
    let concreteFull = Number(document.getElementById("concreteFull").value) || 0;
    let concreteHalf = Number(document.getElementById("concreteHalf").value) || 0;
    let bouFull = Number(document.getElementById("bouFull").value) || 0;
    let bouHalf = Number(document.getElementById("bouHalf").value) || 0;
    let stonesFull = Number(document.getElementById("stonesFull").value) || 0;
    let stonesHalf = Number(document.getElementById("stonesHalf").value) || 0;

    // ---- Prices (with delivery extra for sand/stone) ----
    const prices = {
        rdp: 3.5,
        paving: 1.9,
        forehalves: 1.8,
        blocks: 5.5
        blocks: 5.5,
        riverFull: 900 + extra,
        riverHalf: 500 + extra,
        concreteFull: 900 + extra,
        concreteHalf: 500 + extra,
        bouFull: 700 + extra,
        bouHalf: 500 + extra,
        stonesFull: 900 + extra,
        stonesHalf: 500 + extra
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
    // ----- PDF LAYOUT (improved alignment) -----

            let y = 20;
    let y = 20; // starting Y position

            // ===== LOGO =====
            doc.addImage(logoImg, "JPEG", 20, 15, 40, 30);
    // ---- Logo (top left) ----
    if (LOGO_BASE64) {
        try {
            doc.addImage(LOGO_BASE64, 'JPEG', 15, 8, 30, 15); // x, y, width, height
            y = 28; // shift text down so it doesn't overlap
        } catch (e) {
            console.warn("Logo failed to load – check base64 string");
            y = 20;
        }
    }

            // ===== COMPANY INFO =====
            doc.setFontSize(18);
            doc.text("RAMALEPE BRICKYARD", 70, 25);
    // ---- Company header (centered) ----
    doc.setFont(undefined, "bold");
    doc.setFontSize(18);
    doc.text("RAMALEPE BRICKYARD", 105, y, { align: "center" });
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text("1594 Lephepane, Tzaneen, 0850", 105, y + 6, { align: "center" });
    doc.text("Phone: 072 550 0640", 105, y + 12, { align: "center" });

    // ---- Document number & date (right‑aligned) ----
    let currentY = y + 22;
    doc.setFont(undefined, "bold");
    doc.setFontSize(13);
    doc.text(formattedDocNumber, 20, currentY);
    doc.setFont(undefined, "normal");
    let today = new Date();
    let dateStr = today.toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });
    doc.text("Date: " + dateStr, 190, currentY, { align: "right" });

    // ---- Client ----
    currentY += 8;
    doc.text("Client: " + clientName, 20, currentY);

    // ---- Items list (dynamic) ----
    currentY += 8;
    let total = 0;

    function addItem(name, qty, price) {
        if (qty > 0) {
            let amount = qty * price;
            total += amount;
            doc.text(name + " (" + qty + ")", 20, currentY);
            doc.text("R " + amount.toFixed(2), 190, currentY, { align: "right" });
            currentY += 7;
        }
    }

    // Bricks
    addItem("RDP Bricks", rdp, prices.rdp);
    addItem("Paving Bricks", paving, prices.paving);
    addItem("ForeHalves Bricks", forehalves, prices.forehalves);
    addItem("Blocks", blocks, prices.blocks);

    // Sand & Stones (exact names as required)
    addItem("River Sand – Full Load", riverFull, prices.riverFull);
    addItem("River Sand – Half Load", riverHalf, prices.riverHalf);
    addItem("Concrete Sand – Full Load", concreteFull, prices.concreteFull);
    addItem("Concrete Sand – Half Load", concreteHalf, prices.concreteHalf);
    addItem("Bou Sand – Full Load", bouFull, prices.bouFull);
    addItem("Bou Sand – Half Load", bouHalf, prices.bouHalf);
    addItem("River Stones – Full Load", stonesFull, prices.stonesFull);
    addItem("River Stones – Half Load", stonesHalf, prices.stonesHalf);

    // ---- Total (bold) ----
    currentY += 8;
    doc.setFont(undefined, "bold");
    doc.text("TOTAL: R " + total.toFixed(2), 20, currentY);
    doc.setFont(undefined, "normal");

    // ---- Banking Details (fixed near bottom) ----
    let footerY = 260;          // line position
    let bankingY = footerY - 45;

    doc.setFont(undefined, "bold");
    doc.text("Banking Details", 20, bankingY);
    doc.setFont(undefined, "normal");
    doc.text("Bank: Capitec Bank", 20, bankingY + 7);
    doc.text("Account Name: Mr MC Ramalepe", 20, bankingY + 14);
    doc.text("Account No: 1242187837", 20, bankingY + 21);
    doc.text("Phone: 072 550 0640", 20, bankingY + 28);

    // ---- Footer line ----
    doc.line(20, footerY, 190, footerY);

    // ---- Signature (bottom right) ----
    if (SIGNATURE_BASE64) {
        try {
            doc.addImage(SIGNATURE_BASE64, 'PNG', 140, footerY + 5, 45, 18);
        } catch (e) {
            console.warn("Signature image failed – check base64 string");
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
            doc.text("(signature)", 150, footerY + 15);
        }
    } else {
        doc.setFontSize(10);
        doc.text("(signature on file)", 145, footerY + 15);
    }

                navigator.share({
                    title: title,
                    text: "Document from Ramalepe Brickyard",
                    files: [file]
                });
            }
        };
    };
}
    // ---- Save the PDF ----
    doc.save(type + "_" + formattedDocNumber + ".pdf");
};
