// script.js – PDF generation and document logic

// ---- set active button style and global mode ----
window.setMode = function(type) {
    const docTypeSpan = document.getElementById('documentType');
    const invBtn = document.getElementById('modeInvoice');
    const quoBtn = document.getElementById('modeQuotation');
    docTypeSpan.innerText = type === 'invoice' ? 'Invoice' : 'Quotation';
    if (type === 'invoice') {
        invBtn.classList.add('active');
        quoBtn.classList.remove('active');
    } else {
        quoBtn.classList.add('active');
        invBtn.classList.remove('active');
    }
};

// ---- getNextNumber (localStorage, starts at 70) ----
window.getNextNumber = function(type) {
    let key = type === 'invoice' ? 'invoiceNumber' : 'quotationNumber';
    let current = localStorage.getItem(key);
    if (!current) {
        current = 70;
    } else {
        current = parseInt(current) + 1;
    }
    localStorage.setItem(key, current);
    return current;
};

// ---- base64 placeholder for LOGO (JPEG) and SIGNATURE (PNG) ----
// Replace these strings with your actual base64 encoded images.
// How to get base64: https://www.base64-image.de/ or use FileReader.
const LOGO_BASE64 = '';  // <-- PASTE YOUR JPEG BASE64 HERE (starts with 'data:image/jpeg;base64,')
const SIGNATURE_BASE64 = ''; // <-- PASTE YOUR PNG BASE64 HERE (starts with 'data:image/png;base64,')

// ---- main PDF generator ----
window.generatePDF = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // get mode and document number
    let type = document.getElementById('documentType').innerText.toLowerCase();
    let docNumber = getNextNumber(type);
    const prefix = type === 'invoice' ? 'RB-INV-' : 'RB-QUO-';
    const formattedDocNumber = prefix + String(docNumber).padStart(3, '0');

    // client & delivery
    let clientName = document.getElementById('clientName').value.trim();
    if (clientName === '') clientName = 'Walk-in Customer';
    let deliveryType = document.getElementById('deliveryType').value;
    let extra = deliveryType === 'distant' ? 100 : 0;

    // quantities
    const rdp = Number(document.getElementById('rdp').value) || 0;
    const paving = Number(document.getElementById('paving').value) || 0;
    const forehalves = Number(document.getElementById('forehalves').value) || 0;
    const blocks = Number(document.getElementById('blocks').value) || 0;
    const riverFull = Number(document.getElementById('riverFull').value) || 0;
    const riverHalf = Number(document.getElementById('riverHalf').value) || 0;
    const concreteFull = Number(document.getElementById('concreteFull').value) || 0;
    const concreteHalf = Number(document.getElementById('concreteHalf').value) || 0;
    const bouFull = Number(document.getElementById('bouFull').value) || 0;
    const bouHalf = Number(document.getElementById('bouHalf').value) || 0;
    const stonesFull = Number(document.getElementById('stonesFull').value) || 0;
    const stonesHalf = Number(document.getElementById('stonesHalf').value) || 0;

    // fixed prices
    const prices = {
        rdp: 3.5, paving: 1.9, forehalves: 1.8, blocks: 5.5,
        riverFull: 900 + extra, riverHalf: 500 + extra,
        concreteFull: 900 + extra, concreteHalf: 500 + extra,
        bouFull: 700 + extra, bouHalf: 500 + extra,
        stonesFull: 900 + extra, stonesHalf: 500 + extra
    };

    // start PDF
    let y = 30;

    // optional logo
    if (LOGO_BASE64) {
        try {
            doc.addImage(LOGO_BASE64, 'JPEG', 20, 10, 30, 15);
            y = 30;
        } catch (e) {
            console.warn('Logo failed to load, check base64 string');
        }
    } else {
        y = 20;
    }

    // company header (bold)
    doc.setFont(undefined, 'bold');
    doc.setFontSize(18);
    doc.text('RAMALEPE BRICKYARD', 105, y, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('1594 Lephepane, Tzaneen, 0850', 105, y + 6, { align: 'center' });
    doc.text('Phone: 072 550 0640', 105, y + 12, { align: 'center' });

    // document number and date
    doc.setFont(undefined, 'bold');
    doc.setFontSize(13);
    doc.text(formattedDocNumber, 20, y + 22);
    doc.setFont(undefined, 'normal');
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-ZA', { year:'numeric', month:'short', day:'numeric' });
    doc.text(`Date: ${dateStr}`, 160, y + 22, { align: 'right' });

    doc.text(`Client: ${clientName}`, 20, y + 30);

    // items
    let currentY = y + 40;
    let total = 0;

    function addItem(name, qty, price) {
        if (qty > 0) {
            let amount = qty * price;
            total += amount;
            doc.text(name + ' (' + qty + ')', 20, currentY);
            doc.text('R ' + amount.toFixed(2), 160, currentY, { align: 'right' });
            currentY += 8;
        }
    }

    addItem('RDP Bricks', rdp, prices.rdp);
    addItem('Paving Bricks', paving, prices.paving);
    addItem('ForeHalves Bricks', forehalves, prices.forehalves);
    addItem('Blocks', blocks, prices.blocks);
    addItem('River Sand – Full Load', riverFull, prices.riverFull);
    addItem('River Sand – Half Load', riverHalf, prices.riverHalf);
    addItem('Concrete Sand – Full Load', concreteFull, prices.concreteFull);
    addItem('Concrete Sand – Half Load', concreteHalf, prices.concreteHalf);
    addItem('Bou Sand – Full Load', bouFull, prices.bouFull);
    addItem('Bou Sand – Half Load', bouHalf, prices.bouHalf);
    addItem('River Stones – Full Load', stonesFull, prices.stonesFull);
    addItem('River Stones – Half Load', stonesHalf, prices.stonesHalf);

    currentY += 6;
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL: R ' + total.toFixed(2), 20, currentY);
    doc.setFont(undefined, 'normal');

    // banking details
    const footerY = 260;
    const bankingStartY = footerY - 45;

    doc.setFont(undefined, 'bold');
    doc.text('Banking Details', 20, bankingStartY);
    doc.setFont(undefined, 'normal');
    doc.text('Bank: Capitec Bank', 20, bankingStartY + 7);
    doc.text('Account Name: Mr MC Ramalepe', 20, bankingStartY + 14);
    doc.text('Account No: 1242187837', 20, bankingStartY + 21);
    doc.text('Phone: 072 550 0640', 20, bankingStartY + 28);

    doc.line(20, footerY, 190, footerY);

    // signature
    if (SIGNATURE_BASE64) {
        try {
            doc.addImage(SIGNATURE_BASE64, 'PNG', 140, footerY + 5, 40, 20);
        } catch (e) {
            console.warn('Signature image failed, please check base64');
            doc.setFontSize(10);
            doc.text('(signature)', 150, footerY + 15);
        }
    } else {
        doc.setFontSize(10);
        doc.text('(signature on file)', 145, footerY + 15);
    }

    doc.save(type + '_' + formattedDocNumber + '.pdf');
};

// set default mode on page load
window.setMode('invoice');
