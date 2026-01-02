import { Tag } from '../types';
import { isValidAddress, normalizeAddress } from '../utils/address';

export function parseCSV(csvContent: string, source: string): Tag[] {
  const tags: Tag[] = [];
  const lines = csvContent.trim().split('\n');

  if (lines.length < 2) {
    return tags; // Empty or header-only
  }

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing - handle quoted values
    const values = parseCSVLine(line);
    if (values.length >= 2) {
      const address = values[0].trim();
      const name = values[1].trim();

      if (isValidAddress(address) && name) {
        tags.push({
          address: normalizeAddress(address),
          name,
          source,
        });
      }
    }
  }

  return tags;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

export function tagsToCSV(tags: Tag[]): string {
  const lines = ['address,name'];

  for (const tag of tags) {
    const name = tag.entity ? `${tag.entity}:${tag.name}` : tag.name;
    // Escape quotes and wrap in quotes if necessary
    const escapedName = name.includes(',') || name.includes('"')
      ? `"${name.replace(/"/g, '""')}"`
      : name;
    lines.push(`${tag.address},${escapedName}`);
  }

  return lines.join('\n');
}

export async function fetchCSVFromURL(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`);
  }
  return response.text();
}
