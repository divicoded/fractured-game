// Simple Zalgo-like text corrupter
export const corruptText = (text: string, intensity: number): string => {
    if (intensity <= 0) return text;
  
    const chars = text.split('');
    const glitchChars = ['̸', '̷', '̴', '̶', '̵', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '̽', '̾', '͛', '͙', '͚'];
    
    return chars.map(char => {
      // Don't corrupt spaces excessively
      if (char === ' ') return Math.random() < (intensity * 0.1) ? '_' : ' ';
      
      if (Math.random() < intensity) {
        // Replace character
        if (Math.random() < 0.3) {
            const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
            return randomChar;
        }
        // Add Zalgo
        return char + glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    }).join('');
  };
  
  export const formatSystemTime = (): string => {
    const d = new Date();
    return `[${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}]`;
  };