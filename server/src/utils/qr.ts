import QRCode from "qrcode";

/**
 * QR payload format:
 * A URL-safe string encoding the ticket's qrUuid.
 * Scanners resolve this against the validation endpoint.
 *
 * Format: addisevent://ticket/<qrUuid>
 *
 * The organizer's scanner app opens this deep link or posts
 * the qrUuid to POST /api/v1/tickets/validate.
 */
export function generateQRPayload(qrUuid: string): string {
  return `addisevent://ticket/${qrUuid}`;
}

/**
 * Render a QR code as a base64-encoded PNG data URL.
 * Suitable for embedding in ticket PDFs or email HTML.
 */
export async function generateQRDataURL(qrUuid: string): Promise<string> {
  const payload = generateQRPayload(qrUuid);
  return await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "H",
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
}

/**
 * Render a QR code as an SVG string.
 * Useful for inline rendering in ticket pages.
 */
export async function generateQRSvg(qrUuid: string): Promise<string> {
  const payload = generateQRPayload(qrUuid);
  return await QRCode.toString(payload, {
    type: "svg",
    errorCorrectionLevel: "H",
    width: 200,
    margin: 2,
  });
}
