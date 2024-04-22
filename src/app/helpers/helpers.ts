export class TextHelper {
  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  static toTitleCase(text: string): string {
    return text
      .split(' ')
      .flatMap((part) => part.split('-'))
      .map((word) => this.capitalize(word))
      .join(' ');
  }
}
