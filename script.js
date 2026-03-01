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
    return current;
}

function generatePDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let type = document.getElementById("documentType").innerText.toLowerCase();
    let docNumber = getNextNumber(type);

    let clientName = document.getElementById("clientName").value || "Walk-in Customer";
    let deliveryType = document.getElementById("deliveryType").value;

    // Get quantities safely
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

    // Prices
    let total = 0;
    let y = 40;

    doc.setFont(undefined, "bold");
    doc.text(type.toUpperCase() + " #" + docNumber, 20, 20);
    doc.setFont(undefined, "normal");

    doc.text("Client: " + clientName, 20, 30);

    function addItem(name, qty, price) {
        if (qty > 0) {
            let amount = qty * price;
            total += amount;
            doc.text(name + " (" + qty + ")", 20, y);
            doc.text("R " + amount.toFixed(2), 150, y);
            y += 8;
        }
    }

    // Bricks
    addItem("RDP Bricks", rdp, 3.5);
    addItem("Paving Bricks", paving, 1.9);
    addItem("ForeHalves", forehalves, 1.8);
    addItem("Blocks", blocks, 5.5);

    // Delivery adjustment
    let extra = deliveryType === "distant" ? 100 : 0;

    addItem("River Sand Full", riverFull, 900 + extra);
    addItem("River Sand Half", riverHalf, 500 + extra);
    addItem("Concrete Sand Full", concreteFull, 900 + extra);
    addItem("Concrete Sand Half", concreteHalf, 500 + extra);
    addItem("Bou Sand Full", bouFull, 700 + extra);
    addItem("Bou Sand Half", bouHalf, 500 + extra);
    addItem("River Stones Full", stonesFull, 900 + extra);
    addItem("River Stones Half", stonesHalf, 500 + extra);

    y += 10;

    // Bold TOTAL
    doc.setFont(undefined, "bold");
    doc.text("TOTAL: R " + total.toFixed(2), 20, y);
    doc.setFont(undefined, "normal");

    y += 15;

    doc.text("Payment Terms: 5 Days from Invoice Date", 20, y);
    y += 8;
    doc.text("Bank: Capitec Bank", 20, y);
    y += 8;
    doc.text("Account Name: Mr MC Ramalepe", 20, y);
    y += 8;
    doc.text("Account No: 1242187837", 20, y);
    y += 8;
    doc.text("Phone: 072 550 0640", 20, y);

    doc.save(type + "_" + docNumber + ".pdf");
}
