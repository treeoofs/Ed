// ============================================
// PDF Export Engine
// Uses jsPDF + html2canvas for client-side PDF generation
// ============================================

async function downloadPDF(subject) {
  // Show loading indicator
  const loader = document.createElement('div');
  loader.id = 'pdf-loader';
  loader.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);z-index:9999;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.4rem;flex-direction:column;gap:20px;';
  loader.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size:3rem;"></i><div>Generating PDF... Please wait</div><div style="font-size:.9rem;opacity:.8;">This may take 10-30 seconds</div>';
  document.body.appendChild(loader);

  try {
    // Expand all solutions before capture
    document.querySelectorAll('.solution-block').forEach(s => s.classList.add('show'));
    await new Promise(r => setTimeout(r, 500));

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;

    // Cover Page
    pdf.setFillColor(11, 94, 215);
    pdf.rect(0, 0, pageWidth, 80, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ExamAce', pageWidth / 2, 35, { align: 'center' });
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('WAEC & GCE Preparation Portal', pageWidth / 2, 50, { align: 'center' });

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    const subjectTitles = {
      'math': 'Mathematics — 50 WAEC Past Questions',
      'mathematics': 'Mathematics — Complete Question Set',
      'physics': 'Physics — Past Questions',
      'chemistry': 'Chemistry — Past Questions',
      'biology': 'Biology — Past Questions',
      'english': 'English Language — Past Questions',
      'economics': 'Economics — Past Questions',
      'government': 'Government — Past Questions',
      'literature': 'Literature — Past Questions',
      'mock-exam': 'Mock Examination',
      'bundle-2024': 'WAEC 2024 — Complete Bundle',
      'bundle-2023': 'WAEC 2023 — Complete Bundle',
      'bundle-2022': 'WAEC 2022 — Complete Bundle',
      'bundle-2021': 'WAEC 2021 — Complete Bundle',
      'bundle-2020': 'WAEC 2020 — Complete Bundle',
      'bundle-2019': 'WAEC 2019 — Complete Bundle',
      'bundle-2018': 'WAEC 2018 — Complete Bundle',
      'english-essay': 'English Essay & Theory — Model Answers',
      'government-essay': 'Government Theory — Model Answers'
    };
    const title = subjectTitles[subject] || 'WAEC Past Questions';
    pdf.text(title, pageWidth / 2, 130, { align: 'center', maxWidth: 180 });

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Step-by-Step Solutions Included', pageWidth / 2, 150, { align: 'center' });
    pdf.text('Generated: ' + new Date().toLocaleDateString(), pageWidth / 2, 160, { align: 'center' });

    pdf.setDrawColor(11, 94, 215);
    pdf.setLineWidth(0.5);
    pdf.line(50, 175, pageWidth - 50, 175);

    pdf.setFontSize(10);
    pdf.setTextColor(50, 50, 50);
    pdf.text('© 2026 ExamAce Education', pageWidth / 2, 280, { align: 'center' });
    pdf.text('Visit: examace.edu', pageWidth / 2, 286, { align: 'center' });

    pdf.addPage();

    // Extract all questions from the page
    const cards = document.querySelectorAll('.pq-card, .essay-card, .mock-question');
    let yPos = 20;
    let qNum = 1;

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(11, 94, 215);
    pdf.text('Questions & Solutions', margin, yPos);
    yPos += 12;

    pdf.setDrawColor(11, 94, 215);
    pdf.line(margin, yPos - 6, pageWidth - margin, yPos - 6);

    cards.forEach((card, idx) => {
      // Get question text
      const qHeader = card.querySelector('h3');
      if (!qHeader) return;
      const qText = qHeader.textContent.trim();

      // Get tags
      const tags = Array.from(card.querySelectorAll('.tag, .meta span')).map(t => t.textContent.trim()).join(' • ');

      // Get options
      const opts = Array.from(card.querySelectorAll('.pq-options li, .options li')).map(o => {
        const correct = o.classList.contains('correct') ? ' ✓' : '';
        return o.textContent.trim() + correct;
      });

      // Get solution steps
      const solSteps = Array.from(card.querySelectorAll('.solution-block ol li, .solution-block ul li')).map(s => s.textContent.trim());
      const ans = card.querySelector('.solution-block .ans');
      const ansText = ans ? ans.textContent.trim() : '';

      // Estimate space needed
      const spaceNeeded = 10 + (opts.length * 6) + (solSteps.length * 6) + 30;
      if (yPos + spaceNeeded > pageHeight - margin) {
        pdf.addPage();
        yPos = 20;
      }

      // Tags
      if (tags) {
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(120, 120, 120);
        pdf.text(tags, margin, yPos);
        yPos += 5;
      }

      // Question
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      const qLines = pdf.splitTextToSize(qText, pageWidth - 2 * margin);
      pdf.text(qLines, margin, yPos);
      yPos += qLines.length * 5 + 2;

      // Options
      if (opts.length) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        opts.forEach(o => {
          const lines = pdf.splitTextToSize(o, pageWidth - 2 * margin - 5);
          if (yPos + lines.length * 5 > pageHeight - margin) { pdf.addPage(); yPos = 20; }
          if (o.includes('✓')) {
            pdf.setTextColor(22, 163, 74);
            pdf.setFont('helvetica', 'bold');
          } else {
            pdf.setTextColor(60, 60, 60);
            pdf.setFont('helvetica', 'normal');
          }
          pdf.text(lines, margin + 5, yPos);
          yPos += lines.length * 5 + 1;
        });
        yPos += 2;
      }

      // Solution
      if (solSteps.length) {
        if (yPos + 10 > pageHeight - margin) { pdf.addPage(); yPos = 20; }
        pdf.setFillColor(240, 249, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(11, 94, 215);
        pdf.text('Step-by-Step Solution:', margin, yPos);
        yPos += 5;

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(40, 40, 40);
        solSteps.forEach((step, i) => {
          const stepText = `${i + 1}. ${step}`;
          const lines = pdf.splitTextToSize(stepText, pageWidth - 2 * margin - 8);
          if (yPos + lines.length * 5 > pageHeight - margin) { pdf.addPage(); yPos = 20; }
          pdf.text(lines, margin + 4, yPos);
          yPos += lines.length * 5 + 1;
        });

        if (ansText) {
          if (yPos + 10 > pageHeight - margin) { pdf.addPage(); yPos = 20; }
          pdf.setFillColor(220, 252, 231);
          pdf.rect(margin, yPos, 180, 7, 'F');
          pdf.setTextColor(22, 101, 52);
          pdf.setFont('helvetica', 'bold');
          pdf.text(ansText, margin + 2, yPos + 5);
          yPos += 9;
        }
      }

      // Separator
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.2);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 6;
      qNum++;
    });

    // Footer on every page
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`ExamAce — ${title}`, margin, pageHeight - 5);
      pdf.text(`Page ${i} / ${pageCount}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
    }

    pdf.save(`ExamAce-${subject}-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (e) {
    console.error(e);
    alert('PDF generation error: ' + e.message);
  } finally {
    document.body.removeChild(loader);
  }
}

// Quick PDF button injector
function addPDFButton(subject, label = 'Download as PDF') {
  const btn = document.createElement('button');
  btn.className = 'pdf-quick-btn';
  btn.innerHTML = `<i class="fas fa-file-pdf"></i> ${label}`;
  btn.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#16a34a;color:#fff;border:none;padding:14px 22px;border-radius:50px;cursor:pointer;font-weight:600;box-shadow:0 6px 20px rgba(22,163,74,.4);z-index:50;';
  btn.onclick = () => downloadPDF(subject);
  document.body.appendChild(btn);
}
