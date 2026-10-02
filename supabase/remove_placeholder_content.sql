-- Takes placeholder catalogue entries off the public website. Rows are set to draft,
-- not deleted, so any of them can be republished from the admin console once the
-- product or programme actually exists.

UPDATE public.suites SET status = 'draft' WHERE status = 'published';
UPDATE public.marketplaceitems SET status = 'draft' WHERE status = 'published';

-- Main navigation points only at pages that exist.
UPDATE public.menus
SET items = '[
  {"label": "Products", "href": "/products"},
  {"label": "Services", "href": "/services"},
  {"label": "Pricing", "href": "/pricing"},
  {"label": "About", "href": "/about"},
  {"label": "Contact", "href": "/contact"}
]'::jsonb
WHERE name = 'Main Navbar';

-- Verification: what the website will list.
SELECT 'products' AS catalogue, slug, status FROM public.products WHERE status = 'published'
UNION ALL SELECT 'suites', slug, status FROM public.suites WHERE status = 'published'
UNION ALL SELECT 'marketplace', slug, status FROM public.marketplaceitems WHERE status = 'published'
UNION ALL SELECT 'services', slug, status FROM public.services WHERE status = 'published'
UNION ALL SELECT 'pages', slug, status FROM public.pages WHERE status = 'published';
