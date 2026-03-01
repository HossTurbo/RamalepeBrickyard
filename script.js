// script.js – Ramalepe Brickyard PDF generator (fixed alignment + images)

// ----- Set active document type (Invoice / Quotation) -----
window.setMode = function(type) {
    document.getElementById("documentType").innerText =
        type === "invoice" ? "Invoice" : "Quotation";
};

// ----- Get next document number from localStorage (starts at 70) -----
function getNextNumber(type) {
    let key = type === "invoice" ? "invoiceNumber" : "quotationNumber";
    let current = localStorage.getItem(key);

    if (!current) {
        current = 70;
    } else {
        current = parseInt(current) + 1;
    }

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

    // ---- Determine document type and number ----
    let type = document.getElementById("documentType").innerText.toLowerCase();
    let docNumber = getNextNumber(type);
    let prefix = type === "invoice" ? "RB-INV-" : "RB-QUO-";
    let formattedDocNumber = prefix + String(docNumber).padStart(3, '0');

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

    // ----- PDF LAYOUT (improved alignment) -----

    let y = 20; // starting Y position

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
            doc.text("(signature)", 150, footerY + 15);
        }
    } else {
        doc.setFontSize(10);
        doc.text("(signature on file)", 145, footerY + 15);
    }

    // ---- Save the PDF ----
    doc.save(type + "_" + formattedDocNumber + ".pdf");
};
