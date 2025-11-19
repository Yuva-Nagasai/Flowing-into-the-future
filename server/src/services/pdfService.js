// PDF Generation Service
// This service handles certificate PDF generation
// Supports both PDFKit (lightweight) and Puppeteer (full HTML rendering)

const fs = require('fs');
const path = require('path');

// Simple PDF generation using PDFKit (lightweight, no browser needed)
const generateCertificatePDF = async (course, user, certificateId, issuedDate) => {
  try {
    // Try to use PDFKit if available
    let PDFDocument;
    try {
      PDFDocument = require('pdfkit');
    } catch (e) {
      console.log('PDFKit not installed. Install with: npm install pdfkit');
      // Return HTML template instead
      return generateCertificateHTML(course, user, certificateId, issuedDate);
    }

    const doc = new PDFDocument({
      size: [800, 600],
      margin: 50
    });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Certificate design
    doc.rect(0, 0, 800, 600).fill('#f8f9fa');
    
    // Border
    doc.rect(20, 20, 760, 560)
      .lineWidth(3)
      .stroke('#00E881');

    // Title
    doc.fontSize(36)
      .fillColor('#00E881')
      .text('CERTIFICATE OF COMPLETION', 50, 100, { align: 'center', width: 700 });

    // Subtitle
    doc.fontSize(16)
      .fillColor('#666')
      .text('This is to certify that', 50, 180, { align: 'center', width: 700 });

    // Student name
    doc.fontSize(32)
      .fillColor('#000')
      .font('Helvetica-Bold')
      .text(user.name, 50, 220, { align: 'center', width: 700 });

    // Course completion text
    doc.fontSize(16)
      .fillColor('#666')
      .font('Helvetica')
      .text('has successfully completed the course', 50, 280, { align: 'center', width: 700 });

    // Course title
    doc.fontSize(24)
      .fillColor('#00E881')
      .font('Helvetica-Bold')
      .text(course.title, 50, 320, { align: 'center', width: 700 });

    // Certificate ID
    doc.fontSize(12)
      .fillColor('#999')
      .font('Helvetica')
      .text(`Certificate ID: ${certificateId}`, 50, 400, { align: 'center', width: 700 });

    // Date
    doc.fontSize(14)
      .fillColor('#666')
      .text(`Issued on: ${issuedDate}`, 50, 450, { align: 'center', width: 700 });

    // Signature line
    doc.moveTo(150, 500)
      .lineTo(250, 500)
      .stroke('#000');
    doc.fontSize(12)
      .fillColor('#666')
      .text('Instructor', 150, 510, { align: 'center', width: 100 });

    doc.moveTo(550, 500)
      .lineTo(650, 500)
      .stroke('#000');
    doc.fontSize(12)
      .fillColor('#666')
      .text('NanoFlows Academy', 550, 510, { align: 'center', width: 100 });

    doc.end();

    return new Promise((resolve) => {
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback to HTML
    return generateCertificateHTML(course, user, certificateId, issuedDate);
  }
};

// HTML template for certificate (fallback or for Cloudinary/S3 upload)
const generateCertificateHTML = (course, user, certificateId, issuedDate) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 40px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .certificate {
      background: white;
      width: 800px;
      height: 600px;
      padding: 50px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      border: 5px solid #00E881;
      position: relative;
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 2px solid #00E881;
    }
    h1 {
      color: #00E881;
      font-size: 36px;
      text-align: center;
      margin: 20px 0;
      font-weight: bold;
    }
    .subtitle {
      text-align: center;
      color: #666;
      font-size: 16px;
      margin: 30px 0 10px;
    }
    .student-name {
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      color: #000;
      margin: 20px 0;
    }
    .course-text {
      text-align: center;
      color: #666;
      font-size: 16px;
      margin: 20px 0;
    }
    .course-title {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #00E881;
      margin: 20px 0;
    }
    .certificate-id {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin: 40px 0 10px;
    }
    .date {
      text-align: center;
      color: #666;
      font-size: 14px;
      margin: 20px 0;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      padding: 0 100px;
    }
    .signature {
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #000;
      width: 150px;
      margin: 0 auto 10px;
    }
    .signature-label {
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <h1>CERTIFICATE OF COMPLETION</h1>
    <p class="subtitle">This is to certify that</p>
    <p class="student-name">${user.name}</p>
    <p class="course-text">has successfully completed the course</p>
    <p class="course-title">${course.title}</p>
    <p class="certificate-id">Certificate ID: ${certificateId}</p>
    <p class="date">Issued on: ${issuedDate}</p>
    <div class="signatures">
      <div class="signature">
        <div class="signature-line"></div>
        <p class="signature-label">Instructor</p>
      </div>
      <div class="signature">
        <div class="signature-line"></div>
        <p class="signature-label">NanoFlows Academy</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = {
  generateCertificatePDF,
  generateCertificateHTML
};

