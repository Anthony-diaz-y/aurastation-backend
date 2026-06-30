export function MeasurementTable(rows: any): string {
  return `
        <div style="margin-bottom: 24px;">
          <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 800; color: #36A9E1; text-transform: uppercase; letter-spacing: 1px;">
            📊 Mediciones del día
          </p>
          <div style="border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse; background: #fff;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">#</th>
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Hora</th>
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Ritmo Cardíaco</th>
                  <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Estado</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      `;
}
