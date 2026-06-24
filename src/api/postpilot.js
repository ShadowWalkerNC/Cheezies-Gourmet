/**
 * postpilot.js -- Post-Pilot bridge for Cheezies Gourmet
 *
 * Connects Cheezies to Post-Pilot so that admin actions
 * (new specials, hours updates) automatically trigger social media posts.
 * Also pulls Post-Pilot post history to display on the site.
 *
 * Required env vars (set in Vercel dashboard):
 *   VITE_POSTPILOT_URL      -- e.g. https://post-pilot.vercel.app
 *   VITE_POSTPILOT_API_KEY  -- your Post-Pilot API key
 */

const BASE = import.meta.env.VITE_POSTPILOT_URL;
const KEY  = import.meta.env.VITE_POSTPILOT_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': KEY,
};

/**
 * Publish a post immediately to one or more platforms.
 * @param {string} caption - The post text
 * @param {string[]} platforms - e.g. ['facebook', 'instagram']
 */
export const createPost = (caption, platforms = ['facebook', 'instagram']) =>
  fetch(`${BASE}/api/publish`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ caption, platforms }),
  }).then(r => r.json());

/**
 * Schedule a post for a future time.
 * @param {string} caption
 * @param {string[]} platforms
 * @param {string} scheduledAt - ISO date string e.g. '2026-06-25T18:00:00Z'
 */
export const schedulePost = (caption, platforms, scheduledAt) =>
  fetch(`${BASE}/api/publish`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ caption, platforms, schedule_time: scheduledAt }),
  }).then(r => r.json());

/**
 * Get recent post history (for social feed page).
 * @param {number} limit - max posts to return
 */
export const getPostHistory = (limit = 20) =>
  fetch(`${BASE}/api/post_history?limit=${limit}`, { headers })
    .then(r => r.json());

/**
 * Announce a new menu special on social media.
 * Call this from AdminPage when a new special is saved.
 * @param {{ name: string, description: string, price?: string }} special
 */
export const announceSpecial = (special) => {
  const caption = `🧀 New special at Cheezies Gourmet: ${special.name}${
    special.description ? ` — ${special.description}` : ''
  }${special.price ? ` | ${special.price}` : ''}! Come check it out! 🎉`;
  return createPost(caption, ['facebook', 'instagram']);
};

/**
 * Announce updated business hours on social media.
 * Call this from AdminPage when hours are saved.
 * @param {string} hoursText - e.g. 'Mon-Fri 10am-8pm, Sat-Sun 11am-6pm'
 */
export const announceHours = (hoursText) => {
  const caption = `📣 Cheezies Gourmet updated hours: ${hoursText}. Come see us!`;
  return createPost(caption, ['facebook', 'instagram']);
};

/**
 * Announce a new event.
 * @param {{ title: string, date: string, description?: string }} event
 */
export const announceEvent = (event) => {
  const caption = `🎉 Upcoming event at Cheezies: ${event.title} on ${event.date}${
    event.description ? ` — ${event.description}` : ''
  }! See you there!`;
  return createPost(caption, ['facebook', 'instagram']);
};
