import { readFile } from "node:fs/promises";
import { PDFDocument, StandardFonts, rgb, type PDFImage } from "pdf-lib";
import { generateCertificateQrPng } from "@/lib/certificate-qr";
import {
  HEXAVANTE_CERTIFICATE_OWNERS,
  getCertificateOwnerSignaturePath,
} from "@/lib/certificate-owners";
import { getCertificatePublicUrl } from "@/lib/certificate-share";

type CertificatePdfData = {
  studentName: string;
  courseTitle: string;
  categoryName: string;
  code: string;
  issuedAt: Date;
};

async function embedSignatureImage(pdf: PDFDocument, bytes: Uint8Array): Promise<PDFImage> {
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;

  if (isPng) {
    return pdf.embedPng(bytes);
  }

  if (isJpeg) {
    return pdf.embedJpg(bytes);
  }

  throw new Error("Formato de assinatura não suportado. Use PNG ou JPEG.");
}

export async function buildCertificatePdf(data: CertificatePdfData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const { width, height } = page.getSize();

  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: rgb(0.2, 0.55, 0.95),
    borderWidth: 3,
  });

  page.drawText("HEXAVANTE", {
    x: 48,
    y: height - 72,
    size: 28,
    font: bold,
    color: rgb(0.15, 0.45, 0.85),
  });

  page.drawText("Certificado de conclusão", {
    x: 48,
    y: height - 110,
    size: 18,
    font: regular,
    color: rgb(0.25, 0.25, 0.3),
  });

  page.drawText("Certificamos que", {
    x: 48,
    y: height - 170,
    size: 14,
    font: regular,
    color: rgb(0.35, 0.35, 0.4),
  });

  page.drawText(data.studentName, {
    x: 48,
    y: height - 205,
    size: 30,
    font: bold,
    color: rgb(0.1, 0.1, 0.15),
  });

  page.drawText("concluiu com sucesso o curso", {
    x: 48,
    y: height - 245,
    size: 14,
    font: regular,
    color: rgb(0.35, 0.35, 0.4),
  });

  page.drawText(data.courseTitle, {
    x: 48,
    y: height - 280,
    size: 22,
    font: bold,
    color: rgb(0.1, 0.1, 0.15),
  });

  page.drawText(`Categoria: ${data.categoryName}`, {
    x: 48,
    y: height - 315,
    size: 12,
    font: regular,
    color: rgb(0.4, 0.4, 0.45),
  });

  const signatureWidth = 150;
  const signatureHeight = 46;
  const signatureGap = 48;
  const signaturesTotalWidth =
    signatureWidth * HEXAVANTE_CERTIFICATE_OWNERS.length +
    signatureGap * (HEXAVANTE_CERTIFICATE_OWNERS.length - 1);
  const signaturesStartX = (width - signaturesTotalWidth) / 2;
  const signatureImageY = 118;

  page.drawText("Fundadores, Hexavante", {
    x: signaturesStartX,
    y: signatureImageY + signatureHeight + 18,
    size: 9,
    font: bold,
    color: rgb(0.45, 0.45, 0.5),
  });

  for (const [index, owner] of HEXAVANTE_CERTIFICATE_OWNERS.entries()) {
    const x = signaturesStartX + index * (signatureWidth + signatureGap);
    const signatureBytes = await readFile(getCertificateOwnerSignaturePath(owner.signatureFile));
    const signatureImage = await embedSignatureImage(pdf, signatureBytes);

    page.drawImage(signatureImage, {
      x,
      y: signatureImageY,
      width: signatureWidth,
      height: signatureHeight,
    });

    page.drawText(owner.name, {
      x,
      y: signatureImageY - 14,
      size: 10,
      font: bold,
      color: rgb(0.2, 0.2, 0.25),
    });

    page.drawText(owner.title, {
      x,
      y: signatureImageY - 28,
      size: 8,
      font: regular,
      color: rgb(0.45, 0.45, 0.5),
    });
  }

  page.drawText(`Emitido em: ${data.issuedAt.toLocaleDateString("pt-BR")}`, {
    x: 48,
    y: 72,
    size: 11,
    font: regular,
    color: rgb(0.4, 0.4, 0.45),
  });

  page.drawText(`Código de verificação: ${data.code}`, {
    x: 48,
    y: 52,
    size: 11,
    font: bold,
    color: rgb(0.15, 0.45, 0.85),
  });

  const qrPng = await generateCertificateQrPng(getCertificatePublicUrl(data.code), 140);
  const qrImage = await pdf.embedPng(qrPng);
  page.drawImage(qrImage, {
    x: width - 180,
    y: 40,
    width: 120,
    height: 120,
  });

  page.drawText("Verificar online", {
    x: width - 178,
    y: 28,
    size: 9,
    font: regular,
    color: rgb(0.4, 0.4, 0.45),
  });

  return pdf.save();
}
