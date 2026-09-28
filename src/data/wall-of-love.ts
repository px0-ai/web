/**
 * Wall of love content. Add a tweet by pasting its numeric ID (the last part of
 * the tweet URL, e.g. x.com/user/status/<ID>) into TWEET_IDS. Newest first.
 */
export const TWEET_IDS: string[] = [
  // "1732824684683784516",
];

export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  /** Optional link to the original post, email, or Slack message */
  url?: string;
}

/** Non-tweet testimonials (Slack, email, GitHub, etc.) */
export const TESTIMONIALS: Testimonial[] = [
  // { quote: "Reviews agent diffs in a blink.", name: "Jane Doe", role: "Staff Engineer, Acme", url: "https://..." },
];
