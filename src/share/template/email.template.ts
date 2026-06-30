export function emailTemplate(
  formattedDate,
  recipient,
  sender,
  measurementsBlock,
  notesBlock,
): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reporte AuraStation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- HEADER -->
          <tr>
            <td>
              <div style="background: linear-gradient(135deg, #0c5395 0%, #1a72c7 100%); border-radius: 20px 20px 0 0; padding: 32px 32px 28px; text-align: center;">
                <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 28px; margin-bottom: 12px;">💓</div>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase;">AURASTATION</h1>
                <p style="margin: 6px 0 0; color: rgba(255,255,255,0.7); font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Reporte de Bienestar Cardíaco</p>
              </div>
            </td>
          </tr>

          <!-- DATE BANNER -->
          <tr>
            <td>
              <div style="background: #36A9E1; padding: 12px 32px; text-align: center;">
                <p style="margin: 0; color: #ffffff; font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                  📅 ${formattedDate}
                </p>
              </div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td>
              <div style="background: #ffffff; padding: 32px; border-radius: 0 0 20px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

                <!-- Greeting -->
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Hola,</p>
                <h2 style="margin: 0 0 20px; color: #0f172a; font-size: 20px; font-weight: 800;">${recipient.name || recipient.email} 👋</h2>

                <!-- Sender info card -->
                <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px; display: flex;">
                  <div>
                    <p style="margin: 0 0 4px; font-size: 12px; color: #3b82f6; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Compartido por</p>
                    <p style="margin: 0; font-size: 16px; color: #1e40af; font-weight: 900;">${sender.name || sender.email}</p>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">${sender.email}</p>
                  </div>
                </div>

                <!-- Measurements -->
                ${measurementsBlock}

                <!-- Notes -->
                ${notesBlock}

                <!-- Footer note -->
                <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 4px;">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.7; text-align: center;">
                    Este reporte fue generado automáticamente por <strong style="color: #0c5395;">AuraStation</strong>.<br/>
                    Inicia sesión para ver el historial completo de reportes compartidos contigo.
                  </p>
                </div>

              </div>F
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 20px 0 8px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                © 2026 AuraStation · Todos los derechos reservados
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `;
}
