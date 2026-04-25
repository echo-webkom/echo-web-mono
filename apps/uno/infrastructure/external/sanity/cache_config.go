package sanityinfra

import "time"

// We can cache for so long, because the CMS sends a webhook on every change,
// revalidating the cache when needed.
const cmsCacheTTL = 30 * 24 * time.Hour // 30 days.

const sixHoursTTL = 6 * time.Hour
