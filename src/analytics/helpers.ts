const regex = /#[^\s#]+/g;

/**
 * Returns hashtags
 * @param {string} text
 * @return { RegExpMatchArray | null}
 */
export const getAllTags = (text: string): RegExpMatchArray | null => text.match(regex);
