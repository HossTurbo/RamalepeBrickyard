let documentMode = "invoice";

// Invoice counter starting at 70
let invoiceCounter = localStorage.getItem("invoiceCounter");
if (!invoiceCounter) {
    invoiceCounter = 70;
} else {
    invoiceCounter = parseInt(invoiceCounter);
}

function setMode(mode) {
    documentMode = mode;
    document.getElementById("documentType").innerText =
        mode === "invoice" ? "Invoice" : "Quotation";
}

async function generatePDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const today = new Date().toLocaleDateString();

    // Generate document number
    const docNumber = documentMode === "invoice"
        ? "RB-INV-" + String(invoiceCounter).padStart(3, "0")
        : "RB-QUO-" + String(invoiceCounter).padStart(3, "0");

    invoiceCounter++;
    localStorage.setItem("invoiceCounter", invoiceCounter);

    // ===== LOAD IMAGES PROPERLY =====
    const logoBase64 = await imageToBase64("logo.jpg");
    const signatureBase64 = await imageToBase64("signature.png");

    // ===== HEADER =====
    if (logoBase64) {
        doc.addImage(logoBase64, "JPEG", 80, 5, 50, 25);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("RAMALEPE BRICKYARD", 105, 40, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text("1594 Lephepane, Tzaneen, 0850", 105, 47, { align: "center" });
    doc.text("Phone: 072 550 0640", 105, 53, { align: "center" });

    doc.text(`${documentMode === "invoice" ? "Invoice" : "Quotation"} No: ${docNumber}`, 14, 65);
    doc.text(`Date: ${today}`, 14, 72);

    const clientName = document.getElementById("clientName").value || "N/A";
    doc.text(`Client: ${clientName}`, 14, 82);

    // ===== ITEMS =====
    let y = 95;
    let total = 0;

    doc.setFont("helvetica", "bold");
    doc.text("Item", 14, y);
    doc.text("Qty", 120, y);
    doc.text("Amount", 160, y);
    doc.setFont("helvetica", "normal");

    y += 8;

    function addItem(name, qty, price) {
        if (qty > 0) {
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

    // ===== TOTAL =====
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL: R" + total.toFixed(2), 14, y);

    // ===== BANKING DETAILS =====
    let footerY = 235;

    doc.setFont("helvetica", "bold");
    doc.text("Banking Details", 14, footerY);
    doc.setFont("helvetica", "normal");

    footerY += 8;
    doc.text("Bank: Capitec Bank", 14, footerY);
    footerY += 7;
    doc.text("Account Name: Mr MC Ramalepe", 14, footerY);
    footerY += 7;
    doc.text("Account No: 1242187837", 14, footerY);

    // ===== SIGNATURE LOCKED =====
    if (signatureBase64) {
        doc.addImage(signatureBase64, "PNG", 140, 250, 50, 20);
    }

    // ===== SAVE + SHARE =====
    const pdfBlob = doc.output("blob");
    const file = new File([pdfBlob], `${docNumber}.pdf`, { type: "application/pdf" });

    if (navigator.share) {
        try {
            await navigator.share({
                title: docNumber,
                files: [file]
            });
        } catch (err) {
            doc.save(`${docNumber}.pdf`);
        }
    } else {
        doc.save(`${docNumber}.pdf`);
    }
}

// Helper functions
function getValue(id) {
    const value = document.getElementById(id).value;
    return value === "" ? 0 : parseInt(value);
}

function imageToBase64(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL());
        };
        img.onerror = () => resolve(null);
    });
}
