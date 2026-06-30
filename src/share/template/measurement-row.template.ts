const formatStress = (level?: string) => {
  switch (level) {
    case 'ir_al_medico':
      return '¡Visita al médico!';
    case 'calma':
      return 'Calma';
    case 'estres_moderado':
      return 'Estrés moderado';
    case 'estres_fuerte':
      return 'Estrés fuerte';
    default:
      return 'Sin registrar';
  }
};

const stressColor = (level?: string) => {
  switch (level) {
    case 'ir_al_medico':
      return '#ef4444';
    case 'estres_fuerte':
      return '#f97316';
    case 'estres_moderado':
      return '#eab308';
    case 'calma':
      return '#22c55e';
    default:
      return '#94a3b8';
  }
};

const stressBadge = (level?: string) => `
      <span style="
        display: inline-block;
        padding: 3px 10px;
        border-radius: 99px;
        background-color: ${stressColor(level)}22;
        color: ${stressColor(level)};
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      ">${formatStress(level)}</span>
    `;

export function MeasurementRow(m: any, i: number): string {
  return `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 13px; font-weight: 600;">
        ${i + 1}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 13px;">
        ${m.registrationTime || '--:--'}
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">
        <span style="font-size: 18px; font-weight: 900; color: #0c5395;">${m.bpm}</span>
        <span style="font-size: 12px; color: #94a3b8; margin-left: 2px;">BPM</span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">
        ${stressBadge(m.stressLevel)}
      </td>
    </tr>
  `;
}
