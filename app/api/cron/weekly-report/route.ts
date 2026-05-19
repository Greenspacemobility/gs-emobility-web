import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import nodemailer from 'nodemailer'

// ─── Competitive intelligence prompt ─────────────────────────────────────────
function buildCompetitivePrompt(weekNumber: number, year: number): string {
  return `You are a senior market intelligence analyst for Greenspace E-mobility, a company that:
- Builds and operates high-power EV charging infrastructure in Panama, Mexico (Monterrey), Texas (USA), and Norway (Oslo)
- Is the official Autel Energy EV charger distributor in Panama, Mexico, and the USA
- Is the exclusive Windrose Class 8 electric truck distributor in Latin America
- Is developing the Mexico–Texas Electric Highway corridor (Monterrey → Dallas, 5 phases, 15 Green Hubs)
- Offers a smart charging management platform (OCPP-compatible)

Generate a comprehensive WEEKLY COMPETITIVE INTELLIGENCE REPORT for Week ${weekNumber}, ${year}.

The report MUST include these 6 sections:

---
SECTION 1: EXECUTIVE SUMMARY (150 words)
3-4 bullet points summarizing the most critical developments this week for Greenspace. Lead with the single most important insight.

---
SECTION 2: COMPETITOR LANDSCAPE — EV CHARGING PANAMA & CENTRAL AMERICA
Analyze these known competitors and any new entrants:
- ABB (global, has Panama presence)
- ChargePoint (US-based, growing LATAM)
- Blink Charging (US-based)
- Local electricity utilities offering charging (ETESA, etc.)
- Any new entrants or recent investments in Panama EV charging
Include: estimated market share shifts, new station openings, pricing intel, strategic moves.

---
SECTION 3: COMPETITOR LANDSCAPE — EV CHARGING & ELECTRIC TRUCKS MEXICO
Cover:
- Volvo Trucks Mexico (electric heavy-duty)
- Daimler/Mercedes Benz Trucks (eActros in Mexico)
- BYD Mexico (EVs + buses, growing truck play)
- BAIC, JAC, and Chinese OEM electric trucks entering Mexico
- Mexican government PROSENE / ENERCC EV incentives and how competitors are leveraging them
- US CPOs expanding into Mexico via the USMCA corridor (EVgo, Tesla Supercharger)

---
SECTION 4: MARKET OPPORTUNITIES & THREATS
A) Top 3 opportunities Greenspace should act on THIS WEEK:
   - Specific, actionable, with estimated revenue potential
B) Top 3 threats that require monitoring:
   - With recommended mitigation strategy for each

---
SECTION 5: GREENSPACE STRATEGIC POSITION SCORECARD
Rate Greenspace vs. the market on 6 dimensions (score 1–10, with trend arrow ↑↓→):
| Dimension | Score | Trend | Notes |
|---|---|---|---|
| EV Charger Portfolio Competitiveness | | | |
| Geographic Coverage (Panama) | | | |
| Geographic Coverage (Mexico) | | | |
| Electric Truck Offering | | | |
| Software / Platform Strength | | | |
| Brand Awareness & AI Search Visibility | | | |

---
SECTION 6: RECOMMENDED ACTIONS FOR THIS WEEK
Exactly 5 concrete actions for the Greenspace leadership team, ranked by priority. Each must be:
- Specific (not generic)
- Achievable within 7 days
- Tied to a measurable outcome

---

FORMAT REQUIREMENTS:
- Return as structured JSON (no markdown outside the JSON)
- Be data-driven and cite realistic market figures
- Reference actual EV market trends (IEA, BloombergNEF, BNEF, S&P Global Mobility data)
- Tone: executive briefing — direct, no fluff

Return this exact JSON structure:
{
  "weekLabel": "Week ${weekNumber}, ${year}",
  "generatedDate": "${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}",
  "executiveSummary": {
    "headline": "One sentence capturing the most critical development",
    "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"]
  },
  "competitorPanama": {
    "overview": "2-3 sentence market overview",
    "competitors": [
      { "name": "Competitor name", "update": "Specific development or status", "threat": "low|medium|high", "action": "Recommended response" }
    ]
  },
  "competitorMexico": {
    "overview": "2-3 sentence market overview",
    "competitors": [
      { "name": "Competitor name", "update": "Specific development or status", "threat": "low|medium|high", "action": "Recommended response" }
    ]
  },
  "opportunities": [
    { "title": "Opportunity title", "description": "Specific opportunity", "potentialRevenue": "$X estimate", "timeframe": "X weeks/months", "priority": "HIGH|MEDIUM" }
  ],
  "threats": [
    { "title": "Threat title", "description": "Specific threat", "mitigation": "Recommended mitigation", "severity": "LOW|MEDIUM|HIGH" }
  ],
  "scorecard": [
    { "dimension": "EV Charger Portfolio Competitiveness", "score": 8, "trend": "↑", "notes": "..." },
    { "dimension": "Geographic Coverage (Panama)", "score": 7, "trend": "→", "notes": "..." },
    { "dimension": "Geographic Coverage (Mexico)", "score": 6, "trend": "↑", "notes": "..." },
    { "dimension": "Electric Truck Offering", "score": 9, "trend": "↑", "notes": "..." },
    { "dimension": "Software / Platform Strength", "score": 7, "trend": "→", "notes": "..." },
    { "dimension": "Brand Awareness & AI Search Visibility", "score": 5, "trend": "↑", "notes": "..." }
  ],
  "actions": [
    { "priority": 1, "action": "Specific action", "owner": "CEO|Sales|Marketing|Tech", "deadline": "Day of week", "metric": "Success metric" }
  ]
}`
}

// ─── Build HTML email ──────────────────────────────────────────────────────────
function buildReportEmail(report: any): string {
  const threatColor = (t: string) =>
    t === 'high' ? '#ef4444' : t === 'medium' ? '#f59e0b' : '#22c55e'

  const severityColor = (s: string) =>
    s === 'HIGH' ? '#ef4444' : s === 'MEDIUM' ? '#f59e0b' : '#22c55e'

  const trendColor = (t: string) =>
    t === '↑' ? '#22c55e' : t === '↓' ? '#ef4444' : '#9ca3af'

  const scoreColor = (s: number) =>
    s >= 8 ? '#22c55e' : s >= 6 ? '#f59e0b' : '#ef4444'

  const competitorRowsHtml = (competitors: any[]) =>
    competitors.map(c => `
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px 12px;font-size:13px;font-weight:600;color:#0a1628;">${c.name}</td>
        <td style="padding:10px 12px;font-size:13px;color:#374151;">${c.update}</td>
        <td style="padding:10px 12px;text-align:center;">
          <span style="display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;background:${threatColor(c.threat)}20;color:${threatColor(c.threat)};text-transform:uppercase;">${c.threat}</span>
        </td>
        <td style="padding:10px 12px;font-size:12px;color:#6b7280;font-style:italic;">${c.action}</td>
      </tr>`).join('')

  const opportunitiesHtml = report.opportunities.map((o: any, i: number) => `
    <tr style="border-bottom:1px solid #f3f4f6;">
      <td style="padding:10px 12px;font-size:13px;font-weight:700;color:#22c55e;">#${i + 1}</td>
      <td style="padding:10px 12px;">
        <div style="font-size:13px;font-weight:600;color:#0a1628;margin-bottom:3px;">${o.title}</div>
        <div style="font-size:12px;color:#6b7280;">${o.description}</div>
      </td>
      <td style="padding:10px 12px;font-size:13px;font-weight:600;color:#22c55e;white-space:nowrap;">${o.potentialRevenue}</td>
      <td style="padding:10px 12px;font-size:12px;color:#9ca3af;">${o.timeframe}</td>
    </tr>`).join('')

  const threatsHtml = report.threats.map((t: any, i: number) => `
    <tr style="border-bottom:1px solid #f3f4f6;">
      <td style="padding:10px 12px;">
        <div style="font-size:13px;font-weight:600;color:#0a1628;margin-bottom:3px;">${t.title}</div>
        <div style="font-size:12px;color:#6b7280;">${t.description}</div>
      </td>
      <td style="padding:10px 12px;text-align:center;">
        <span style="display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;background:${severityColor(t.severity)}20;color:${severityColor(t.severity)};text-transform:uppercase;">${t.severity}</span>
      </td>
      <td style="padding:10px 12px;font-size:12px;color:#374151;">${t.mitigation}</td>
    </tr>`).join('')

  const scorecardHtml = report.scorecard.map((s: any) => `
    <tr style="border-bottom:1px solid #f3f4f6;">
      <td style="padding:10px 12px;font-size:13px;color:#374151;">${s.dimension}</td>
      <td style="padding:10px 12px;text-align:center;">
        <span style="font-size:18px;font-weight:800;color:${scoreColor(s.score)};">${s.score}</span>
        <span style="color:#d1d5db;font-size:12px;">/10</span>
      </td>
      <td style="padding:10px 12px;text-align:center;font-size:18px;color:${trendColor(s.trend)};">${s.trend}</td>
      <td style="padding:10px 12px;font-size:12px;color:#6b7280;">${s.notes}</td>
    </tr>`).join('')

  const actionsHtml = report.actions.map((a: any) => `
    <tr style="border-bottom:1px solid #f3f4f6;">
      <td style="padding:10px 12px;text-align:center;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#22c55e;color:#0a1628;font-size:13px;font-weight:800;">${a.priority}</span>
      </td>
      <td style="padding:10px 12px;font-size:13px;font-weight:600;color:#0a1628;">${a.action}</td>
      <td style="padding:10px 12px;font-size:12px;color:#9ca3af;">${a.owner}</td>
      <td style="padding:10px 12px;font-size:12px;color:#9ca3af;">${a.deadline}</td>
      <td style="padding:10px 12px;font-size:12px;color:#6b7280;font-style:italic;">${a.metric}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Competitive Intelligence Report — ${report.weekLabel}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
<tr><td align="center">
<table width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;">

  <!-- Header -->
  <tr>
    <td style="background:#0a1628;padding:24px 32px;border-radius:12px 12px 0 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="color:#22c55e;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Greenspace E-mobility</div>
            <div style="color:white;font-size:20px;font-weight:800;">Weekly Competitive Intelligence Report</div>
            <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:4px;">${report.generatedDate} · ${report.weekLabel}</div>
          </td>
          <td align="right" style="vertical-align:top;">
            <span style="background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);color:#22c55e;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;white-space:nowrap;">CONFIDENTIAL</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Executive Summary -->
  <tr>
    <td style="background:#ffffff;padding:28px 32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#16a34a;margin-bottom:10px;">Executive Summary</div>
        <div style="font-size:15px;font-weight:700;color:#0a1628;margin-bottom:14px;line-height:1.4;">${report.executiveSummary.headline}</div>
        <ul style="margin:0;padding-left:18px;">
          ${report.executiveSummary.bullets.map((b: string) => `<li style="font-size:13px;color:#374151;margin-bottom:6px;line-height:1.5;">${b}</li>`).join('')}
        </ul>
      </div>
    </td>
  </tr>

  <!-- Competitor Panama -->
  <tr>
    <td style="background:#ffffff;padding:0 32px 24px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
      <div style="border-top:2px solid #f3f4f6;padding-top:24px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-size:16px;">🇵🇦</span>
          <span style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0a1628;">Competitor Landscape — Panama &amp; Central America</span>
        </div>
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px;line-height:1.6;">${report.competitorPanama.overview}</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Competitor</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Latest Development</th>
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Threat</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Our Response</th>
            </tr>
          </thead>
          <tbody>${competitorRowsHtml(report.competitorPanama.competitors)}</tbody>
        </table>
      </div>
    </td>
  </tr>

  <!-- Competitor Mexico -->
  <tr>
    <td style="background:#ffffff;padding:0 32px 24px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
      <div style="border-top:2px solid #f3f4f6;padding-top:24px;">
        <div style="margin-bottom:8px;">
          <span style="font-size:16px;">🇲🇽</span>
          <span style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0a1628;margin-left:8px;">Competitor Landscape — Mexico &amp; Texas Corridor</span>
        </div>
        <p style="font-size:13px;color:#6b7280;margin:0 0 16px;line-height:1.6;">${report.competitorMexico.overview}</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Competitor</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Latest Development</th>
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Threat</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Our Response</th>
            </tr>
          </thead>
          <tbody>${competitorRowsHtml(report.competitorMexico.competitors)}</tbody>
        </table>
      </div>
    </td>
  </tr>

  <!-- Opportunities & Threats (side by side) -->
  <tr>
    <td style="background:#ffffff;padding:0 32px 24px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
      <div style="border-top:2px solid #f3f4f6;padding-top:24px;">
        <div style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0a1628;margin-bottom:16px;">Market Opportunities &amp; Threats</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="48%" style="vertical-align:top;padding-right:8px;">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#22c55e;margin-bottom:8px;">🚀 Opportunities</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;">
                <thead><tr style="background:#f9fafb;">
                  <th style="padding:6px 10px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;">#</th>
                  <th style="padding:6px 10px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;">Opportunity</th>
                  <th style="padding:6px 10px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;">Value</th>
                  <th style="padding:6px 10px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;">When</th>
                </tr></thead>
                <tbody>${opportunitiesHtml}</tbody>
              </table>
            </td>
            <td width="4%"></td>
            <td width="48%" style="vertical-align:top;padding-left:8px;">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#ef4444;margin-bottom:8px;">⚠️ Threats</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;">
                <thead><tr style="background:#f9fafb;">
                  <th style="padding:6px 10px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;">Threat</th>
                  <th style="padding:6px 10px;text-align:center;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;">Sev.</th>
                  <th style="padding:6px 10px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;">Mitigation</th>
                </tr></thead>
                <tbody>${threatsHtml}</tbody>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </td>
  </tr>

  <!-- Scorecard -->
  <tr>
    <td style="background:#ffffff;padding:0 32px 24px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
      <div style="border-top:2px solid #f3f4f6;padding-top:24px;">
        <div style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0a1628;margin-bottom:16px;">📊 Greenspace Strategic Position Scorecard</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Dimension</th>
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Score</th>
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Trend</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Notes</th>
            </tr>
          </thead>
          <tbody>${scorecardHtml}</tbody>
        </table>
      </div>
    </td>
  </tr>

  <!-- Recommended Actions -->
  <tr>
    <td style="background:#ffffff;padding:0 32px 32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
      <div style="border-top:2px solid #f3f4f6;padding-top:24px;">
        <div style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0a1628;margin-bottom:16px;">⚡ Top 5 Actions This Week</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">#</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Action</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Owner</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">By</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Success Metric</th>
            </tr>
          </thead>
          <tbody>${actionsHtml}</tbody>
        </table>
      </div>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#0a1628;padding:20px 32px;border-radius:0 0 12px 12px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="font-size:11px;color:rgba(255,255,255,0.3);margin:0;line-height:1.6;">
              This report is generated automatically every Sunday by the Greenspace intelligence system.<br>
              Data is based on AI market knowledge — supplement with real-time competitor research.<br>
              © ${new Date().getFullYear()} Greenspace E-mobility · Confidential
            </p>
          </td>
          <td align="right" style="vertical-align:bottom;">
            <a href="https://www.gs-emobility.com" style="color:#22c55e;font-size:11px;text-decoration:none;font-weight:700;">gs-emobility.com</a>
          </td>
        </tr>
      </table>
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
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
    const year = now.getFullYear()

    console.log(`[Weekly Report] Generating competitive intelligence report for Week ${weekNumber}, ${year}`)

    // Generate report with Claude
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 8096,
      messages: [{ role: 'user', content: buildCompetitivePrompt(weekNumber, year) }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Could not parse report JSON')

    const report = JSON.parse(jsonMatch[0])
    console.log('[Weekly Report] Report generated successfully')

    // Build HTML email
    const html = buildReportEmail(report)

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
      from: `"Greenspace Intelligence" <${process.env.GMAIL_USER}>`,
      to: 'info@gs-emobility.com',
      subject: `📊 Weekly Intel Report — ${report.weekLabel}: ${report.executiveSummary.headline}`,
      html,
    })

    console.log('[Weekly Report] Email sent successfully')

    return NextResponse.json({
      success: true,
      week: weekNumber,
      year,
      headline: report.executiveSummary.headline,
      actionsCount: report.actions.length,
    })
  } catch (err) {
    console.error('[Weekly Report] Error:', err)
    return NextResponse.json({ error: 'Report generation failed', details: String(err) }, { status: 500 })
  }
}
