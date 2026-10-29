export type SectionPosition = { id: string; top: number };

/**
 * Picks the section the reader is in: the last one whose top edge has scrolled above `line`
 * (a few pixels below the sticky header). At the very bottom of the page the last section wins,
 * because a short final section may never reach the line.
 */
export function pickActiveSection(sections: SectionPosition[], line: number, atBottom: boolean): string | null {
  if (sections.length === 0) return null;
  if (atBottom) return sections[sections.length - 1].id;

  let active: string | null = null;
  for (const section of sections) {
    if (section.top <= line) active = section.id;
  }
  return active;
}
