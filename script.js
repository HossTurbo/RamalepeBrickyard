let documentMode = "invoice";

// Invoice number starting at 70
let invoiceCounter = localStorage.getItem("invoiceCounter");
if (!invoiceCounter) {
    invoiceCounter = 70;
} else {
    invoiceCounter = parseInt(invoiceCounter);
}

// Set Invoice / Quotation Mode
function setMode(mode) {
    documentMode = mode;
    document.getElementById("documentType").innerText =
        mode === "invoice" ? "Invoice" : "Quotation";
}

// Generate PDF
async function generatePDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const today = new Date().toLocaleDateString();

    // Generate Document Number
    let docNumber = "";
    if (documentMode === "invoice") {
        docNumber = "RB-INV-" + String(invoiceCounter).padStart(3, '0');
        invoiceCounter++;
        localStorage.setItem("invoiceCounter", invoiceCounter);
    } else {
        docNumber = "RB-QUO-" + String(invoiceCounter).padStart(3, '0');
        invoiceCounter++;
        localStorage.setItem("invoiceCounter", invoiceCounter);
    }

    let y = 20;

    // Add Logo (JPEG)
    try {
        const logo = await loadImage("logo.jpg");
        doc.addImage(logo, "JPEG", 80, 5, 50, 25);
    } catch (e) {
        console.log("Logo not found.");
    }

    // Company Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("RAMALEPE BRICKYARD", 105, 40, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    // Address + Phone (ONLY IN PDF)
    doc.text("1594 Lephepane, Tzaneen, 0850", 105, 47, { align: "center" });
    doc.text("Phone: 072 550 0640", 105, 53, { align: "center" });

    // Document Info
    doc.text(`${documentMode === "invoice" ? "Invoice" : "Quotation"} No: ${docNumber}`, 14, 65);
    doc.text(`Date: ${today}`, 14, 72);

    // Client
    const clientName = document.getElementById("clientName").value || "N/A";
    doc.text(`Client: ${clientName}`, 14, 82);

    y = 95;

    doc.setFont("helvetica", "bold");
    doc.text("Item", 14, y);
    doc.text("Qty", 120, y);
    doc.text("Amount", 160, y);
    doc.setFont("helvetica", "normal");

    y += 8;

    let total = 0;

    function addItem(name, qty, price) {
        if (qty && qty > 0) {
            const amount = qty * price;
            total += amount;

            doc.text(name, 14, y);
            doc.text(String(qty), 120, y);
            doc.text("R" + amount.toFixed(2), 160, y);
            y += 8;
        }
    }

    const deliveryType = document.getElementById("deliveryType").value;
    const extra = deliveryType === "distant" ? 100 : 0;

    // Bricks
    addItem("RDP Bricks", getValue("rdp"), 3.50);
    addItem("Paving Bricks", getValue("paving"), 1.90);
    addItem("ForeHalves Bricks", getValue("forehalves"), 1.80);
    addItem("Blocks", getValue("blocks"), 5.50);

    // Sand & Stones
    addItem("River Sand - Full Load", getValue("riverFull"), 900 + extra);
    addItem("River Sand - Half Load", getValue("riverHalf"), 500 + extra);
    addItem("Concrete Sand - Full Load", getValue("concreteFull"), 900 + extra);
    addItem("Concrete Sand - Half Load", getValue("concreteHalf"), 500 + extra);
    addItem("Bou Sand - Full Load", getValue("bouFull"), 700 + extra);
    addItem("Bou Sand - Half Load", getValue("bouHalf"), 500 + extra);
    addItem("River Stones - Full Load", getValue("stonesFull"), 900 + extra);
    addItem("River Stones - Half Load", getValue("stonesHalf"), 500 + extra);

    y += 10;

    // TOTAL (BOLD)
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL: R" + total.toFixed(2), 14, y);

    // Banking Details Near Footer
    y = 240;

    doc.setFont("helvetica", "bold");
    doc.text("Banking Details", 14, y);
    doc.setFont("helvetica", "normal");

    y += 8;
    doc.text("Bank: Capitec Bank", 14, y);
    y += 7;
    doc.text("Account Name: Mr MC Ramalepe", 14, y);
    y += 7;
    doc.text("Account No: 1242187837", 14, y);

    // Signature locked to footer (PNG)
    try {
        const signature = await loadImage("signature.png");
        doc.addImage(signature, "PNG", 140, 250, 50, 20);
    } catch (e) {
        console.log("Signature not found.");
    }

    // Save
    doc.save(`${docNumber}.pdf`);
}

// Helper to get values safely
function getValue(id) {
    const val = document.getElementById(id).value;
    return val === "" ? 0 : parseInt(val);
}

// Image Loader
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
