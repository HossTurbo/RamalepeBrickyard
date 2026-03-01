function setMode(type) {
    document.getElementById("documentType").innerText =
        type === "invoice" ? "Invoice" : "Quotation";
}

function getNextNumber(type) {
    let key = type === "invoice" ? "invoiceNumber" : "quotationNumber";
    let current = localStorage.getItem(key);

    if (!current) {
        current = 70;
    } else {
        current = parseInt(current) + 1;
    }

    localStorage.setItem(key, current);

    let formatted = String(current).padStart(3, '0');

    if (type === "invoice") {
        return "RB-INV-" + formatted;
    } else {
        return "RB-QUO-" + formatted;
    }
}

function generatePDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let type = document.getElementById("documentType").innerText.toLowerCase();
    let docNumber = getNextNumber(type);

    let clientName = document.getElementById("clientName").value || "Walk-in Customer";
    let deliveryType = document.getElementById("deliveryType").value;

    let today = new Date();
    let formattedDate = today.toLocaleDateString("en-ZA");

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

    let total = 0;
    let y = 70;

    // Logo
    doc.addImage("logo.png", "PNG", 20, 10, 30, 30);

    // Company header
    doc.setFont(undefined, "bold");
    doc.setFontSize(16);
    doc.text("RAMALEPE BRICKYARD", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text("1594 Lephepane, Tzaneen, 0850", 105, 22, { align: "center" });
    doc.text("Phone: 072 550 0640", 105, 28, { align: "center" });

    // Document number + date
    doc.setFont(undefined, "bold");
    doc.text(docNumber, 20, 45);
    doc.setFont(undefined, "normal");

    doc.text("Date: " + formattedDate, 150, 45);
    doc.text("Client: " + clientName, 20, 55);

    function addItem(name, qty, price) {
        if (qty > 0) {
            let amount = qty * price;
            total += amount;
            doc.text(name + " (" + qty + ")", 20, y);
            doc.text("R " + amount.toFixed(2), 160, y);
            y += 8;
        }
    }

    addItem("RDP Bricks", rdp, 3.5);
    addItem("Paving Bricks", paving, 1.9);
    addItem("ForeHalves Bricks", forehalves, 1.8);
    addItem("Blocks", blocks, 5.5);

    let extra = deliveryType === "distant" ? 100 : 0;

    addItem("River Sand - Full Load", riverFull, 900 + extra);
    addItem("River Sand - Half Load", riverHalf, 500 + extra);
    addItem("Concrete Sand - Full Load", concreteFull, 900 + extra);
    addItem("Concrete Sand - Half Load", concreteHalf, 500 + extra);
    addItem("Bou Sand - Full Load", bouFull, 700 + extra);
    addItem("Bou Sand - Half Load", bouHalf, 500 + extra);
    addItem("River Stones - Full Load", stonesFull, 900 + extra);
    addItem("River Stones - Half Load", stonesHalf, 500 + extra);

    y += 10;

    doc.setFont(undefined, "bold");
    doc.text("TOTAL: R " + total.toFixed(2), 20, y);
    doc.setFont(undefined, "normal");

    let footerY = 250;

    // Banking details
    let bankingY = footerY - 50;

    doc.setFont(undefined, "bold");
    doc.text("Banking Details", 20, bankingY);
    doc.setFont(undefined, "normal");

    bankingY += 8;
    doc.text("Bank: Capitec Bank", 20, bankingY);
    bankingY += 8;
    doc.text("Account Name: Mr MC Ramalepe", 20, bankingY);
    bankingY += 8;
    doc.text("Account No: 1242187837", 20, bankingY);
    bankingY += 8;
    doc.text("Phone: 072 550 0640", 20, bankingY);

    // Footer line
    doc.line(20, footerY, 190, footerY);

    // Locked signature
    doc.addImage("signature.png", "PNG", 140, footerY + 5, 45, 20);

    doc.save(docNumber + ".pdf");
}
