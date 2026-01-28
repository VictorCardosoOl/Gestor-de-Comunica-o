
/**
 * Escapes special characters for RegExp.
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Generates an accent-insensitive RegExp for searching.
 */
export const getAccentInsensitiveRegex = (text: string): RegExp => {
  const accMap: Record<string, string> = {
    'a': '[aàáâãäå]', 'e': '[eèéêë]', 'i': '[iìíîï]', 'o': '[oòóôõöø]', 'u': '[uùúûü]', 'c': '[cç]', 'n': '[nñ]'
  };
  
  const escaped = escapeRegExp(text);
  const pattern = escaped.split('').map((char) => {
    const lower = char.toLowerCase();
    return accMap[lower] || char;
  }).join('');
  
  return new RegExp(`(${pattern})`, 'gi');
};

/**
 * Determines the HTML input type based on the placeholder label.
 */
export const getInputType = (placeholder: string): 'date' | 'time' | 'textarea' | 'text' => {
  const lower = placeholder.toLowerCase();
  if (lower.includes('data')) return 'date';
  if (/(horário|inicio|fim)/.test(lower)) return 'time';
  if (/(módulos|conteúdo|lista)/.test(lower)) return 'textarea';
  return 'text';
};

/**
 * Formats a value based on its input type (e.g., transforming YYYY-MM-DD to DD/MM/YYYY).
 */
export const formatValueForText = (value: string, type: string): string => {
  if (!value) return '';
  if (type === 'date') {
    const [year, month, day] = value.split('-');
    if (year && month && day) return `${day}/${month}/${year}`;
  }
  return value;
};

/**
 * Returns a time-based greeting (Bom dia, Boa tarde, Boa noite).
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'bom dia';
  if (hour >= 12 && hour < 18) return 'boa tarde';
  return 'boa noite';
};

/**
 * Returns today's date formatted as 'DD de Month de YYYY'.
 */
export const getFormattedToday = (): string => {
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
};

/**
 * Calculates the next business day (skips weekends).
 */
export const getFormattedNextBusinessDay = (): string => {
  const date = new Date();
  const dayOfWeek = date.getDay();
  // Friday (5) -> Add 3 days; Saturday (6) -> Add 2 days; Others -> Add 1 day
  const daysToAdd = dayOfWeek === 5 ? 3 : dayOfWeek === 6 ? 2 : 1;
  date.setDate(date.getDate() + daysToAdd);
  
  const str = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Replaces static system tags in text with dynamic values.
 */
export const processStaticTags = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\[Saudação\]/g, getGreeting())
    .replace(/\[Data Hoje\]/g, getFormattedToday())
    .replace(/\[Data Extenso\]/g, getFormattedNextBusinessDay());
};

/**
 * Calculates duration between two time strings (HH:MM).
 */
export const calculateDuration = (start: string, end: string): string => {
  if (!start || !end) return '';
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  
  let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle overnight shifts

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${String(hours).padStart(2, '0')}h${String(minutes).padStart(2, '0')}`;
};

/**
 * Generates an OS number from a date string (removes hyphens).
 */
export const generateOSFromDate = (dateStr: string): string => {
  return dateStr ? dateStr.replace(/-/g, '') : '';
};
