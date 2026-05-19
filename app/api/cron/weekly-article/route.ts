import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import nodemailer from 'nodemailer'

// ─── Topic rotation (8 topics, cycles by ISO week number) ─────────────────────
const TOPICS = [
  {
    title: 'The Rise of High-Power EV Charging in Latin America',
    focus: 'Growth of DC fast charging infrastructure in Panama, Mexico, and the broader Latin American market. Include statistics on EV adoption rates, infrastructure gaps, and how Greenspace is positioned to bridge them.',
    keywords: 'EV charging Latin America, DC fast charging Panama, electric vehicle infrastructure Mexico',
    imageQuery: 'electric vehicle charging station modern',
  },
  {
    title: 'Class 8 Electric Trucks: Transforming Long-Haul Freight',
    focus: 'How electric Class 8 trucks like the Windrose are disrupting traditional diesel fleets. Cover total cost of ownership, payload capabilities, range anxiety solutions, and real-world performance data.',
    keywords: 'Class 8 electric truck, electric semi truck, Windrose truck, electric freight transport',
    imageQuery: 'electric truck highway freight',
  },
  {
    title: 'The Mexico–Texas Electric Highway: A Cross-Border Corridor',
    focus: 'The strategic importance of establishing a continuous EV charging corridor from Monterrey to Dallas/Houston. Cover trade flows, the USMCA economy, logistics decarbonization targets, and infrastructure requirements.',
    keywords: 'electric highway Mexico Texas, EV corridor Monterrey Dallas, cross-border electric truck charging',
    imageQuery: 'highway corridor electric vehicle infrastructure',
  },
  {
    title: 'Solar-Integrated EV Charging: The Future of Sustainable Mobility',
    focus: 'How combining solar generation with EV charging stations creates energy-independent, cost-effective charging hubs. Include LCOE analysis, grid resilience benefits, and use cases in Panama and Mexico.',
    keywords: 'solar EV charging, solar carport charging, off-grid electric vehicle charging, renewable energy mobility',
    imageQuery: 'solar panels electric vehicle charging renewable energy',
  },
  {
    title: 'Fleet Electrification: A Step-by-Step Guide for Businesses',
    focus: 'Practical roadmap for businesses converting their vehicle fleets to electric. Cover audit process, charging infrastructure sizing, total cost of ownership comparison, incentives in Panama and Mexico, and change management.',
    keywords: 'fleet electrification guide, commercial EV fleet, business electric vehicle transition, fleet charging infrastructure',
    imageQuery: 'electric fleet vehicles corporate charging depot',
  },
  {
    title: 'Smart Charging Management: Why Software is the New Backbone of EV Infrastructure',
    focus: 'How intelligent charging management platforms (like MaxiCharger Manage) optimize energy use, prevent grid overload, enable demand response, and generate revenue for charge point operators.',
    keywords: 'smart EV charging management, OCPP platform, charge point operator software, energy management EV',
    imageQuery: 'smart technology data center energy management',
  },
  {
    title: "Norway's EV Success Story: Lessons for Panama, Mexico & the Americas",
    focus: "Examine how Norway achieved 90%+ EV market share and what policies, incentives, and infrastructure models can be adapted for Latin American markets. Draw parallels with Greenspace's multi-market strategy.",
    keywords: 'Norway EV policy, electric vehicle incentives Latin America, EV adoption strategy, EV market growth',
    imageQuery: 'Norway fjord electric vehicle sustainable transport',
  },
  {
    title: 'Commercial & Public EV Charging: Building the Business Case',
    focus: 'Why shopping centers, hotels, office parks, and municipalities should install public EV charging. Cover revenue models (pay-per-use, subscription, monetize dwell time), permitting in Panama/Mexico, and ROI timelines.',
    keywords: 'public EV charging business case, commercial charging station ROI, EV charging hospitality retail',
    imageQuery: 'shopping center parking lot electric vehicle charger',
  },
]

// ─── Fetch image from Unsplash ────────────────────────────────────────────────
async function fetchUnsplashImage(query: string): Promise<{ url: string; credit: string; creditUrl: string } | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) return null

  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      url: data.urls?.regular || data.urls?.full,
      credit: data.user?.name || 'Unsplash',
      creditUrl: data.links?.html || 'https://unsplash.com',
    }
  } catch {
    return null
  }
}

// ─── Fallback curated images (no API key needed) ──────────────────────────────
const FALLBACK_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200', credit: 'Unsplash', creditUrl: 'https://unsplash.com' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200', credit: 'Unsplash', creditUrl: 'https://unsplash.com' },
  { url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200', credit: 'Unsplash', creditUrl: 'https://unsplash.com' },
  { url: 'https://images.unsplash.com/photo-1609205807107-1b05c0a9b8e7?w=1200', credit: 'Unsplash', creditUrl: 'https://unsplash.com' },
  { url: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1200', credit: 'Unsplash', creditUrl: 'https://unsplash.com' },
  { url: 'https://images.unsplash.com/photo-1548186328-b8e73acd3a98?w=1200', credit: 'Unsplash', creditUrl: 'https://unsplash.com' },
  { url: 'https://images.unsplash.com/photo-1649775924849-36a5d6caab85?w=1200', credit: 'Unsplash', creditUrl: 'https://unsplash.com' },
  { url: 'https://images.unsplash.com/photo-1561518776-e76a5e48f731?w=1200', credit: 'Unsplash', creditUrl: 'https://unsplash.com' },
]

// ─── Generate article with Claude ─────────────────────────────────────────────
async function generateArticle(topic: typeof TOPICS[0], weekNumber: number) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `You are a senior content strategist for Greenspace E-mobility, a company that builds and operates high-power EV charging infrastructure and distributes electric vehicles across Panama, Mexico (Monterrey), Texas (USA), and Norway (Oslo).

Company context:
- Official distributor of Autel Energy EV chargers (MaxiCharger AC/DC series, up to 360kW)
- Exclusive distributor of Windrose Class 8 electric trucks in Latin America
- Operates a proprietary smart charging management platform
- Developing Mexico–Texas electric highway corridor (Monterrey to Dallas)
- Focuses on residential, commercial, public, and fleet charging segments

Write a professional, authoritative blog article on the following topic:

TOPIC: ${topic.title}

FOCUS AREAS: ${topic.focus}

TARGET KEYWORDS: ${topic.keywords}

REQUIREMENTS:
- Length: 900–1,100 words
- Tone: Authoritative but accessible — speak to business decision-makers and industry professionals
- Structure: H1 title, intro paragraph, 4–5 H2 sections, conclusion with a clear call-to-action to contact Greenspace
- Include 4–5 specific statistics or data points (cite realistic sources like IEA, BloombergNEF, Rocky Mountain Institute, S&P Global Mobility, INEGI, etc.)
- Naturally mention Greenspace E-mobility's solutions where relevant (don't be overly promotional — educate first)
- End with a references section listing 4–5 real, verifiable sources related to the topic
- Use metric units alongside imperial where relevant (kWh, km alongside miles)

IMPORTANT: Return the article in the following JSON format (no markdown outside the JSON):
{
  "headline": "The exact H1 title",
  "metaDescription": "155-character SEO meta description",
  "excerpt": "2-sentence summary for the email preview",
  "readingTime": "X min read",
  "htmlBody": "The full article HTML starting from the first <h2> (no <h1> — that is handled separately). Use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags only. No inline styles.",
  "references": [
    { "title": "Source title", "url": "https://...", "publisher": "Publisher name", "year": "2024" }
  ],
  "suggestedSlug": "url-friendly-slug-for-article"
}`

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  // Extract JSON from response (handle potential markdown code fences)
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not parse article JSON')

  return JSON.parse(jsonMatch[0]) as {
    headline: string
    metaDescription: string
    excerpt: string
    readingTime: string
    htmlBody: string
    references: Array<{ title: string; url: string; publisher: string; year: string }>
    suggestedSlug: string
  }
}

// ─── Build HTML email ──────────────────────────────────────────────────────────
function buildEmailHtml(article: Awaited<ReturnType<typeof generateArticle>>, topic: typeof TOPICS[0], image: { url: string; credit: string; creditUrl: string }, weekNumber: number, publishDate: string) {
  const refsHtml = article.references
    .map(
      (r, i) =>
        `<tr>
          <td style="padding:6px 0;vertical-align:top;color:#6b7280;font-size:12px;">[${i + 1}]</td>
          <td style="padding:6px 0 6px 8px;vertical-align:top;">
            <a href="${r.url}" style="color:#22c55e;text-decoration:none;font-size:13px;">${r.title}</a>
            <span style="color:#9ca3af;font-size:12px;"> — ${r.publisher}, ${r.year}</span>
          </td>
        </tr>`
    )
    .join('')

  // Convert article HTML to email-safe HTML with inline font-size
  const bodyHtml = article.htmlBody
    .replace(/<h2>/g, '<h2 style="font-size:20px;font-weight:700;color:#0a1628;margin:28px 0 12px;">')
    .replace(/<h3>/g, '<h3 style="font-size:16px;font-weight:600;color:#0a1628;margin:20px 0 8px;">')
    .replace(/<p>/g, '<p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 16px;">')
    .replace(/<ul>/g, '<ul style="padding-left:20px;margin:0 0 16px;">')
    .replace(/<li>/g, '<li style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 6px;">')
    .replace(/<strong>/g, '<strong style="color:#0a1628;">')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Article Draft — ${article.headline}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

        <!-- Header bar -->
        <tr>
          <td style="background:#0a1628;padding:20px 28px;border-radius:12px 12px 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="color:#22c55e;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Greenspace E-mobility</span><br>
                  <span style="color:rgba(255,255,255,0.5);font-size:11px;">Weekly Article Draft · Week ${weekNumber}</span>
                </td>
                <td align="right">
                  <span style="background:#22c55e;color:#0a1628;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">DRAFT — NEEDS APPROVAL</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Hero image -->
        <tr>
          <td style="padding:0;line-height:0;">
            <img src="${image.url}" alt="${article.headline}" width="620" style="width:100%;max-width:620px;height:280px;object-fit:cover;display:block;" />
          </td>
        </tr>

        <!-- Article content -->
        <tr>
          <td style="background:#ffffff;padding:36px 36px 28px;">

            <!-- Category & reading time -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td>
                  <span style="background:#f0fdf4;color:#16a34a;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:20px;border:1px solid #bbf7d0;">EV Industry Insights</span>
                </td>
                <td align="right">
                  <span style="color:#9ca3af;font-size:12px;">${article.readingTime} · ${publishDate}</span>
                </td>
              </tr>
            </table>

            <!-- Headline -->
            <h1 style="font-size:26px;font-weight:800;color:#0a1628;line-height:1.3;margin:0 0 16px;">${article.headline}</h1>

            <!-- Excerpt / lead -->
            <p style="font-size:16px;line-height:1.6;color:#4b5563;font-style:italic;border-left:3px solid #22c55e;padding-left:16px;margin:0 0 28px;">${article.excerpt}</p>

            <!-- Divider -->
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 28px;">

            <!-- Article body -->
            ${bodyHtml}

            <!-- References -->
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-top:32px;">
              <p style="font-size:12px;font-weight:700;color:#0a1628;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">References</p>
              <table cellpadding="0" cellspacing="0">
                ${refsHtml}
              </table>
            </div>

            <!-- Image credit -->
            <p style="font-size:11px;color:#d1d5db;margin:12px 0 0;text-align:right;">
              Photo: <a href="${image.creditUrl}" style="color:#d1d5db;">${image.credit}</a> via Unsplash
            </p>
          </td>
        </tr>

        <!-- Action panel -->
        <tr>
          <td style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;padding:28px 36px;border-radius:0 0 12px 12px;">
            <p style="font-size:14px;color:#374151;margin:0 0 6px;"><strong>Ready to publish this article?</strong></p>
            <p style="font-size:13px;color:#6b7280;margin:0 0 20px;line-height:1.6;">Review the article above. If you're happy with it, reply to this email with <strong>"Approved"</strong> and the content team will publish it to the website. To request edits, reply with your feedback.</p>

            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;">
                  <a href="mailto:info@gs-emobility.com?subject=APPROVED%3A ${encodeURIComponent(article.headline)}&body=Approved%20-%20please%20publish%20this%20article."
                     style="display:inline-block;background:#22c55e;color:#0a1628;font-size:13px;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;">
                    ✓ Approve &amp; Publish
                  </a>
                </td>
                <td>
                  <a href="mailto:info@gs-emobility.com?subject=EDITS%3A ${encodeURIComponent(article.headline)}&body=Please%20make%20the%20following%20changes%3A%0A%0A"
                     style="display:inline-block;background:#ffffff;color:#374151;font-size:13px;font-weight:600;padding:11px 24px;border-radius:8px;text-decoration:none;border:1px solid #d1d5db;">
                    Request Edits
                  </a>
                </td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">

            <!-- Technical details for publishing -->
            <details>
              <summary style="font-size:12px;color:#9ca3af;cursor:pointer;margin-bottom:8px;">Publishing details (for web team)</summary>
              <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:8px;">
                <tr>
                  <td style="font-size:12px;color:#6b7280;padding:4px 0;width:120px;">Suggested URL</td>
                  <td style="font-size:12px;color:#0a1628;padding:4px 0;font-family:monospace;">/blog/${article.suggestedSlug}</td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:#6b7280;padding:4px 0;">Meta description</td>
                  <td style="font-size:12px;color:#0a1628;padding:4px 0;">${article.metaDescription}</td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:#6b7280;padding:4px 0;">Keywords</td>
                  <td style="font-size:12px;color:#0a1628;padding:4px 0;">${topic.keywords}</td>
                </tr>
              </table>
            </details>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 0;text-align:center;">
            <p style="font-size:11px;color:#9ca3af;margin:0;">
              This article was automatically generated by the Greenspace E-mobility content system.<br>
              © ${new Date().getFullYear()} Greenspace E-mobility · <a href="https://www.gs-emobility.com" style="color:#9ca3af;">gs-emobility.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Main handler ──────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Verify this is called by Vercel Cron (or manually with the secret)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Determine which topic to use based on ISO week number
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
    const topicIndex = (weekNumber - 1) % TOPICS.length
    const topic = TOPICS[topicIndex]

    const publishDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    console.log(`[Weekly Article] Week ${weekNumber}, Topic: ${topic.title}`)

    // Generate article
    const article = await generateArticle(topic, weekNumber)
    console.log(`[Weekly Article] Generated: "${article.headline}"`)

    // Fetch hero image
    let image = await fetchUnsplashImage(topic.imageQuery)
    if (!image) {
      image = FALLBACK_IMAGES[topicIndex % FALLBACK_IMAGES.length]
      console.log('[Weekly Article] Using fallback image')
    }

    // Build email
    const html = buildEmailHtml(article, topic, image, weekNumber, publishDate)

    // Send via Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"Greenspace Content Bot" <${process.env.GMAIL_USER}>`,
      to: 'info@gs-emobility.com',
      cc: 'william.pui@gs-emobility.com',
      subject: `📝 Weekly Article Draft (Week ${weekNumber}): ${article.headline}`,
      html,
    })

    console.log('[Weekly Article] Email sent successfully')

    return NextResponse.json({
      success: true,
      week: weekNumber,
      topic: topic.title,
      headline: article.headline,
      slug: article.suggestedSlug,
    })
  } catch (err) {
    console.error('[Weekly Article] Error:', err)
    return NextResponse.json({ error: 'Article generation failed', details: String(err) }, { status: 500 })
  }
}
