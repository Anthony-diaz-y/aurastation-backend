export function buildNotesBlock(notesText: string): string {
  return `
    <div style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border-left: 4px solid #f59e0b; border-radius: 0 12px 12px 0; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 1px;">
        📝 Diario de bienestar
      </p>
      <p style="margin: 0; font-style: italic; color: #78350f; font-size: 14px; line-height: 1.6;">
        &ldquo;${notesText}&rdquo;
      </p>
    </div>
  `;
}
